import { warn } from './debug.cjs'
warn('in foo')
type Foo = {
  bar: string
}
const foo: Foo = { bar: 'true' }
console.log(foo)
export {}
console.log('ok')
