### 泛型
类型别名如果声明了泛型坑位，那其实就等价于一个接受参数的函数：
```ts
type Factory<T> = T | number | string;
```
其他的泛型的类型工具
```ts
type Stringify<T> = {
  [K in keyof T]: string;
};

type Clone<T> = {
  [K in keyof T]: T[K];
};
interface Foo {
    propA: string
    propB: number
    propC: boolean
    propD: ()=> void
}
type Partial<T> = {
    [K in keyof T]?: T[K]
}
type PartialFoo = Partial<Foo>
// 等价于
interface PartialFoo {
    propA?: string
    propB?: number
    propC?: boolean
    propD?: ()=> void
}
```
除了映射类型、索引类型等类型工具以外，还有一个非常重要的工具：条件类型。
#### 条件类型
```ts
type isEqual<T> = T extends true ? 1 : 2
type A = isEqual<false> // 2
type B = isEqual<true> // 1
type C = isEqual<'foo'> // 2
```

#### 约束和默认值
##### 默认值
```ts
type Factory<T = boolean> = T | number | string;
const foo: Factory = false;
```

##### 约束
在泛型中，我们可以使用 `extends` 关键字来约束传入的泛型参数必须符合要求。关于 `extends`， `A extends B` 意味着` A` 是` B` 的子类型
```ts
type ResStatus<ResCode extends number> = ResCode extends 10000 | 10001 | 10002
  ? 'success'
  : 'failure';


type Res1 = ResStatus<10000>; // "success"
type Res2 = ResStatus<20000>; // "failure"

type Res3 = ResStatus<'10000'>; // 类型“string”不满足约束“number”。
```
在ts有个默认约束，这个默认约束值在 `TS 3.9` 版本以前是 `any`，而在 `3.9` 版本以后则为 `unknown`。


#### 多泛型关联
我们不仅可以同时传入多个泛型参数，还可以让这几个泛型参数之间也存在联系
```ts
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;

//  "passed!"
type Result1 = Conditional<'foo', string, 'passed!', 'rejected!'>;

// "rejected!"
type Result2 = Conditional<'foo', boolean, 'passed!', 'rejected!'>;
```
多个泛型参数之间的依赖，其实指的即是在后续泛型参数中，使用前面的泛型参数作为约束或默认值：
```ts
type ProcessInput<
  Input,
  SecondInput extends Input = Input,
  ThirdInput extends Input = SecondInput
> = number;
```

#### 对象类型中的泛型
请求响应
```ts
interface IRes<TData = unknown> {
  code: number;
  error?: string;
  data: TData;
}
interface IUserProfileRes {
  name: string;
  homepage: string;
  avatar: string;
}

function fetchUserProfile(): Promise<IRes<IUserProfileRes>> {}

type StatusSucceed = boolean;
function handleOperation(): Promise<IRes<StatusSucceed>> {}
```
分页
```ts
interface IPaginationRes<TItem = unknown> {
  data: TItem[];
  page: number;
  totalCount: number;
  hasNextPage: boolean;
}

function fetchUserProfileList(): Promise<IRes<IPaginationRes<IUserProfileRes>>> {}
```
#### 函数中的泛型
```ts
function handle<T>(input: T): T {}

const author = "foo"; // 使用 const 声明，被推导为 "foo"

let authorAge = 18; // 使用 let 声明，被推导为 number

handle(author); // 填充为字面量类型 "foo"
handle(authorAge); // 填充为基础类型 number

function swap<T, U>([start, end]: [T, U]): [U, T] {
  return [end, start];
}

const swapped1 = swap(["foo", 599]);
const swapped2 = swap([null, 599]);
const swapped3 = swap([{ name: "foo" }, {}]);
```
lodash里的pick
```ts
type pick<T extends object, U extends keyof T> = (object: T, props: U[]) => Pick<T , U> 
```

#### `Class` 中的泛型
`Class` 中的泛型和函数中的泛型非常类似，只不过函数中泛型参数的消费方是参数和返回值类型，`Class` 中的泛型消费方则是属性、方法、乃至装饰器等。
```ts
class Queue<TElementType> {
  private _list: TElementType[];

  constructor(initial: TElementType[]) {
    this._list = initial;
  }

  // 入队一个队列泛型子类型的元素
  enqueue<TType extends TElementType>(ele: TType): TElementType[] {
    this._list.push(ele);
    return this._list;
  }

  // 入队一个任意类型元素（无需为队列泛型子类型）
  enqueueWithUnknownType<TType>(element: TType): (TElementType | TType)[] {
    return [...this._list, element];
  }

  // 出队
  dequeue(): TElementType[] {
    this._list.shift();
    return this._list;
  }
}
```
#### 内置方法的泛型
```ts
function p() {
  return new Promise<boolean>((resolve, reject) => {
    resolve(true);
  });
}
```
还有数组 `Array<T>` 当中
