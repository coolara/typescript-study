import { Join } from './14-Template String Types';
type Greet<T extends string | number | boolean | null | undefined | bigint> =
  `Hello ${T}`; // 这个属于模板字符串类型

type Greet2 = Greet<599>; // "Hello 599" 属于字符串字面量类型

interface TmpStr {
  name: string;
  age: number;
  sex: boolean;
}

type ChangeListener = {
  on: (change: `${keyof TmpStr}Changed`) => void;
};

declare let listen: ChangeListener;
listen.on("sexChanged");

type Copy<T extends object> = {
  [K in keyof T]: T[K];
};

type CopyTmpStr<T extends object> = {
  [K in keyof T as `modified${K & string}`]: T[K];
};
type CopyTmpString = CopyTmpStr<TmpStr>;

type _Include<
  Str extends string,
  Search extends string
> = Str extends `${infer First}${Search}${infer Last}` ? true : false;
type IncludeRes1 = _Include<"foo", "f">; // true
type IncludeRes2 = _Include<" ", "">; // true
type IncludeRes3 = _Include<"", "">; // false 如何让这个结果也变成true 多加个判断

// 最终结果
type Include<Str extends string, Search extends string> = Search extends ""
  ? Str extends ""
    ? true
    : false
  : _Include<Str, Search>;

type _StartsWith<
  Str extends string,
  Search extends string
> = Str extends `${Search}${infer _R}` ? true : false;

type StartsWith<Str extends string, Search extends string> = Str extends ""
  ? Search extends ""
    ? true
    : false
  : _StartsWith<Str, Search>;

type StartsWithRes1 = StartsWith<" ", " ">;

type Replace<
  Str extends string,
  Search extends string,
  Replacement extends string
> = Str extends `${infer _R1}${Search}${infer _R2}`
  ? `${_R1}${Replacement}${_R2}`
  : Str;
type ReplaceRes1 = Replace<"foo", "f", "b">;

export type Split<
  Str extends string,
  Delimiter extends string
> = Str extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : Str extends Delimiter
  ? []
  : [Str];

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

type JoinRes1 = Join<[1,2,3], '-'>

function error(message : string) : never {
    throw new Error(message)
}

const str: never = '1111'

const str1: string = error('aaa')