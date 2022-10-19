### 结构化类型系统
对象类型的兼容比较
```ts
class Cat {
  meow() { }
  eat() { }
}

class Dog {
  eat() { }
}

function feedCat(cat: Cat) { }

// 报错！
feedCat(new Dog())
```
这里实际上是比较 `Dog` 类型上的属性是否包含 `Cat` 类型

如果为 `Dog` 类型添加一个独特方法呢?
```ts
class Cat {
  eat() { }
}

class Dog {
  bark() { }
  eat() { }
}

function feedCat(cat: Cat) { }

feedCat(new Dog())
```
 这里除了包含还额外比`Cat `类型多一个方法, 所以不会报错

 更进一步，在比较对象类型的属性时，同样会采用结构化类型系统进行判断
 ```ts
class Cat {
  eat(): boolean {
    return true
  }
}

class Dog {
  eat(): number {
    return 599;
  }
}

function feedCat(cat: Cat) { }

// 报错！
feedCat(new Dog())
 ```
 Dog同名属性的类型范围不能超过Cat属性的类型
 ```ts
class Cat {
  eat(): boolean | number {
    return true
  }
}

class Dog {
  eat(): number {
    return 599;
  }
}

function feedCat(cat: Cat) { }

// 这样就不会报错了
feedCat(new Dog())
 ```
 > 函数类型的比较：类型系统中的协变与逆变
#### 标称系统
 除了基于类型结构进行兼容性判断的**结构化类型系统**以外，还有一种基于类型名进行兼容性判断的类型系统，**标称类型系统**。
```ts
type USD = number;
type CNY = number;

const CNYCount: CNY = 200;
const USDCount: USD = 200;

function addCNY(source: CNY, input: CNY) {
  return source + input;
}

addCNY(CNYCount, USDCount)
```
这就很离谱了，人民币与美元这两个单位实际的意义并不一致，怎么能进行相加

要在 `TypeScript` 中实现，其实我们也只需要为类型额外附加元数据即可，比如 `CNY` 与 `USD`，我们分别附加上它们的单位信息即可，但同时又需要保留原本的信息（即原本的 `number` 类型）

```ts
export declare class TagProtector<T extends string> {
  protected __tag__: T;
}

export type Nominal<T, U extends string> = T & TagProtector<U>;
const CNYCount = 100 as CNY;

const USDCount = 100 as USD;

function addCNY(source: CNY, input: CNY) {
  return (source + input) as CNY;
}

addCNY(CNYCount, CNYCount);

// 报错了！
addCNY(CNYCount, USDCount);
```
这一实现方式本质上只在类型层面做了数据的处理，在运行时无法进行进一步的限制。我们还可以从逻辑层面入手进一步确保安全性：
```ts
class USD {
    private __tag!: void
    constructor(public value: number){}
}
class CNY {
    private __tag!: void
    constructor(public value: number){}
}
const CNYCount = new CNY(100);

const USDCount = new USD(100);
function addCNY(source: CNY, input: CNY) {
  return (source.value + input.value);
}

addCNY(CNYCount, CNYCount);
// 报错了！
addCNY(CNYCount, USDCount);
```
这两种方式的本质都是通过非公开（即 private / protected ）的额外属性实现了类型信息的附加，从而使得结构化类型系统将结构一致的两个类型也视为不兼容的