## 文件内容说明
存放构建后的文件

### 文件说明
1. 完整版

   vue.js vue.common.js vue.esm.js

2. 只包含运行时版本

   vue.runtime.js vue.runtime.common.js vue.runtime.esm.js

3. 完整版（生产环境）

   vue.min.js

4. 只包含运行时版本（生产环境）

   vue.runtime.min.js

### 名词介绍

1. 完整版

   构建后的文件同时包含编译器和运行时

2. 编译器

   负责将模板字符串编译成 JavaScript 渲染函数。

3. 运行时

  负责创建 Vue.js 实例，渲染视图和使用虚拟 DOM 实现重新渲染，基本包含除编译器外的所有部分

4. UMD

   UMD 版本的文件可以通过 < script > 标签直接在浏览器中使用。jsDelivr CDN提供的可以在线引入的 Vue.js 的地址（https://cdn.jsdelivr.net/npm/vue），就是运行时 + 编译器的UMD版本

5. CommonJS

   CommonJs 版本用来配合比较旧的打包工具，这些打包工具的默认文件置包含运行时的CommonJs版本（run.runtime.common.js）

6. ES Module

   ES Module 版本用来配合现代打包工具，这些打包工具的默认文件置包含运行时的ESModule版本（vue.runtime.esm.js）

7. 运行时 + 编译器与只包含运行时

   *.vue 文件内部的模板会在构建时使用 vue-loader 或 vueify 预编译为 JavaScript。所以最终打包完成的文件实际上时不需要编译器的，只需要引入运行时版本即可。

   如果需要在客户端编译模板（比如传入一个字符串给 template 选项，或挂载到一个元素上并以其DOM内部的HTML作为模板），那么需要用到编译器，因此需要用到编译版。

   ```js
   new Vue({
     template: '<div>需要编译器</div>'
   })
   ```

8. 开发环境与生产环境模式

   对于 UMD 版本来说，开发环境和生产环境二者的模式是硬编码的：开发环境使用未压缩的代码，生产环境使用的是压缩版本的。

   对于 CommonJS 和 ESM 版本用于打包工具。

## Explanation of Build Files

| | UMD | CommonJS | ES Module |
| --- | --- | --- | --- |
| **Full** | vue.js | vue.common.js | vue.esm.js |
| **Runtime-only** | vue.runtime.js | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)** | vue.min.js | | |
| **Runtime-only (production)** | vue.runtime.min.js | | |

### Terms

- **Full**: builds that contain both the compiler and the runtime.

- **Compiler**: code that is responsible for compiling template strings into JavaScript render functions.

- **Runtime**: code that is responsible for creating Vue instances, rendering and patching virtual DOM, etc. Basically everything minus the compiler.

- **[UMD](https://github.com/umdjs/umd)**: UMD builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/vue](https://unpkg.com/vue) is the Runtime + Compiler UMD build (`vue.js`).

- **[CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1)**: CommonJS builds are intended for use with older bundlers like [browserify](http://browserify.org/) or [webpack 1](https://webpack.github.io). The default file for these bundlers (`pkg.main`) is the Runtime only CommonJS build (`vue.runtime.common.js`).

- **[ES Module](http://exploringjs.com/es6/ch_modules.html)**: ES module builds are intended for use with modern bundlers like [webpack 2](https://webpack.js.org) or [rollup](http://rollupjs.org/). The default file for these bundlers (`pkg.module`) is the Runtime only ES Module build (`vue.runtime.esm.js`).

### Runtime + Compiler vs. Runtime-only

If you need to compile templates on the fly (e.g. passing a string to the `template` option, or mounting to an element using its in-DOM HTML as the template), you will need the compiler and thus the full build.

When using `vue-loader` or `vueify`, templates inside `*.vue` files are compiled into JavaScript at build time. You don't really need the compiler in the final bundle, and can therefore, use the runtime-only build.

Since the runtime-only builds are roughly 30% lighter-weight than their full-build counterparts, you should use it whenever you can. If you wish to use the full build instead, you need to configure an alias in your bundler.

#### Webpack

``` js
module.exports = {
  // ...
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  }
}
```

#### Rollup

``` js
const alias = require('rollup-plugin-alias')

rollup({
  // ...
  plugins: [
    alias({
      'vue': 'vue/dist/vue.esm.js'
    })
  ]
})
```

#### Browserify

Add to your project's `package.json`:

``` js
{
  // ...
  "browser": {
    "vue": "vue/dist/vue.common.js"
  }
}
```

### Development vs. Production Mode

Development/production modes are hard-coded for the UMD builds: the un-minified files are for development, and the minified files are for production.

CommonJS and ES Module builds are intended for bundlers, therefore we don't provide minified versions for them. You will be responsible for minifying the final bundle yourself.

CommonJS and ES Module builds also preserve raw checks for `process.env.NODE_ENV` to determine the mode they should run in. You should use appropriate bundler configurations to replace these environment variables in order to control which mode Vue will run in. Replacing `process.env.NODE_ENV` with string literals also allows minifiers like UglifyJS to completely drop the development-only code blocks, reducing final file size.

#### Webpack

Use Webpack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/):

``` js
var webpack = require('webpack')

module.exports = {
  // ...
  plugins: [
    // ...
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}
```

#### Rollup

Use [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace):

``` js
const replace = require('rollup-plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
}).then(...)
```

#### Browserify

Apply a global [envify](https://github.com/hughsk/envify) transform to your bundle.

``` bash
NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
```
