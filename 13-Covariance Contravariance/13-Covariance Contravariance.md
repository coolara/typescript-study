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
这就是 `TypeScript` 中的协变（ `covariance` ） 与逆变（ `contravariance` ） 在函数签名类型中的表现形式。这两个单词最初来自于几何学领域中：随着某一个量的变化，随之变化一致的即称为协变，而变化相反的即称为逆变。