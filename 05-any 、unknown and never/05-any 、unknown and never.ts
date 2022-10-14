function func(foo, bar){} // noImplicitAny为true 报错 

// 被标记为 any 类型的变量可以拥有任意类型的值
let anyVar: any = "linbudu";

anyVar = false;
anyVar = "linbudu";
anyVar = {
  site: "juejin"
};

anyVar = () => { }

// 标记为具体类型的变量也可以接受任何 any 类型的值
const val1: string = anyVar;
const val2: number = anyVar;
const val3: () => {} = anyVar;
const val4: {} = anyVar;

type UnionWithNever = "linbudu" | 599 | true | void | never;
function justThrow(): never {
  throw new Error()
}
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  console.log("str!");
} else if (typeof strOrNumOrBool === "number") {
  console.log("num!");
} else if (typeof strOrNumOrBool === "boolean") {
  console.log("bool!");
} else {
  console.log(typeof strOrNumOrBool) // never
  throw new Error(`Unknown input type: ${strOrNumOrBool}`);
}

const arr = [] // never[]
arr.push('foo')

function foo2(union: string | number) {
  if ((union as string).includes("foo")) { }

  if ((union as number).toFixed() === '19') { }
}

foo2('f')