/*
 * @Author: Libra
 * @Date: 2023-03-03 15:56:53
 * @LastEditors: Libra
 * @Description: 
 * @FilePath: /mini-vue2/src/compile/parseAst.js
 */

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名，例如： abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 标签名，例如： <abc-123:div>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 开始标签，例如： 匹配到 <div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 结束标签，例如： 匹配到 </div>
const startTagClose = /^\s*(\/?)>/; // 例如： 匹配到 >
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性 例如： 匹配到 id="app"
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 例如： 匹配到 {{ msg }}

// 根元素
let root = null;
// 当前父元素
let currentParent = null;
// 栈结构，用来存放每个元素
let stack = [];


// 将 html 字符串转换成 ast 语法树
export function parseHTML(html) {
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
        // endTagMatch: ['</div>', 'div', index: 0, input: '</div>', groups: undefined]
        advance(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
    let text;
    // 为什么是 textEnd >= 0，因为如果是 0，就是开始标签了，不是文本
    // textEnd = 5, html = 'hello</div>'
    if (textEnd >= 0) {
      // text = 'hello'
      text = html.substring(0, textEnd);
    }
    if (text) {
      advance(text.length);
      chars(text);
    }
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    // 判断是否是开始标签 因为有可能是结束标签 </div>
    if (start) {
      const match = {
        // html: '<div id="app">hello</div>'
        // <div>: start = ['<div', 'div', index: 0, input: '<div id="app">hello</div>', groups: undefined]
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length); // 将 html 字符串截取掉 <div
      // 匹配属性 id="app" 和 结尾标签 >
      let end, attr;
      // 如果没有匹配到结束标签 >，并且匹配到了属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // [' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app">hello</div>', groups: undefined]
        // 将 html 字符串截取掉 id="app"
        advance(attr[0].length);
        match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
      }
      // 如果匹配到了结束标签 > ，则将 html 字符串截取掉 >
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }
  // 将 html 字符串截取掉 n 个字符
  function advance(n) {
    html = html.substring(n);
  }
  // 返回最后的 ast 语法树
  return root;
}

function start(tagName, attrs) {
  // 创建 ast 语法树
  let element = createASTElement(tagName, attrs);
  // 判断如果没有根元素，则将当前元素作为根元素
  if (!root) {
    root = element;
  }
  // 把 element 元素赋值给 currentParent，因为 element 元素可能有子元素，所以需要将 element 元素赋值给 currentParent
  currentParent = element;
  stack.push(element);
}

function end(tagName) {
  let element = stack.pop();
  // 将当前元素的 parent 指向 currentParent
  currentParent = stack[stack.length - 1];
  if (currentParent) {
    element.parent = currentParent;
    currentParent.children.push(element);
  }
  /**
   * <div id="app">
   *  <span>hello</span>
   * </div>
   * 
   * currentParent { tag: 'div', type: 1, children: [ { tag: 'span', type: 1, children: [], attrs: [], parent: [Circular] } ], attrs: [ { name: 'id', value: 'app' } ], parent: null }
   * 
   */
}

function chars(text) {
  // 去掉空格
  text = text.replace(/\s/g, '');
  if (text) {
    currentParent.children.push({
      type: 3,
      text
    });
  }
}

// 创建 ast 语法树
function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    // 1: 元素 3: 文本
    type: 1,
    children: [],
    attrs,
    parent: null
  };
}