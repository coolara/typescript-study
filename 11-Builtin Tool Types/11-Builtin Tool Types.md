### 工具类型分类
- 属性修饰工具类型: `readonly`,`?`
- 结构工具类型: 既有类型的裁剪，拼接，转换
- 集合工具类型：交集、并集、差集、补集
- 模式匹配工具类型: `infer`
- 模板字符串工具类型：将对象类型所有属性名转化大写

#### 属性修饰工具类型
属性修饰、映射类型、 索引类型
```ts
type Partial<T> = {
    [P in keyof T]?: T[P]  // [P in keyof T]+?: T[P]  也可行
}
type Required<T> = {
    [P in keyof T]-?:T[P] // -readonly [P in keyof T]: T[P]  也可行
}
type Readonly<T> = {
    readonly [P in keyof T]: T[P] // +readonly [P in keyof T]: T[P]  也可行
}
```

#### 结构工具类型
条件类型、映射类型、索引类型

> 结构类型声明
```ts
type Record<K extends keyof any, T> = {
    [P in K]: T
}
```
> 结构类型处理： `Pick` `Omit`
```ts
type Pick<T, K in keyof T> = {
    [P in keyof T] : T[P]
}
type Omit<T, K in keyof any> = {
    Pick<T , Exclude<keyof T, K>>
}
```

#### 集合工具类型
```ts
type Extract<T, U> = T extends U ? T : never  // 交集
type Exclude<T, U> = T extends U ? never : T  // 差集

type AExtractB = Extract<1 | 2 | 3, 1 | 2 | 4>; // 1 | 2  条件的分布式特性
// 分布式的运行逻辑
type _AExtractB = 
| (1 extends 1 | 2 | 4 ? 1 : never)
| (2 extends 1 | 2 | 4 ? 1 : never)
| (3 extends 1 | 2 | 4 ? 1 : never)
```

```ts
// 自定义集合类型
type Concurrence<A, B> = A | B // 并集
type Intersection<A, B> = A extends B ? A : never // 交集
type Difference<A, B> = A extends B ? never: A // 差集
type Complement<A, B extends A> = Difference<A, B> // 补集
```

#### 模式匹配工具类型
条件类型与 `infer` 关键字。
> 函数类型的签名模式匹配
```ts
type FunctionType = (...args: any) => any;
type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? P : never;
type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R ? R : never; 
type FirstParameter<T extends FunctionType> = T extends (arg: infer P, ...args:any) => any ? P : never;
```
> `Class`模式匹配
```ts 
type ClassType = abstract new(...args: any) => any
type ConstrutorParameters<T extends ClassType> =  T extends abstract new (...args: infer P) => any ? P : never;
type InstanceType<T extends ClassType> = T extends abstract new (...args: any) => infer R ? R : never;
```
接口来进行声明
```ts
export interface ClassType<TInstanceType = any> {
    new (...args: any[]): TInstanceType;
}
```
