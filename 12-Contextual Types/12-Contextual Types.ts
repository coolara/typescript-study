class Foo {
    foo!:number
}
class Bar extends Foo {
    bar!:number
}
let f1: {(input:Foo):void};
f1 =(input)=> { };
let f3 :{(input: Foo|Bar):void};
f3=(input)=> {}

let f5:
  | ((raw: Foo)=> (input: Foo) => void)
  | ((raw: Foo)=> (input: Bar) => void);

// raw → number
f5 = (raw) => {
  // input → Bar
  return (input) => {}; //这里被推导为 Bar 的原因 函数的逆变  Bar类型更安全
};