
```ts
interface IRes {
    code: number;
    status: string;
    data: any
}
```
在大多数情况下，我们需要更确定的一些值，比如code是200，400，500，status是success, failed。
```ts
interface Res {
    code: 200 | 400 | 500,
    status: "success"| "failed",
    data: any
}
// 如果需要将类型当变量使用的话,需要这样
declare const res : Res
res.status
```
#### 字面量类型
> 字面量类型主要包括字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型
```ts
const str: 'foo' = 'foo'
const num: 19 = 19
const bool: true = true

const str: 'foo' = 'foo1' //  foo1不能分配给foo类型
```
要求值与他的类型一致

#### 联合类型
> 代表了各种类型的集合
```ts
interface Tmp {
    mixed: true | string | 18 | {} | (() => {}) | (1 | 2)
}
```
函数需要`()`包裹起来，嵌套的联合类型会被展平到第一级中

实现互斥属性
```ts
interface T1 {
    user: 
    | {
        vip: true,
        expires : string
    }
    | {
        vip: false,
        promotion : string
    }
}
declare var t1: T1
t1.user.vip ? t1.user.expires: t1.user.promotion // 使用涉及类型守卫与类型控制流分析
```

#### 对象字面量类型
```ts
interface Tmp {
  obj: {
    name: "foo",
    age: 18
  }
}

const tmp: Tmp = {
  obj: {
    name: "foo",
    age: 18
  }
}
```
> 需要注意的是，无论是原始类型还是对象类型的字面量类型，它们的本质都是类型而不是值。它们在编译时同样会被擦除，同时也是被存储在内存中的类型空间而非值空间。

#### 枚举
```ts
// js中
export const PageUrl1 = {
  Home_Page_Url = "url1",
  Setting_Page_Url = "url2",
  Share_Page_Url = "url3",
}
// 枚举
enum PageUrl2 {
  Home_Page_Url = "url1",
  Setting_Page_Url = "url2",
  Share_Page_Url = "url3",
}

const home = PageUrl.Home_Page_Url;
```
```ts
enum Items {
  Foo,
  Bar,
  Baz
}
```
如果没有声明值，默认从0开始，以1递增
```ts
enum Items {
  Foo,
  Bar = 19,
  Baz
}
```
如果指定了值，之前的未赋值成员以0开始递增，之后的从枚举值开始递增

在枚举中使用延迟求值
```ts
const returnNum = () => 1 + 1
enum Items {
  Bar = 19,
  Foo = returnNum(),
  Baz
}
```
延迟求值的后面那个成员必须初始化一个值

数字和字符串混用
```ts
enum Mixed {
  Num = 599,
  Str = "foo"
}
```
##### 枚举和对象的区别：
> 对象是单向映射（键—>值），枚举是双向的（键->值，值->键）(注意：仅有值为数字的枚举)
```ts
enum Items {
  Foo,
  Bar,
  Baz
}

const fooValue = Items.Foo; // 0
const fooKey = Items[0]; // "Foo"
```

##### 常量枚举
```ts
const enum Items {
  Foo,
  Bar,
  Baz
}

```
 常量枚举编译产物没有额外的对象`Items`
```js
"use strict";
const returnNum = () => 1 + 1;
var Items;
(function (Items) {
    Items[Items["Foo"] = returnNum()] = "Foo";
    Items[Items["Bar"] = 19] = "Bar";
    Items[Items["Baz"] = 20] = "Baz";
})(Items || (Items = {}));
```
#### 字面量类型推导
```ts
let s1 = 'foo'  //s1是string类型
const s2 = 'foo' // s2被推导为foo类型，因为它不能再次赋值了
```

