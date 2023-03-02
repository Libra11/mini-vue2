/*
 * @Author: Libra
 * @Date: 2023-03-02 15:28:00
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/index.js
 */
import { initMixin } from './init.js';
function Vue(options) {
  // 初始化
  this._init(options);
}
initMixin(Vue);
export default Vue