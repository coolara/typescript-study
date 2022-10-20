#### 函数类型
```ts
function foo(name: string): number {
    return name.length;
}
const foo = function(name: string):number{
    return name.length
}
```
对`foo`这个变量进行类型标注
```ts
// 这两种方式等效，方式一的可读性比较差
const f1: (name: string) => number =  (name) => {
    return name.length
}
const f2 = (name: string): number => {
    return name.length
}
// 方式一可以通过类型别名将变量类型抽离出来
type FuncFoo = (name: string) => number
const f3: FuncFoo = (name) => name.length
// 也可以使用interface
interface IFuncFoo {
    (name: string): number
}
const f4: IFuncFoo = (name) => name.length
```
#### `void`类型
```ts
function foo():void{}
function bar():void{return;}
// undefined类型是一个实际，有意义的类型值 ，void代表着空的，没有意义的类型值，void表示没有进行返回操作，第二个例子更好的方式是用undefined标注类型
function baz():undefined{return;}
// 进行了返回操作， 但没有返回实际的值
```

#### 可选参数
可选参必须在必选参数之后。
```ts
function f1(name: string, age?:number): number{
    const inputAge = age ?? 18
    return name.length + inputAge
}
function f2(name: string, age:number = 18): number{
    return name.length + age;
}
```
#### `rest`参数
```ts
function f3(arg1: string, ...rest: any[]){

}
function f3(arg1: string, ...rest: [number , boolean]){
    
}
f3('foo', 18, true)
```

#### 重载
函数有多种入参类型和返回值类型
```ts
function f4(foo: number, bar?:boolean): string| number {
    if(bar){
        return String(foo)
    }else{
        return foo* 18
    }
}
```
将上述例子按照重载的方式改写：
```ts
function f5(foo:number, bar: true): string;
function f5(foo:number, bar?:false):number;
function f5(foo:number, bar?:boolean): string|number{
    if(bar){
        return String(foo)
    }else{
        return foo * 19
    }
}
```
拥有多个重载声明的函数在被调用时，是按照重载的声明顺序往下查找的。因此在第一个重载声明中，为了与逻辑中保持一致，即在 `bar` 为 `true` 时返回 `string` 类型，这里我们需要将第一个重载声明的 `bar` 声明为必选的字面量类型
> 实际上，`TypeScript `中的重载更像是伪重载，它只有一个具体实现，其重载体现在方法调用的签名上而非具体实现上。


#### 异步函数、`Generator `函数等类型签名
他们和普通函数的参数类型基本一致，返回类型有些差异
```ts
async function asyncFunc(): Promise<void> {}

function* genFunc(): Iterable<void> {}

async function* asyncGenFunc(): AsyncIterable<void> {}
```

#### 类与类成员的类型签名

类的结构分为构造函数、属性、方法和访问符（Accessor）

```ts
// 函数声明
class Foo {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  get propA(): string {
    return `${this.prop}+A`;
  }

  set propA(value: string) {
    this.prop = `${value}+A`
  }
  // 函数表达式
  const Foo = class {...}
  ```

  ##### 修饰符
  `public`/`private`/`protected`/`readonly`
  > 除`readonly`外，其他属于访问修饰符，`readonly`属于操作修饰符

- public：此类成员在类、类的实例、子类中都能被访问。
- private：此类成员仅能在类的内部被访问。
- protected：此类成员仅能在类与子类中被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即不允许再访问受保护的成员。

简单起见，我们可以在构造函数中对参数应用访问性修饰符：
```ts
class Foo {
  constructor(public arg1: string, private arg2: boolean) { }
}

new Foo("foo", true)
```
##### 静态成员`static`
```ts
class Foo{
    static staticHandler(){}
    public instanceHandler() { }
}
```
编译后
```js
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.staticHandler = function () { };
    Foo.prototype.instanceHandler = function () { };
    return Foo;
}());
```
从中我们可以看到，静态成员直接被挂载在函数体上，而实例成员挂载在原型上，这就是二者的最重要差异：静态成员不会被实例继承，它始终只属于当前定义的这个类（以及其子类）。而原型对象上的实例成员则会沿着原型链进行传递，也就是能够被继承。

##### 继承、实现、抽象类
```ts
class Base{}
class Derived extends Base {}
```
比较严谨的称呼是 基类（Base） 与 派生类（Derived）。

派生类中除了能访问使用`public` `protected`修饰符的基类成员，还可以在派生类中覆盖，这时我们可以通过`super`访问基类方法。
```ts
class Base {
     print(){
        console.log('base')
    }
}
class Derivde extends Base {
    print(){
        super.print()
    }
}
```
但我们不知道在派生类的方法在基类中存不存在，`TypeScript4.3`新增了`override`，来确保派生类的方法一定在基类中存在。

抽象类
> 抽象类是对类结构与方法的抽象，简单来说，一个抽象类描述了一个类中应当有哪些成员（属性、方法等），一个抽象方法描述了这一方法在实际实现中的结构。
```ts
abstract class AbsFoo {
  abstract absProp: string;
  abstract get absGetter(): string;
  abstract absMethod(name: string): string
}
```
通过`implements`实现抽象类
```ts
class Foo implements AbsFoo {
  absProp: string = "foo"

  get absGetter() {
    return "foo"
  }

  absMethod(name: string) {
    return name
  }
}
```
同样的`interface`也能描述类的结构

```ts
interface FooStruct {
  absProp: string;
  get absGetter(): string;
  absMethod(input: string): string
}

class Foo implements FooStruct {
  absProp: string = "foo"

  get absGetter() {
    return "foo"
  }

  absMethod(name: string) {
    return name
  }
}

```
除此以外，我们还可以使用 `Newable Interface` 来描述一个类的结构（类似于描述函数结构的 `Callable Interface`）：
```ts
class Foo{}
interface FooStruct{
    new(): Foo
}
declare const NewableFoo: FooStruct
const foo = new NewableFoo()

```

###### 私有构造
比如像我一样把类作为 `utils` 方法时，此时 `Utils` 类内部全部都是静态成员，我们也并不希望真的有人去实例化这个类。此时就可以使用私有构造函数来阻止它被错误地实例化：
