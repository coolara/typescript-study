type R11 = 'foo' | 'bar' | 'baz' extends string ? 1 : 2; // 1

type R26 = any extends 'foo' ? 1 : 2; // 1 | 2

type R47 = any[] extends number[] ? 1 : 2; // 1