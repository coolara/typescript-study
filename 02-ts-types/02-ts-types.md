### 基础类型
#### `js`原始类型
```ts
const name : string = ''
const age : number = 0
const male : boolean = true
const undef : undefined = undefined
const nul: null = null
const obj: object = {name}
const bigIntVal : bigint = 92992n;
const bigIntVal1 : bigint = BigInt(92929)
const symbolVal: symbol = Symbol('unique')
```
#### `null` 和 `undefined`
> `null` 和 `undefined` 是其他类型的子类型
```ts
const name: string = null // 在`strictNullChecks`没有开启的情况下成立
const age: number = undefined 
```
### `void`
void表示函数内部没有`return`语句或者`return`后面没有值
```ts
function f1(){}  // void类型
function f2(){return;} // void 类型
function f3(){return undefined;} // undefined类型
```
但他们的返回值都是`undefined`
```ts
const v1: void = null // 在`strictNullChecks`没有开启的情况下成立
const v2: void = undefined
```

### 数组的类型标注
```ts
// 两种方式等价
const a1 : Array<number> = [1, 2]   
const a1: number[] = [1,2]
```
超出长度访问怎么限制 ?
```ts
// 显式越界访问
const a1: number[] = [1,2,3]
console.log(a1[99])
// 隐式
const arr5: [string, number, boolean] = ['linbudu', 599, true];
// 长度为 "3" 的元组类型 "[string, number, boolean]" 在索引 "3" 处没有元素。
const [name1, age, male, other] = arr5; 
```
> 元组(`Tuple`)来解决
```ts
const a2: [number, number, number] = [1, 2, 3]
console.log(a2[3]) // 报错 ，长度为3的元组类型在index为3的没有元素
```
多种类型及可选
```ts
const a3: [number, boolean, string] = [1, true, '1']
const a4: [number, boolean? , string?] = [1]
const a5: [number, boolean? , string?] = [1, ,] // 在strictNullChecks开启时，a5[1]的类型可以是boolean或undefined 关闭时a5[1]的类型只能为boolean
type TupleLength = typeof a4.length // 1 | 2 | 3
```
> TypeScript 4.0 中，有了具名元组（Labeled Tuple Elements）的支持
```ts
const a6: [age :number, male?: boolean , name?:string] = [18, true, 'foo']
```

### 对象类型
```ts
interface IDesc {
    name: string, 
    age: number,
    male: boolean
}
const obj1:IDesc = {
    name: 'foo',
    age: 19,
    male: true
}
```
属性的值和接口属性类型一一对应，属性不能多，也不能少。
#### 属性修饰 `Optional`和`Readonly`
```ts

interface IDesc {
    name: string, 
    age: number,
    male?: boolean,
}
const obj2: IDesc = {
    name: 'bar',
    age: 18
}  // 合法

obj2.male // boolean | undefined

interface IDesc2 {
  readonly name: string;
  age: number;
}

const obj3: IDesc2 = {
  name: 'foo',
  age: 599,
};

// 无法分配到 "name" ，因为它是只读属性
obj3.name = "bar"; 
```
> 数组和元组也能标记只读，不过不能像对象那样标记某个属性， `push`、`pop`等方法就不存在了
```ts
const arr1:readonly number[] =[1,2,3]
arr1.push(2) // push属性不存在
```

#### `type` 与 `interface`