import type { Diagnostic } from 'typescript'
import {warn} from './debug.js'
import { report } from './diagnostic.js'

export default (message: string, d?: Diagnostic) => {
  warn(message)
  if (d) report(d)
  process.exit(1)
}
