type Stringify = {
  [K : number]: string;
};
type B = keyof Stringify
interface Foo {
  prop1: string;
  prop2: number;
  prop3: boolean;
  prop4: () => void;
}

type StringifiedFoo = Stringify<Foo>;

// 等价于
const a : StringifiedFoo =  {
  prop1: "string",
  prop2: 1,
  prop3: 3,
  prop4: 3
}

const str: string = 'string'
type A = typeof str

function isString(input: unknown): boolean{
    return typeof input === "string"
}


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


import assert from 'assert';
import { expectType } from 'tsd';

let name: any = 'foo';

assert(typeof name === 'string');

// number 类型
name.toFixed();


interface Struct1 {
  primitiveProp: string;
}

interface Struct1 {
// 后续属性声明必须属于同一类型。
// 属性“primitiveProp”的类型必须为“string”，但此处却为类型“number”。
  a: number;
}
const a1 :Struct1 = {
  primitiveProp: "1",
  a:1
}


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
// 4.6 版本中则对这一情况下的联合类型辨识（即元组）做了支持
type Args = ['a', number] | ['b', string];

type Func = (...args: ["a", number] | ["b", string]) => void;

const f1: Func = (kind, payload) => {
  if (kind === "a") {
    // 仍然是 string | number
    payload.toFixed();
  }
  if (kind === "b") {
    // 仍然是 string | number
    payload.toUpperCase();
  }
};