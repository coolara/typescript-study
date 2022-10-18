## `TypeScript`工具类型
如果按照使用方式来划分，类型工具可以分成三类：**操作符**、**关键字**与**专用语法**。我们会在这两节中掌握这些不同的使用方式，以及如何去结合地进行使用。

- 操作符： ` keyof `、`typeof` 、`ReturnType`
- 关键字： `type`、 `interface`、 `is`
- 专用语法：交叉类型、索引类型（签名类型，查询，访问）、映射类型、类型守卫

而按照使用目的来划分，类型工具可以分为 **类型创建** 与 **类型安全保护** 两类。
- 类型创建
- 类型安全保护

### 类型创建
#### 类型别名
```ts
type A = string;
```
我们通过` type` 关键字声明了一个类型别名` A` ; 也可以使用`type`声明一个比较复杂的类型（联合类型，函数，对象，类），这样就很方便复用

> 多了个泛型就摇身变成了工具类型
```ts
type Factory<T> = T | number | string;
```

从这个角度看，工具类型就像一个函数一样，泛型是入参，内部逻辑基于入参进行某些操作，再返回一个新的类型。这就是**类型创建**

当然，我们一般不会直接使用工具类型来做类型标注，而是再度声明一个新的类型别名：
```ts
type FactoryWithBool = Factory<boolean>;

const foo: FactoryWithBool = true;
```

#### 交叉类型
```ts
type StrAndNum = string & number; // never
```
对于原始类型，存在既是 `string` 又是 `number` 的类型吗？当然不。实际上，这也是 `never` 这一 `BottomType` 的实际意义之一，描述根本不存在的类型嘛。
```ts
interface NameStruct {
  common: number
  name: string
}

interface AgeStruct {
  common: string
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;


type PrimitivePropType = Composed['primitiveProp']; // never

const profile: ProfileStruct = {
  age: 18,
  name: 'foo'
  common: never
}
```
对于接口，`ProfileStruct`是同时包含两个接口所有属性的新类型。

相同属性名称的同样会按照交叉类型进行合并

总结一下交叉类型和联合类型的区别就是，联合类型只需要符合成员之一即可（`|`），而交叉类型需要严格符合每一位成员（`&`）

#### 索引类型

它其实包含三个部分：索引签名类型、索引类型查询与索引类型访问。

索引签名类型是声明，后两者则是读取。

索引签名类型主要指的是在接口或类型别名中，通过以下语法来快速声明一个键值类型一致的类型结构：
```ts
interface AllStringTypes {
  [key: string]: string;
}

type AllStringTypes = {
  [key: string]: string;
}

const strfoo: AllStringTypes = {
  "foo": "599",
  599: "foo",
  [Symbol("ddd")]: 'symbol',
}
```
但由于 `JavaScript` 中，对于 `obj[prop]` 形式的访问会将数字索引访问转换为字符串索引访问，也就是说，` obj[599]` 和 `obj['599']` 的效果是一致的可以声明数字类型的键。类似的，`symbol` 类型也是如此

索引签名类型也可以和具体的键值对类型声明并存，所以这些具体的键值类型也需要符合索引签名类型的声明：
```ts
interface AllStringTypes {
  // 类型“number”的属性“propA”不能赋给“string”索引类型“boolean”。
  propA: number;
  [key: string]: boolean;
}
//这个就是正确的了
interface StringOrBooleanTypes {
  propA: number;
  propB: boolean;
  [key: string]: number | boolean;
}
```
#### 索引类型查询
`keyof`它可以将对象中的所有键转换为对应字面量类型，然后再组合成联合类型
```ts
interface Foo {
  foo: 1,
  599: 2
}

type FooKeys = keyof Foo; // "foo" | 599
```
这里并不会将数字类型的键名转换为字符串类型字面量，而是仍然保持为数字类型字面量

#### 索引类型访问

```ts
interface NumberRecord {
  [key: string]: number;
}

type PropType = NumberRecord[string]; // number
```
我们使用 `string` 这个类型来访问 `NumberRecord`。由于其内部声明了数字类型的索引签名，这里访问到的结果即是 `number` 类型。注意，其访问方式与返回值均是类型。

```ts
interface Foo {
  propA: number;
  propB: boolean;
  [key: number]: boolean;
}

type PropAType = Foo['propA']; // number
type PropBType = Foo['propB']; // boolean

type StringType = Foo[string] // Foo是没有索引类型的
```

#### 映射类型
映射类型指的就是一个确切的类型工具，映射类型的主要作用即是基于键名映射到键值类型
```ts
type Stringify<T> = {
  [K in keyof T]: string;
};

```
使用 `keyof` 获得这个对象类型的键名组成字面量联合类型，然后通过映射类型（即这里的 `in` 关键字）将这个联合类型的每一个成员映射出来，并将其键值类型设置为 `string`。

```ts
type Clone<T> = {
  [K in keyof T]: T[K];
};
```
这样就可以把原来的类型完整复制过来


### 类型的安全保障
#### 类型查询
```ts
const str = 'string'
type A = typeof str
```
#### 类型守卫

它会随着你的代码逻辑不断尝试收窄类型，这一能力称之为类型的控制流分析（类型推导）
`typeof`除了查询，还能做守卫
```ts
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  // 一定是字符串！
  strOrNumOrBool.charAt(1);
} else if (typeof strOrNumOrBool === "number") {
  // 一定是数字！
  strOrNumOrBool.toFixed();
} else if (typeof strOrNumOrBool === "boolean") {
  // 一定是布尔值！
  strOrNumOrBool === true;
} else {
  // 要是走到这里就说明有问题！
  const _exhaustiveCheck: never = strOrNumOrBool;
  throw new Error(`Unknown input type: ${_exhaustiveCheck}`);
}

```
但如果引用了外部逻辑呢
```ts
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}

```
这里需要用`is`关键字来显示提供类型信息
```ts
function isString(input: unknown): input is string{
    return typeof input === "string"
}
```

#### `in` 和 `instanceof`
```ts
interface Foo {
  kind: 'foo';
  diffType: string;
  fooOnly: boolean;
  shared: number;
}

interface Bar {
  kind: 'bar';
  diffType: number;
  barOnly: boolean;
  shared: number;
}

function handle1(input: Foo | Bar) {
  if (input.kind === 'foo') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}

function handle2(input: Foo | Bar) {
  // 报错，并没有起到区分的作用，在两个代码块中都是 Foo | Bar
  if (typeof input.diffType === 'string') {
    input.fooOnly;
  } else {
    input.barOnly;
  }
}
```
```ts
class FooBase {}

class BarBase {}

class Foo extends FooBase {
  fooOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(input: Foo | Bar) {
  if (input instanceof FooBase) {
    input.fooOnly();
  } else {
    input.barOnly();
  }
}
```
#### 断言守卫
如果你写过测试用例或者使用过 NodeJs 的 assert 模块，那对断言这个概念应该不陌生：

```ts
import assert from 'assert';

let name: any = 'linbudu';

assert(typeof name === 'number');

// number 类型
name.toFixed();

```
因为 `assert` 接收到的表达式执行结果为 `false`。这其实也类似类型守卫的场景：如果断言不成立，比如在这里意味着值的类型不为 `number`，那么在断言下方的代码就执行不到（相当于 `Dead Code`）

但断言守卫和类型守卫最大的不同点在于，在判断条件不通过时，断言守卫需要抛出一个错误，类型守卫只需要剔除掉预期的类型。

#### 接口的合并(继承合并)
子接口中的属性类型需要能够兼容（`extends`）父接口中的属性类型

```ts
interface Struct1 {
  primitiveProp: string;
  objectProp: {
    name: string;
  };
  unionProp: string | number;
}

// 接口“Struct2”错误扩展接口“Struct1”。
interface Struct2 extends Struct1 {
  // “primitiveProp”的类型不兼容。不能将类型“number”分配给类型“string”。
  primitiveProp: number;
  // 属性“objectProp”的类型不兼容。
  objectProp: {
    age: number;
  };
  // 属性“unionProp”的类型不兼容。
  // 不能将类型“boolean”分配给类型“string | number”。
  unionProp: boolean;
}
```

类似的，如果你直接声明多个同名接口，虽然接口会进行合并，但这些同名属性的类型仍然需要兼容，此时的表现其实和显式扩展接口基本一致：
```ts
interface Struct1 {
  primitiveProp: string;
}

interface Struct1 {
// 后续属性声明必须属于同一类型。
// 属性“primitiveProp”的类型必须为“string”，但此处却为类型“number”。
  primitiveProp: number;
}
```
这也是接口和类型别名的重要差异之一。

那么接口和类型别名之间的合并呢？其实规则一致，如接口继承类型别名，和类型别名使用交叉类型合并接口：

```ts
type Base = {
  name: string;
};

interface IDerived extends Base {
  // 报错！就像继承接口一样需要类型兼容
  name: number;
  age: number;
}

interface IBase {
  name: string;
}

// 合并后的 name 同样是 never 类型
type Derived = IBase & {
  name: number;
};
```