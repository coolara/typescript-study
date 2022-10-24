type Dictionary<T> = {
    [index: string]: T
}

type D1 = Dictionary<string>
const d1= <D1>{
    "1": "1"
}
interface O {
    name: string,
    age: number
}
type O1 = Omit<O, ''>
type P1 = Pick<O ,'age'>


type Omit1<T, K> = Pick<T, Exclude<keyof T, K>>;
type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 这里就不能用严格 Omit 了
declare function combineSpread<T1, T2>(obj: T1, otherObj: T2, rest: Omit1<T1, keyof T2>): void;

type Point3d = { x: number, y: number, z: number };

declare const p1: Point3d;

// 能够检测出错误，rest 中缺少了 y
combineSpread(p1, { x: 10 }, { z: 2 });

