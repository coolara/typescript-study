### 模板字符串类型
```ts
type Greet<T extends string | number | boolean | null | undefined | bigint> = `Hello ${T}`; // 模板字符串类型  Hello xxx 都是它的子类型

type Greet2 = Greet<599>; // "Hello 599"  字符串字面量类型
type Greeting = `Hello ${string}`;

// 版本号类型限定
type Version = `${number}.${number}.${number}`;

const v1: Version = '1.1.0';

// X 类型 "1.0" 不能赋值给类型 `${number}.${number}.${number}`
const v2: Version = '1.0';

// 型号限定
type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';

type SKU = `${Brand}-${Memory}-${ItemType}`;

```

#### 结合索引类型和映射类型
```ts
// 索引类型查询操作符 keyof
interface TmpStr  {
    name : string,
    age : number,
    sex : boolean
}

type ChangeListener = {
  on: (change: `${keyof TmpStr}Changed`) => void;
};

declare let listen: ChangeListener 
listen.on("sexChanged")
// 映射类型 in

type Copy<T extends object> = {
  [K in keyof T]: T[K];
};

type CopyTmpStr<T extends object> = {
    [K in keyof T as `modified${K & string}`]: T[K]
}
type CopyTmpString=CopyTmpStr<TmpStr>
/**
    type CopyTmpString = {
        modifiedname: string;
        modifiedage: number;
        modifiedsex: boolean;
    }
*/
```

#### 结合模式匹配infer
```ts
type ReverseName<Str extends string> =
  Str extends `${infer First} ${infer Last}` ? `${Capitalize<Last>} ${First}` : Str;
```

#### 进阶模板字符串
##### Include & Trim
```ts

type _Include<
  Str extends string,
  Search extends string
> = Str extends `${infer First}${Search}${infer Last}` ? true : false;
type IncludeRes1 = _Include<"foo", "f">; // true
type IncludeRes2 = _Include<" ", "">; // true
type IncludeRes3 = _Include<"", "">; // false 如何让这个结果也变成true 多加个判断

// 最终结果
type Include<
  Str extends string,
  Search extends string
> =Search extends '' ? Str extends '' ?  true : false : _Include<Str, Search>;

type TrimLeft<Str extends string> = Str extends ` ${infer R}` ? TrimLeft<R> : Str;

type TrimRight<Str extends string> = Str extends `${infer R} ` ? TrimRight<R> : Str;

type Trim<Str extends string> = TrimLeft<TrimRight<Str>>;
```
##### StartsWith
```ts
type _StartsWith<
  Str extends string,
  Search extends string
> = Str extends `${Search}${infer _R}` ? true : false;

type StartsWith<Str extends string, Search extends string> = Str extends ''
  ? Search extends ''
    ? true
    : _StartsWith<Str, Search>
  : _StartsWith<Str, Search>;
```
##### Replace、Split 与 Join
```ts
type Replace<
  Str extends string,
  Search extends string,
  Replacement extends string
> = Str extends `${infer _R1}${Search}${infer _R2}`
  ? `${_R1}${Replacement}${_R2}`
  : Str;

export type ReplaceAll<
  Str extends string,
  Search extends string,
  Replacement extends string
> = Str extends `${infer Head}${Search}${infer Tail}`
  ? ReplaceAll<`${Head}${Replacement}${Tail}`, Search, Replacement>
  : Str;

export type Split<
  Str extends string,
  Delimiter extends string,
> = Str extends `${infer Head}${Delimiter}${infer Tail}` ?
  [Head, ...Split<Tail, Delimiter>] :  Str extends Delimiter ? [] : [Str]

export type Join<
  List extends Array<string | number>,
  Delimiter extends string
> = List extends []
  ? ""
  : List extends [string | number]
  ? `${List[0]}`
  : List extends [string | number, ...infer Rest extends Array<string | number>]
  ? 
    `${List[0]}${Delimiter}${Join<Rest, Delimiter>}`
  : string;
```
