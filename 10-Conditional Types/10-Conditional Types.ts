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


type Func = (...args: any[]) => any
type FuncConditionType<T extends Func> = T extends (...args: any[]) => string ? "return string func" : "not return string func"
type stringFunc = FuncConditionType<()=> string>
type booleanFunc = FuncConditionType<()=> boolean>


type PropType<T, K extends keyof T> = T extends {[Key in K] : infer R} ? R : never
type Res1 = PropType<{name: string}, 'name'>
type Res2 = PropType<{name: string, age: number}, 'name' | 'age'>

type ReverseKeyValue<T extends Record<string , unknown>> = T extends Record<infer K, infer V> ? Record<V & string, K>: never; 
type Res3 = ReverseKeyValue<{"age": "18"}>

type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type PromiseValueResult1 = PromiseValue<Promise<number>>; // number
type PromiseValueResult2 = PromiseValue<number>; // number，但并没有发生提取

type PromiseValueD<T> =  T extends Promise<infer V> ? PromiseValueD<V> : T
type PromiseValueResult3 = PromiseValueD<Promise<Promise<Promise<number>>>>; // number

type ConditionType<T> = T extends  1 | 2 | 3 ? T :never
type Res4 = ConditionType<1 | 2 | 3 | 4 | 5 > // 1 | 2 | 3
type Res5 = 1 | 2 | 3 | 4 | 5  extends 1 | 2 | 3 ? 1 | 2 | 3 | 4 | 5 : never // never

export type NoDistribute<T> = T;

type Wrapped<T> = NoDistribute<T> extends boolean ? "Y" : "N";

type Res8 = Wrapped<number | boolean>; // "N"
type Res9 = Wrapped<true | false>; // "Y"
type Res10 = Wrapped<true | false | 599>; // "N"