/*
 * @Author: Libra
 * @Date: 2023-03-02 17:57:55
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/compile/index.js
 */

import { parseHTML } from "./parseAst";

// 将模板编译成render函数，就是把 html 模板转换成 js 代码，这样就可以在 js 中操作 dom 了
export function compileToFunctions(el) {
  let ast = parseHTML(el);
  console.log(ast);
}