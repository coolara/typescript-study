const a1 : string[] = ['1', '2']
const a2 : Array<number> = [1, 2]

const a3: [number, number, number] = [1, 2, 3]
a3[3]

const a4: [number, boolean? , string?] = [1]
const a5: [number, boolean? , string?] = [1, ,]
a5[1] = false
type length = typeof a4.length

const v1: void = null // 在`strictNullChecks`没有开启的情况下成立
const v2: void = undefined

const arr5: [string, number, boolean] = ['linbudu', 599, true];

// 长度为 "3" 的元组类型 "[string, number, boolean]" 在索引 "3" 处没有元素。
const [name1, age, male, other] = arr5; 

interface IDesc {
    name: string, 
    age: number,
    male: boolean
}
const obj:IDesc = {
    name: 'foo',
    age: 19,
    male: true
}

interface IDesc1 {
    name: string, 
    age: number,
    male?: boolean,
}
const obj2: IDesc1 = {
    name: 'bar',
    age: 18
}  // 合法

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

const  arr1:readonly number[] =[1,2,3]
arr1.push()