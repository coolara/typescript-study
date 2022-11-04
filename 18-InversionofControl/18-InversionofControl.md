### 控制反转 - 依赖注入
> 通常情况下我们使用外部依赖需要手动导入, 然后实例化，这个叫正转，反转就是直接使用依赖，容器帮我们实例化了（并且依赖也自动导入了）

依赖注入的代码是这样的
```ts
@Provide()
class F {
  @Inject()
  d: D;
}
```
`Provide`是将类注册到容器，而`Inject`是某个类需要使用的依赖。

类似的基于装饰器的路由这么写的
```ts
@Controller('/user')
class UserController {
  @Get('/list')
  async userList() {}

  @Post('/add')
  async addUser() {}
}
```
装饰器实现
```ts
import "reflect-metadata";
enum metadataKey {
  method = "ioc:method",
  path = "ioc:path",
}

enum metaMethod {
  get = "ioc:get",
  post = "ioc:post",
}

const methodDecorateFactory = (method) => {
  return (path) => {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(metadataKey.method, method, descriptor.value);
      Reflect.defineMetadata(metadataKey.path, path, descriptor.value);
    };
  };
};
const Get = methodDecorateFactory(metaMethod.get);
const Post = methodDecorateFactory(metaMethod.post);
const Controller = (path?) => {
  return (target) => {
    Reflect.defineMetadata(metadataKey.path, path ?? "", target);
  };
};

type AsyncFunciton = (...args: any) => Promise<any>;
interface ICollection {
  path: string;
  requestMethod: string;
  handler: AsyncFunciton;
}

const routerFactory = <T extends object>(ins: T): ICollection[] => {
  const prototype = Reflect.getPrototypeOf(ins) as any;

  const rootPath = Reflect.getMetadata(metadataKey.path, prototype.constructor);

  const methods = <string[]>(
    Reflect.ownKeys(prototype).filter((k) => k !== "constructor")
  );

  const collected = methods.map((m) => {
    const handler = prototype[m];
    const path = rootPath + Reflect.getMetadata(metadataKey.path, handler);
    const requestMethod = Reflect.getMetadata(
      metadataKey.method,
      handler
    ).replace("ioc:", "");
    return {
      path,
      requestMethod,
      handler,
    };
  });
  console.log(collected);

  return collected;
};
@Controller("/user")
class UserController {
  @Get("/list")
  async userList() {}

  @Post("/add")
  async addUser() {}
}

routerFactory(new UserController()); // 调用实例 得到路由表
/**
 * [
  {
    path: '/user/list',
    requestMethod: 'get',
    handler: [AsyncFunction: userList]
  },
  {
    path: '/user/add',
    requestMethod: 'post',
    handler: [AsyncFunction: addUser]
  }
]
 */

```
#### 依赖注入`Provide` `Inject`实现
```ts
@Provide()
class Driver {
  adapt(consumer: string) {
    console.log(`\n === 驱动已生效于 ${consumer}！===\n`);
  }
}

@Provide()
class Car {
  @Inject()
  driver!: Driver;

  run() {
    this.driver.adapt('Car');
  }
}

const car = Container.get(Car);

car.run(); // 驱动已生效于 Car ！
```

