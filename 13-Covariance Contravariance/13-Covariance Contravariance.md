### 函数类型的层级 —— 如何做兼容
```ts
type FooFunc = () => string;
type BarFunc = () => "literal types";
type BazFunc = (input: string) => number;
```

#### 如何比较函数的签名类型
```ts
class Animal {
  asPet() {}
}

class Dog extends Animal {
  bark() {}
}

class Corgi extends Dog {
  cute() {}
}

```
对于函数类型比较，实际上我们要比较的即是参数类型与返回值类型
```ts
function makeDogBark(dog: Dog){
    dog.bark()
}
```
对于函数参数，实际上类似于我们在类型系统层级时讲到的，如果一个值能够被赋值给某个类型的变量，那么可以认为这个值的类型为此变量类型的子类型。
```ts
makeDogBark(new Corgi()); // 没问题
makeDogBark(new Animal()); // 不行
```
