/*
 * @Author: Libra
 * @Date: 2023-03-02 16:19:44
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/observe/arr.js
 */
// 重写数组的方法
// 7个变异方法 push shift unshift pop reverse sort splice
// 4个非变异方法 concat slice filter map
let oldArrayProtoMethods = Array.prototype;
export let arrayMethods = Object.create(oldArrayProtoMethods);

let methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    // 数组劫持
    // 调用原生的数组方法
    oldArrayProtoMethods[method].apply(this, args);
    // push unshift 添加的元素可能还是一个对象
    let inserted;
    // 这里的this指向的是调用的数组
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
  }
})
