### 条件类型 与 `infer`
#### 条件类型基础
> 条件类型中使用 `extends` 判断类型的兼容性，而非判断类型的全等性。这是因为在类型层面中，对于能够进行赋值操作的两个变量，我们并不需要它们的类型完全相等，只需要具有兼容性，而两个完全相同的类型，其 `extends` 自然也是成立的。

函数的返回类型条件类型
```ts
function universalAdd<T extends string | number | bigint>(x : T, y: T): LiterTypeToPrimitive<T> {
    return x + (y as any)
}
type LiterTypeToPrimitive<T> = T extends number 
                            ? number 
                            : T extends string 
                                ? string 
                                : T extends bigint 
                                    ? bigint 
                                    : never
//  这种函数的返回类型不确定 ， 不能通过原始类型标注，需要通过类型别名条件类型来推导
universalAdd("foo", "599"); // string
universalAdd(599, 1); // number
universalAdd(10n, 10n); // bigint
```
函数类型的条件类型
```ts
type Func = (...args: any[]) => any
type FuncConditionType<T extends Func> = T extends (...args: any[]) => string ? "return string func" : "not return string func"
type stringFunc = FuncConditionType<()=> string>
type booleanFunc = FuncConditionType<()=> boolean>
```

#### 提取传入的类型信息`infer`
支持通过 `infer` 关键字来在条件类型中提取类型的某一部分信息
```ts
//根据上面的例子提取 函数的返回类型R
type FuncConditionType<T extends Func> = T extends (...args: any[]) => infer R ? R : never
```
类型结构不拘泥于函数，数组也可以
```ts
type Swap<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T;

type SwapResult1 = Swap<[1, 2]>; // 符合元组结构，首尾元素替换[2, 1]
type SwapResult2 = Swap<[1, 2, 3]>; // 不符合结构，没有发生替换，仍是 [1, 2, 3]
```
也可以提取对象属性
```ts
type PropType<T, K extends keyof T> = T extends {[Key in K] : infer R} ? R : never
type Res1 = PropType<{name: string}, 'name'>
type Res2 = PropType<{name: string, age: number}, 'name' | 'age'>
// 反转键名
type ReverseKeyValue<T extends Record<string , unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K>: never; 
type Res3 = ReverseKeyValue<{"age": "18"}> // {18: age}
```
`Promise` 结构
```ts
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type PromiseValueResult1 = PromiseValue<Promise<number>>; // number
type PromiseValueResult2 = PromiseValue<number>; // number，但并没有发生提取
// 如果嵌套
type PromiseValueD<T> =  T extends Promise<infer V> ? PromiseValueD<V> : T
type PromiseValueResult3 = PromiseValueD<Promise<Promise<Promise<number>>>>; // number
```

#### 分布式条件类型
也称条件类型的**分布式特性**
```ts
type ConditionType<T> = T extends  1 | 2 | 3 ? T :never
type Res4 = ConditionType<1 | 2 | 3 | 4 | 5 > // 1 | 2 | 3
type Res5 = 1 | 2 | 3 | 4 | 5  extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never // never

```
仔细观察这两个类型别名的差异你会发现，唯一的差异就是在 `Res4` 中，进行判断的联合类型被作为泛型参数传入给另一个独立的类型别名，而 `Res5` 中直接对这两者进行判断。

差异1： 是否通过泛型参数传入
```ts
type Naked<T> = T extends boolean ? "Y" : "N";
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";

// "N" | "Y"
type Res6 = Naked<number | boolean>;

// "N"
type Res7 = Wrapped<number | boolean>;
```
差异2： 泛型参数是否被数组包裹

条件类型分布式起作用的条件。
- 首先，你的类型参数需要是一个联合类型。
- 其次，类型参数需要通过泛型参数的方式传入，而不能直接在内部进行判断（如 `Res5` 中）。
- 最后，条件类型中的泛型参数不能被包裹。

我们上面使用数组包裹泛型参数只是其中一种方式，比如还可以这么做`&`：
```ts
export type NoDistribute<T> = T & {};

type Wrapped<T> = NoDistribute<T> extends boolean ? "Y" : "N";

type Res8 = Wrapped<number | boolean>; // "N"
type Res9 = Wrapped<true | false>; // "Y"
type Res10 = Wrapped<true | false | 599>; // "N"
```
这里的自动分发，我们可以这么理解：

```ts
type Naked<T> = T extends boolean ? "Y" : "N";

// (number extends boolean ? "Y" : "N") | (boolean extends boolean ? "Y" : "N")
// "N" | "Y"
type Res3 = Naked<number | boolean>;
```
