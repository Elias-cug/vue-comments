/* @flow */

import { mergeOptions } from '../util/index'

// 向全局注册一个混入
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
