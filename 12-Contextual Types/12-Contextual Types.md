### `Contextual Types`
```ts
window.onerror = (event, source, line, col, err) => {}
```
`onerror`类型声明已经内置了
```ts
interface Handler{
    onerror: OnErrorEventHandlerNonNull;
}
interface OnErrorEventHandlerNonNull {
    (event: Event| string, source?: string,lineno?:number,colno?:number, error?: Error):any
}
```
我们也可以自己实现一个函数签名
```ts
type CustomerHandler = (name: string, age: number) => boolean
const handler:CustomHandler = (arg1, arg2) => true

declare const struct: {
    handler: CustomHandler
}
struct.handler =(name,age)=> {} //报错！ 返回类型被管控，不能将void分配给boolean
```
这就是上下文类型的核心理念：**基于位置的类型推导。**

上下文类型也可以进行”嵌套“情况下的类型推导，如以下这个例子
```ts
declare let func: (raw: number) => (input: string) => any;
func =(raw)=> { // raw => number
 return (input) => any // input => string
}
```
上下文类型失效的情况
```ts
class Foo {
    foo!:number
}
class Bar extends Foo {
    bar!:number
}
let f1: {(input:Foo):void} | {(input:Bar):void}; //Typescript不支持这一判断方式
f1 =(input)=> { } // y:any

let f2: { (input: Foo | Bar): void }; // 这样写没有问题
// Foo | Bar
f2 = (input) => {}; // y :Foo| Bar 

let f3:
| {(raw:number):(input:Foo)=>void}
| {(raw:number):(input:Bar)=>void}

f3 =(raw) =>{ // raw => number
    return (input) => {}  //input => Bar
} 

```

#### `void` 返回值类型下的特殊情况
```ts
type CustomHandler = (name: string, age: number) => void;

const handler1: CustomHandler = (name, age) => true;
const handler2: CustomHandler = (name, age) => 'foo';
const handler3: CustomHandler = (name, age) => null;
const handler4: CustomHandler = (name, age) => undefined;
```
上下文类型对于 `void` 返回值类型的函数，并不会真的要求它啥都不能返回。然而，虽然这些函数实现可以返回任意类型的值，但对于调用结果的类型，仍然是 `void：`
```ts
const result1 = handler1('foo', 599); // void
const result2 = handler2('foo', 599); // void
const result3 = handler3('foo', 599); // void
const result4 = handler4('foo', 599); // void
```
