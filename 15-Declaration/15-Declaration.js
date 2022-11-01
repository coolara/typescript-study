// 使用 JSDoc 标注变量类型
// @ts-check
/** @type {string} */
let myName;
myName = 19

class Foo {
  prop = 599;
}

/** @type {import("webpack").Configuration} */
const config = {
    // 有代码提示
};

module.exports = config;
