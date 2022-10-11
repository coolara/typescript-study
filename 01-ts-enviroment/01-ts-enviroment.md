 ### `VS Code`插件：
- `TypeScript Importer` ：收集你项目内所有的类型定义
- `Move TS`: 修改文件项目目录结构后更新该文件的导入语句
- `ErrorLens`: 将`VS Code`问题栏的错误显示到代码文件的对应位置
### `VS Code` 设置项
搜索`TypeScript`，开启一下选项
- `Function Like Return Types`：显示推导得到的函数返回值类型；
- `Parameter Names`：显示函数入参的名称；
- `Parameter Types`：显示函数入参的类型；
- `Variable Types`：显示变量的类型。
### TS 文件的快速执行
`ts-node`和`ts-node-dev`,支持监听文件重新执行，也支持跳过类型检查

### TS 全局环境
```
$ npm i ts-node typescript -g
```
初始化, 创建TypeScript项目配置文件：tsconfig.json
```
npx -p typscript tsc --init
// or
tsc --init // 执行完毕后，tsconfig.json就如根目录那个文件一样
```
### [ts-node](https://github.com/TypeStrong/ts-node)命令选项 
也可以在`tsconfig.json`文件里单独给`ts-node`命令配置选项
- `-P`,`--project`: 指定自定义配置文件
```
ts-node -P tsconfig.base.json 01-ts-enviroment/main.ts
ts-node --project tsconfig.json 01-ts-enviroment/main.ts
```
- `-T`, `--transpileOnly`: 忽略类型检查(`transpileOnly`不行的话,试试`transpile-only`)
```
ts-node -T ./01-ts-enviroment/main.ts
ts-node --transpile-only ./01-ts-enviroment/main.ts
```
- `--swc`：在 transpileOnly 的基础上，还会使用 swc 来进行文件的编译，进一步提升执行速度。swc是在go语言上执行的

- `--emit`: 可以看输出产物， 配置`--compileHost`一起用

> 注意：不能和`--transpile-only` 同时使用
```
ts-node --emit -H ./01-ts-enviroment/main.ts
```
```
// 命令行传json格式配置项
ts-node-dev --project tsconfig.json --transpile-only -O {\"module\":\"commonjs\"} ./01-ts-enviroment/main.ts
```
> 为什么`ts-node`可以直接执行`ts`文件?

利用了node的require-extension 偷偷做了编译,最后直接运行js 文件。
### 使用`node`执行`ts`文件
```bash
node -r ts-node/register 01-ts-enviroment/main.ts
```

那么如何使用ts-node的选项呢?
```
TS_NODE_TRANSPILE_ONLY=true  node -r ts-node/register 01-ts-enviroment/main.ts
```

### ts-node-dev
```bash
ts-node-dev --project tsconfig.json --transpile-only ./01-ts-enviroment/main.ts
// 也可以简写
tsnd tsconfig.json --transpile-only ./01-ts-enviroment/main.ts
```
`ts-node-dev`与`ts-node`的唯一区别就是会打印环境信息
`ts-node-dev`的`--respawn`选项支持监听重启
```js
[INFO] 11:35:20 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.1, typescript ver. 4.8.2)
```
### 类型兼容检查
```ts
type A = string;
type B = number;
let foo:A  = '1'
let bar:B = 2
foo = bar

// 通过声明变量存储类型，可以直接比较，不需要额外声明变量，并且它在运行时完全不存在
declare let Tfoo: A;
declare let Tbar: B;
Tfoo = Tbar
```

### `tsd`包来进行类型检查
```ts
import {expectType } from 'tsd'
expectType<string>('1')
```



