###  装饰器
> 装饰器的本质其实就是一个函数, 只能在类以及类成员上使用(@ 语法来使用)
```ts
function Deco() { }

@Deco
class Foo {}
```
我们实际上使用更多的是` Decorator Factory`
```ts
function Deco() { 
  return () => {}
}

@Deco()
class Foo {}
```
`TypeScript` 中的装饰器可以分为**类装饰器**、**方法装饰器**、**访问符装饰器**、**属性装饰器**以及**参数装饰器**五种
#### 类装饰器
> `target`是类本身
```ts
@AddProperty('foo')
@AddMethod()
class Foo {
  a = 1;
}

function AddMethod(): ClassDecorator {
  return (target: any) => {
    target.prototype.newInstanceMethod = () => {
      console.log("Let's add a new instance method!");
    };
    target.newStaticMethod = () => {
      console.log("Let's add a new static method!");
    };
  };
}

function AddProperty(value: string): ClassDecorator {
  return (target: any) => {
    target.prototype.newInstanceProperty = value;
    target.newStaticProperty = `static ${value}`;
  };
}
```
#### `override`
```ts
const OverrideBar = (target: any) => {
  return class extends target {
    print() {}
    overridedPrint() {
      console.log('This is Overrided Bar!');
    }
  };
};

@OverrideBar
class Bar {
  print() {
    console.log('This is Bar!');
  }
}

// 被覆盖了，现在是一个空方法
new Bar().print();

// This is Overrided Bar!
(<any>new Bar()).overridedPrint();
```

#### 方法装饰器
> 方法装饰器的入参包括类的原型(` target `是类的原型而非类本身)、方法名以及方法的属性描述符（`PropertyDescriptor`）
```ts
class Foo {
  @ComputeProfiler()
  async fetch() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('RES');
      }, 3000);
    });
  }
}

function ComputeProfiler(): MethodDecorator {
  const start = new Date();
  return (
    _target,
    methodIdentifier,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const originalMethodImpl = descriptor.value!;
    descriptor.value = async function (...args: unknown[]) {
      const res = await originalMethodImpl.apply(this, args); // 执行原本的逻辑
      const end = new Date();
      console.log(
        `${String(methodIdentifier)} Time: `,
        end.getTime() - start.getTime()
      );
      return res;
    };
  };
}

(async () => {
  console.log(await new Foo().fetch());
})();
```

#### 访问符装饰器
> 访问符装饰器本质上仍然是方法装饰器，它们使用的类型定义也相同。
```ts
class Foo {
  _value!: string;

  get value() {
    return this._value;
  }

  @HijackSetter('f_o_o')
  set value(input: string) {
    this._value = input;
  }
}

function HijackSetter(val: string): MethodDecorator {
  return (target, methodIdentifier, descriptor: any) => {
    const originalSetter = descriptor.set;
    descriptor.set = function (newValue: string) {
      const composed = `Raw: ${newValue}, Actual: ${val}-${newValue}`
      originalSetter.call(this, composed);
      console.log(`HijackSetter: ${composed}`);
    };
    // 篡改 getter，使得这个值无视 setter 的更新，返回一个固定的值
    // descriptor.get = function () {
    //   return val;
    // };
  };
}

const foo = new Foo();
foo.value = 'foo'; // HijackSetter: Raw: LINBUDU, Actual: f_o_o-foo
```
#### 属性装饰器
> 它的入参只有类的原型与属性名称, 返回值会被忽略，但仍然可以直接在类的原型上赋值来修改属性
```ts
class Foo {
  @ModifyNickName()
  nickName!: string;
  constructor() {}
}

function ModifyNickName(): PropertyDecorator {
  return (target: any, propertyIdentifier) => {
    target[propertyIdentifier] = 'foo!';
    target['otherName'] = '别名foo!';
  };
}

console.log(new Foo().nickName); // foo 如果有初始值,这里就显示初始值
// @ts-expect-error
console.log(new Foo().otherName); // 别名foo
```
#### 参数装饰器
> 类的原型、参数名与参数在函数参数中的索引值（即第几个参数）
```ts
class Foo {
  handler(@CheckParam() input: string) {
    console.log(input);
  }
}

function CheckParam(): ParameterDecorator {
  return (target, paramIdentifier, index) => {
    console.log(target, paramIdentifier, index);
  };
}

// {} handler 0
new Foo().handler('foo');
```
#### 装饰器的执行机制

执行时机：装饰器的本质就是一个函数，因此只要在类上定义了它，即使不去实例化这个类或者读取静态成员，它也会正常执行
执行原理：
```ts
@Cls()
class Foo {
  constructor(@Param() init?: string) { }

  @Prop()
  prop!: string

  @Method()
  handler(@Param() input: string) {

  }
}
```
编译后的样子
```js
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
   // ...
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

let Foo = class Foo {
    constructor(init) { }
    handler(input) {
    }
};
__decorate([
    Prop(),
], Foo.prototype, "prop", void 0);
__decorate([
    Method(),
    __param(0, Param()),
], Foo.prototype, "handler", null);
Foo = __decorate([
    Cls(),
    __param(0, Param()),
], Foo);
```
执行顺序：实例属性-实例方法参数-构造函数参数-类
#### 多个装饰器
首先，由上至下依次对装饰器的表达式求值，得到装饰器的实现

### 反射元数据 `Reflect Metadata`
> 想要使用反射元数据，你还需要安装 `reflect-metadata `，并在入口文件中的顶部 `import "reflect-metadata"` 。
构造函数（或是构造函数的原型，根据静态成员还是实例成员决定）会具有 `[[Metadata]]` 属性，该属性内部包含一个 Map 结构，键为属性键，值为元数据键值对。也就是说，静态成员的元数据信息存储于构造函数，而实例成员的元数据信息存储于构造函数的原型上

```ts
import 'reflect-metadata';

class Foo {
  handler() {}
}

Reflect.defineMetadata('class:key', 'class metadata', Foo);
Reflect.defineMetadata('method:key', 'handler metadata', Foo, 'handler');
Reflect.defineMetadata(
  'proto:method:key',
  'proto handler metadata',
  Foo.prototype,
  'handler'
);
```