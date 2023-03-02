/*
 * @Author: Libra
 * @Date: 2023-03-02 16:00:11
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/observe/index.js
 */
import { arrayMethods } from "./arr";
export function observe(data) {
  // 如果是对象才观测
  if (typeof data !== 'object' || data == null) {
    return data;
  }
  // 返回一个观察者
  return new Observer(data);
}

class Observer {
  constructor(value) {
    Object.defineProperty(value, '__ob__', {
      enumerable: false, // 不能被枚举，不能被循环出来
      value: this,
    })
    // 判断值是不是数组
    if (Array.isArray(value)) {
      // 如果是数组，不对索引进行观测，因为会导致性能问题
      // 前端开发中很少去操作索引，一般都是通过push shift unshift pop splice
      // 如果数组中放的是对象，再监控
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(data) {
    // 遍历对象
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    });
  }

  observeArray(data) {
    // 遍历数组 递归对数组中的对象进行观测
    data.forEach(item => observe(item));
  }
}

function defineReactive(data, key, value) {
  observe(value); // 递归实现深度检测
  // Object.defineProperty 缺点： 只能劫持对象的一个属性，如果属性的值是对象，就无法劫持了
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (newValue !== value) {
        observe(newValue); // 如果用户将值改为一个对象，也需要监控
        value = newValue;
      }
    }
  });
}