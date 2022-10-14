

const returnNum = () => 1 + 1
enum Items {
  Foo = returnNum(),
  Bar = 19,
  Baz,
}

const enum Items1 {
  Foo,
  Bar,
  Baz
}
let sfoo1 = 'foo'
const sfoo = 'foo'

const sy1: symbol = Symbol('foo')
const sy2: unique symbol = Symbol('foo')

interface Tmp {
    [sy2]: string
    [sy1]: number
}