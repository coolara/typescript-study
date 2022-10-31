type Dictionary<T> = {
  [index: string]: T;
};

type D1 = Dictionary<string>;
const d1 = <D1>{
  "1": "1",
};
interface O {
  name: string;
  age: number;
}
type O1 = Omit<O, "">;
type P1 = Pick<O, "age">;

type Omit1<T, K> = Pick<T, Exclude<keyof T, K>>;
type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 这里就不能用严格 Omit 了
declare function combineSpread<T1, T2>(
  obj: T1,
  otherObj: T2,
  rest: Omit1<T1, keyof T2>
): void;

type Point3d = { x: number; y: number; z: number };

declare const p1: Point3d;

// 能够检测出错误，rest 中缺少了 y
combineSpread(p1, { x: 10 }, { z: 2 });

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : Partial<T[P]>;
};
type Flatten<T> = {
  [P in keyof T]: T[P] extends object ? Flatten<T[P]> : T[P];
};
interface ODeep {
  name: string;
  age: number;
  other: {
    prop: string;
  };
}
type Deep1 = DeepPartial<ODeep>;

type MarkPropAsPartial<T, K extends keyof T = keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;
type Mark1 = Flatten<MarkPropAsPartial<O, "name">>;

type FuncStruct = (...args: any[]) => any;

interface IFuncKeys {
  foo: () => void;
  bar: () => number;
  baz: number;
}

type PickByValueType<T extends object, K> = {
  [P in keyof T]: T[P] extends K ? P : never; // 得到的P是键名类型
}[keyof T]; // 通过索引获取得到了键名

// 找出IFuncKeys里的键值类型为函数的属性
type TPickValueType = PickByValueType<IFuncKeys, FuncStruct>;

export type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never;
};
interface Atype {
  A: string;
}
interface Btype {
  B: string;
}
// 互斥属性
type TAorB<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

type AorBType = TAorB<Atype, Btype>;
const AorB: AorBType = { A: "1", B: "2" };
const AorB1: AorBType = { A: "" };
const AorB2: AorBType = { B: "2" };
const AorB3: AorBType = {};
type XORStruct = TAorB<{}, { foo: string; bar: number }>;
// 要么都有 要么都没有
const AandB: XORStruct = { foo: "1", bar: 1 };
const AandB1: XORStruct = {};

// 对象类型的键的集合
type PlainObject = Record<string, any>;

type ObjectKeyConcurrence<T extends PlainObject, U extends PlainObject> =
  | keyof T
  | keyof U;

interface Plain1 {
  foo: string;
  bar: number;
  baz: string;
}
interface Plain2 {
  baz: boolean;
  fuz: string
}
type P1AndP2 = Flatten<ObjectKeyConcurrence<Plain1, Plain2>>;
type Intersection<A, B> = A extends B ? A : never;
type Difference<A, B> = A extends B ? never : A;
// 两个对象的集合操作
type ObjectIntersection<T, U> = Pick<T, Intersection<keyof T, keyof U>>;
type objIntersection = ObjectIntersection<Plain1, Plain2>;

type ObjectDifference<T, U> = Pick<T, Difference<keyof T, keyof U>>;
// 并集
type Merge<T, U> = ObjectIntersection<T, U> &
  ObjectDifference<U, T> &
  ObjectDifference<T, U>;

type Override<T, U> = ObjectIntersection<U, T> & ObjectDifference<T, U>;
type Merge1 = Flatten<Merge<Plain1, Plain2>>;
type Override1 = Flatten<Override<Plain1, Plain2>>
