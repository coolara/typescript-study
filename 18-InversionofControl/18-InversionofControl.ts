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

type ClasssStruct<T = any> = new (...args: any[]) => T;

class Container {
  public static propertyRegistry: Map<string, string> = new Map(); // 属性
  private static services: Map<string, ClasssStruct> = new Map();
  static set(key: string, value: ClasssStruct): void {
    Container.services.set(key, value);
  }
  static get<T = any>(key: string): T | undefined {
    const Cons = Container.services.get(key);
    if (!Cons) return undefined;
    const ins = new Cons();
    for (const info of Container.propertyRegistry) {
      const [injectKey, serviceKey] = info;
      const [classKey, propKey] = injectKey.split(":");
      if (classKey !== Cons.name) continue;
      const target = Container.get(serviceKey);
      if (target) {
        ins[propKey] = target;
      }
    }
    return ins;
  }
  private constructor() {}
}

function Provide(key: string): ClassDecorator {
  return (target) => {
    Container.set(key, target as unknown as ClasssStruct);
  };
}
function Inject(key: string): PropertyDecorator {
  return (target, propertyKey) => {
    Container.propertyRegistry.set(
      `${target.constructor.name}:${String(propertyKey)}`, // Car:driver - Driver 在Car里有个driver属性 指向 Driver类
      key
    );
  };
}

@Provide("Driver")
class Driver {
  adapt(consumer: string) {
    console.log(`\n === 驱动已生效于 ${consumer}！===\n`);
  }
}
@Provide("Car")
class Car {
  @Inject("Driver")
  driver!: Driver;

  run() {
    this.driver.adapt("Car");
  }
}

const car = Container.get<Car>("Car")!;
console.log(car);

car.run(); // 驱动已生效于 Car ！
