const foo: (name: string) => number = function (name){
    return name.length
}
const f2: (name: string) => number = (name) => name.length

interface IFuncFoo {
    (name: string): number
}
const f4: IFuncFoo = (name) => name.length

class Base {
     print(){
        console.log('base')
    }
}
class Derivde extends Base {
    print(){
        super.print()
    }
}