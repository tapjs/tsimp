import { warn } from './debug.js'
warn('in foo')
type Foo = {
  bar: string
}
const foo: Foo = { bar: 'true' }
console.log(foo)
export {}
console.log('ok')
