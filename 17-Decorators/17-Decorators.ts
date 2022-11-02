class FooN {
  @ModifyNickName()
  nickName = "aaa";
  constructor() {}
}

function ModifyNickName(): PropertyDecorator {
  return (target: any, propertyIdentifier) => {
    target[propertyIdentifier] = "foo!";  // 如果有初始值， 这里是覆盖不了的
    target["otherName"] = "别名foo!";
  };
}

console.log(new FooN().nickName); // aaa
// @ts-expect-error
console.log(new FooN().otherName); // "别名foo!";

import "reflect-metadata";

class Foo {
  handler() {}
}

Reflect.defineMetadata("class:key", "class metadata", Foo);
Reflect.defineMetadata("method:key", "handler metadata", Foo, "handler");
Reflect.defineMetadata(
  "proto:method:key",
  "proto handler metadata",
  Foo.prototype,
  "handler"
);
