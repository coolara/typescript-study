### 类型层级
`TypeScript` 中所有类型的兼容关系，从最上面一层的 `any` 类型，到最底层的 `never` 类型。
#### 判断类型兼容的方式
- `extends`
- 赋值的方式
```ts
// extends
type R = 'foo' extends string ? 1 ：2
// 赋值
declare let source: string;
declare let anyType: any
declare let neverType: never
anyType = source
neverType = source // 不能将类型string分配给never
```
#### 原始类型
```ts
type R1 = "foo" extends string ? 1: 2 //1
type R2 = 1 extends number ? 1: 2 //1
type R3 = true extends boolean ? 1: 2 //1
type R4 = {name: string } extends object ? 1: 2 //1
type R5 = {name: foo} extends object ? 1: 2 //1
type R6 = [] extends object ? 1: 2 //1
```
> 我们将结论简记为，字面量类型 < 对应的原始类型

接着向上、向下去探索类型层级

向上探索
#### 联合类型
```ts
// 字面量类型
type R7 = 1 extends 1 | 2 | 3 ? 1:2 //1
type R8 = 'foo' extends "foo" | "bar" ? 1:2//1
type R9 = true extends true | false ? 1:2//1
// 原始类型
type R10 = string extends string | false | number ? 1:2//1
```
> 结论：字面量类型 < 包含此字面量类型的联合类型，原始类型 < 包含此原始类型的联合类型
```ts
type R11 = 'foo' | 'bar' | 'baz' extends string ? 1 : 2; // 1
type R12 = {} | (() => void) | [] extends object ? 1 : 2; // 1
```
> 结论：字面量类型 < 包含此字面量类型的联合类型 < 对应的原始类型 < 原始类型的联合类型

#### 装箱类型
```ts
type R14 = string extends String ? 1 : 2; // 1
type R15 = String extends {} ? 1 : 2; // 1
type R16 = {} extends object ? 1 : 2; // 1
type R18 = object extends Object ? 1 : 2; // 1
```
`{}`是`object`的字面量类型，可以认为`String`继承了`{}`然后实现了下面这些方法

```ts
interface String{
    replace: //..
    replaceAll: //..
}
```
`type Tmp = string extends object ? 1 : 2; // 2`

```ts
type R16 = {} extends object ? 1 : 2; // 1
type R18 = object extends {} ? 1 : 2; // 1

type R17 = object extends Object ? 1 : 2; // 1
type R20 = Object extends object ? 1 : 2; // 1

type R19 = Object extends {} ? 1 : 2; // 1
type R21 = {} extends Object ? 1 : 2; // 1
```
`{} extends object `和 `{} extends Object` 意味着，`{}`是 `object` 和 `Object` 的字面量类型

`object extends {} `和 `Object extends {}` 则是从结构化类型系统的比较出发的，即 `{}`作为一个一无所有的空对象，几乎可以被视作是所有类型的基类，万物的起源。

而 `object extends Object` 和 `Object extends object` 这两者的情况就要特殊一些，它们是因为“系统设定”的问题，`Object` 包含了所有除 `Top Type` 以外的类型（基础类型、函数类型等），`object` 包含了所有非原始类型的类型，即数组、对象与函数类型，这就导致了你中有我、我中有你的神奇现象
> 结论为：原始类型 < 原始类型对应的装箱类型 < `Object` 类型。

#### `Top Type`
这里只有 any 和 unknown 这两兄弟。
```ts
type R22 = Object extends any ? 1 : 2; // 1
type R23 = Object extends unknown ? 1 : 2; // 1

type R24 = any extends Object ? 1 : 2; // 1 | 2
type R25 = unknown extends Object ? 1 : 2; // 2

type R26 = any extends 'foo' ? 1 : 2; // 1 | 2
type R27 = any extends string ? 1 : 2; // 1 | 2
type R28 = any extends {} ? 1 : 2; // 1 | 2
type R29 = any extends never ? 1 : 2; // 1 | 2
```
`any extends` 时，它包含了“让条件成立的一部分”，以及“让条件不成立的一部分”。从实现上说，在 `TypeScript` 内部代码的条件类型处理中，如果接受判断的是` any`，那么会直接返回条件类型结果组成的联合类型。

```ts
type R31 = any extends unknown ? 1 : 2;  // 1
type R32 = unknown extends any ? 1 : 2;  // 1
```
结论为：Object < any / unknown。

#### 向下探索`never`类型
```ts
type R33 = never extends 'foo' ? 1 : 2; // 1

type R34 = undefined extends 'foo' ? 1 : 2; // 2
type R35 = null extends 'foo' ? 1 : 2; // 2
type R36 = void extends 'foo' ? 1 : 2; // 2
// 上面三种情况当然不应该成立。别忘了在 TypeScript 中，void、undefined、null 都是切实存在、有实际意义的类型，它们和 string、number、object 并没有什么本质区别。
```
> 结论：`never` < 字面量类型