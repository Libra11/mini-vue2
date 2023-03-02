/*
 * @Author: Libra
 * @Date: 2023-03-02 17:57:55
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/compile/index.js
 */
// 将模板编译成render函数，就是把 html 模板转换成 js 代码，这样就可以在 js 中操作 dom 了
export function compileToFunctions(el) {

  let ast = parseHTML(el);
  
}

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名，例如： abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 标签名，例如： <abc-123:div>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 开始标签，例如： 匹配到 <div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 结束标签，例如： 匹配到 </div>
const startTagClose = /^\s*(\/?)>/; // 例如： 匹配到 >
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性 例如： 匹配到 id="app"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 例如： 匹配到 {{ msg }}

// 将 html 字符串转换成 ast 语法树
function parseHTML(html) {
  while(html) {
    let textEnd = html.indexOf('<');
    if (textEnd === 0) {
      // 如果是开始标签
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs);
        continue;
      }
      // 如果是结束标签
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    let text;
    if (textEnd >= 0) {
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
  }
}
