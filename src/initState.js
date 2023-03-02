/*
 * @Author: Libra
 * @Date: 2023-03-02 15:47:05
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/initState.js
 */
import { observe } from './observe/index.js';
export function initState(vm) {
  let opts = vm.$options; // vue的数据来源 属性 方法 数据 计算属性 watch
  // 初始化属性
  if (opts.props) {
    initProps(vm); // 初始化props
  }

  if (opts.methods) {
    initMethods(vm); // 初始化methods
  }

  if (opts.data) {
    initData(vm); // 初始化data
  }

  if (opts.computed) {
    initComputed(vm); // 初始化computed
  }

  if (opts.watch) {
    initWatch(vm); // 初始化watch
  }
}

function initProps() {}

function initMethods() {}

// 初始化数据
function initData(vm) {
  let data = vm.$options.data; // 用户传递的data
  // 判断data是不是一个函数，如果是函数就取返回值，如果不是函数就直接使用
  // 如果直接调用data()，this指向的是window，所以需要改变this指向
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 代理 vm._data.name => vm.name
  // 为什么要代理？因为我们在模板中取值的时候，取的是vm上的属性，但是我们的数据都在vm._data上，所以需要代理
  for (let key in data) {
    proxy(vm, '_data', key);
  }

  observe(data); // 响应式原理
}

// 代理data中的数据到vm上
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  });
}

function initComputed() {}

function initWatch() {}

