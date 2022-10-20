### 内置类型：`any` `unknown` `never`

首先是内置的可用于标注的类型，包括 `any`、`unknown` 与 `never`.

#### any
为了能够表示“任意类型”，`TypeScript` 中提供了一个内置类型 `any `

```ts
// any
let foo;

// foo、bar 均为 any
function func(foo, bar){}
```
如果启用了 `noImplicitAny` 时函数声明会报错，需要显式指定`any`类型

```ts
// 被标记为 any 类型的变量可以拥有任意类型的值
let anyVar: any = "foo";
anyVar = false;
anyVar = {
  site: "juejin"
};

anyVar = () => { }
// 标记为具体类型的变量也可以接受任何 any 类型的值
const val1: string = anyVar;
const val2: number = anyVar;
const val3: () => {} = anyVar;
const val4: {} = anyVar;
```
你可以在 any 类型变量上任意地进行操作，包括赋值、访问、方法调用等等，此时可以认为类型推导与检查是被完全禁用的

```ts
let anyVar: any = null;

anyVar.foo.bar.baz();
anyVar[0][1][2].prop1;
```
> `any `的本质是类型系统中的顶级类型，即 `Top Type`

- 如果是类型不兼容报错导致你使用 `any`，考虑用类型断言替代，我们下面就会开始介绍类型断言的作用。
- 如果是类型太复杂导致你不想全部声明而使用` any`，考虑将这一处的类型去断言为你需要的最简类型。如你需要调用 `foo.bar.baz()`，就可以先将 `foo` 断言为一个具有 bar 方法的类型。
- 如果你是想表达一个未知类型，更合理的方式是使用 `unknown`。

#### `unknown`
`unknown `类型和 `any `类型有些类似，一个 `unknown` 类型的变量可以再次赋值为任意其它类型，但只能赋值给` any` 与 `unknown` 类型的变量：

`unknown` 和 `any` 的一个主要差异体现在赋值给别的变量时

```ts
let unknownVar: unknown;

unknownVar.foo(); // 报错：对象类型为 unknown
```
报错可以通过断言来解决
```ts
let unknownVar: unknown;

(unknownVar as {foo:()=>{}}).foo(); // 这样就不会报错了
```
> 目前的类型层级 `any`/`unknown` -> 原始类型、对象类型 -> 字面量类型

#### 什么都没有的类型`never`
```ts
type UnionWithNever = "foo" | 599 | true | void | never;

// 鼠标悬浮类型别名上，never直接被忽略了
```
`never` 类型被称为 `Bottom Type`

```ts
function justThrow(): never {
  throw new Error()
}
function foo (input:number){
  if(input > 1){
    justThrow();
    // 等同于 return 语句后的代码，即 Dead Code
    const name = "foo";
  }
}
```

```ts
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  console.log("str!");
} else if (typeof strOrNumOrBool === "number") {
  console.log("num!");
} else if (typeof strOrNumOrBool === "boolean") {
  console.log("bool!");
} else {
      console.log(typeof strOrNumOrBool) // never
  throw new Error(`Unknown input type: ${strOrNumOrBool}`);
}
```

`never `其实还会在某些情况下不请自来。比如说，你可能遇到过这样的类型错误：
```ts
// 这种情况仅会在你启用了 strictNullChecks 配置，同时禁用了 noImplicitAny 配置时才会出现
const arr = []
arr.push('foo') //Argument of type 'string' is not assignable to parameter of type 'never'.
```

#### 类型断言
> 语法 `as NewType`
```ts
let unknownVar: unknown;

(unknownVar as { foo: () => {} }).foo();

function foo(union: string | number) {
  if ((union as string).includes("foo")) { }

  if ((union as number).toFixed() === '19') { }
}
```

除了使用 `as` 语法以外，你也可以使用 <> 语法。
你也可以通过 `TypeScript ESLint` 提供的`consistent-type-assertions` 规则来约束断言风格。

需要注意的是，类型断言应当是在迫不得己的情况下使用的。

#### 双重断言
在使用类型断言时，原类型和断言类型之间差异过大。
```ts
const str: string = "foo";

// 从 X 类型 到 Y 类型的断言可能是错误的，blabla
(str as { handler: () => {} }).handler()
```
解决办法：
```ts
const str: string = "foo";

(str as unknown as { handler: () => {} }).handler();

// 使用尖括号断言
(<{ handler: () => {} }>(<unknown>str)).handler();
```
需要先断言到一个通用的类，即 `any / unknown`。这一通用类型包含了所有可能的类型，因此断言到它和从它断言到另一个类型差异不大。
#### 非空断言
```ts

declare const foo: {
  func?: () => ({
    prop?: number | null;
  })
};

foo.func().prop.toFixed();
// 此时func prop不一定存在
foo.func!().prop!.toFixed();
foo.func?.().prop?.toFixed() // 可选链
```
但不同的是，非空断言的运行时仍然会保持调用链，因此在运行时可能会报错。而可选链则会在某一个部分收到 undefined 或 null 时直接短路掉，不会再发生后面的调用。

其他非空断言场景
```ts
const element = document.querySelector("#id")!;
const target = [1, 2, 3, 599].find(item => item === 599)!;
```
通过`non-nullable-type-assertion-style`来检查是否存在类型断言被简写为非空断言的情况
```ts
interface IStruct {
  foo: string;
  bar: {
    barPropA: string;
    barPropB: number;
    barMethod: () => void;
    baz: {
      handler: () => Promise<void>;
    };
  };
}
const obj: IStruct = {}; // 这个会报错
// 这个例子是不会报错的，并且类型提示仍然存在
const obj = <IStruct>{
  bar: {
    baz: {},
  },
};
``

