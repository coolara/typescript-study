interface Foo {
    propA: string
    propB: number
    propC: boolean
    propD: ()=> void
}
type Partials<T> = {
    [K in keyof T]?: T[K]
}
type PartialFoo = Partials<Foo>


type isEqual<T> = T extends true ? 1 : 2
type A = isEqual<false> // 2
type B = isEqual<true> // 1
type C = isEqual<'foo'> // 2

type Factory<T = boolean> = T | number | string;
const foo1: Factory = false;

type pick<T extends object, U extends keyof T> = (object: T, props: U[]) => Pick<T , U> 