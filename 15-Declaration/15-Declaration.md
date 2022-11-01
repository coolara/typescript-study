#### 类型指令 

```js
// @ts-check
// 使用 JSDoc 标注变量类型
/** @type {string} */
const myName = 599; // 报错！

let myAge = 18;
myAge = '200'; // 报错！
// @ts-expect-error
myAge = '200'; // OK
```

#### 类型声明
```ts
declare var f1: () => void;

declare interface Foo {
  prop: string;
}

declare function foo(input: Foo): Foo;

declare class Foo {}

declare let otherProp: Foo['prop'];

// × 不允许在环境上下文中使用初始值
declare let result = foo();
```
除了手动书写这些声明文件，更常见的情况是你的 TypeScript 代码在编译后生成声明文件：
```ts
// 源代码
const handler = (input: string): boolean => {
  return input.length > 5;
}

interface Foo {
  name: string;
  age: number;
}

const foo: Foo = {
  name: "foo",
  age: 18
}

class FooCls {
  prop!: string;
}
```
编译后生成一个`.js`文件 和一个`.d.ts`文件
```ts
// 生成的类型定义
declare const handler: (input: string) => boolean;

interface Foo {
    name: string;
    age: number;
}

declare const foo: Foo;

declare class FooCls {
    prop: string;
}
```
> 通过额外的类型声明文件，在核心代码文件以外去提供对类型的进一步补全。类型声明文件，即 .d.ts 结尾的文件，它会自动地被` TS` 加载到环境中，实现对应部分代码的类型补全
```ts
// 通过declare module方式来提供类型
declare module 'pkg' {
  const handler: () => boolean;
}

//使用
import foo from "pkg"
foo.handler()

// 也可以默认导出
declare module 'pkg' {
  const handler: () => boolean;
  export default handler
}
// 使用
import bar from 'pkg'
bar()
```
使用类型声明我们还可以为非代码文件，如图片、`CSS`文件等声明类型。

```ts
// index.ts
import raw from './note.md';

const content = raw.replace('NOTE', `NOTE${new Date().getDay()}`);

// declare.d.ts
declare module '*.md' {
  const raw: string;
  export default raw;
}
```

#### `DefinitelyTyped`
>` @types/` 开头的这一类 `npm` 包均属于 `DefinitelyTyped` ，它是 `TypeScript` 维护的，专用于为社区存在的无类型定义的 `JavaScript` 库添加类型支持

先来看 `@types/node` 中与 `@types/react` 中分别是如何进行类型声明的：
```ts
// @types/node
declare module 'fs' { 
    export function readFileSync(/** 省略 */): Buffer;
}

// @types/react
declare namespace React {
    function useState<S>(): [S, Dispatch<SetStateAction<S>>];
}
```
#### 扩展已有的类型定义
```ts
// 扩展全局变量Window
interface Window {
  userTracker: (...args: any[]) => Promise<void>;
}

window.userTracker("click!")
// 扩展@types/包的类型定义

declare module 'fs' {
  export function bump(): void;
}

import { bump } from 'fs';
```

#### 三斜线指令
> 它的作用就是声明当前的文件依赖的其他类型声明。包括了 `TS` 内置类型声明（`lib.d.ts`）、三方库的类型声明以及你自己提供的类型声明文件
```ts
/// <reference path="./other.d.ts" />
/// <reference types="node" />
/// <reference lib="dom" />
```
需要注意的是，三斜线指令必须被放置在文件的顶部才能生效。
- `path` : 使用 `path` 的 `reference` 指令，其 `path` 属性的值为一个相对路径，指向你项目内的其他声明文件。
- `types` : `types` 的值是一个包名，也就是你想引入的 `@types/` 声明
- `lib` : `lib` 导入的是 `TypeScript` 内置的类型声明

#### 命名空间
```ts
export namespace RealCurrency {
  export class WeChatPaySDK {}

  export class ALiPaySDK {}

  export class MeiTuanPaySDK {}

  export class CreditCardPaySDK {}
}
```

#### 仅类型导入
```ts
import type { FooType } from "./foo";

//（需要 4.6 版本以后才支持）：

import { Foo, type FooType } from "./foo";
```


#### 通过 `JSDoc` 在 `JS` 文件中获得类型提示
```js
/** @type {import("webpack").Configuration} */
const config = {
    // 有代码提示
};

module.exports = config;

module.exports = /** @type { import('webpack').Configuration } */ ({
    
});
```