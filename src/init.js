/*
 * @Author: Libra
 * @Date: 2023-03-02 15:42:40
 * @LastEditors: Libra
 * @Description: 初始化
 * @FilePath: /mini-vue2/src/init.js
 */
import { compileToFunctions } from './compile/index.js';
import { initState } from './initState.js';
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    let vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
    vm.$options = options; // 初始化状态
    // 初始化状态
    initState(vm);
    // 如果用户传入了el属性，则需要将页面渲染出来
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  },
  // 创建 $mount 方法
  Vue.prototype.$mount = function (el) {
    let vm = this;
    let options = vm.$options;
    el = document.querySelector(el);
    // render > template > el
    // 如果没有render 就采用template, render优先级最高
    if (!options.render) {
      // 没有render 就采用template
      let template = options.template;
      if (!template && el) {
        template = el.outerHTML;
      }
      // 将模板编译成render函数
      let render = compileToFunctions(template);
      options.render = render;
    }
    // 挂载组件
    // mountComponent(vm, el);
  };
}
