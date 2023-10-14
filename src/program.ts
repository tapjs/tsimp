import ts from 'typescript'
import { compilerHost } from './compiler-host.js'
import { entryModule } from './entry-module.js'
import { start } from './timing.js'
import { tsconfig } from './tsconfig.js'

let prog: ts.Program
export const program = () => {
  if (prog) return prog
  const done = start('createProgram')
  prog = ts.createProgram(
    [entryModule()],
    tsconfig().options,
    compilerHost(),
    undefined,
    tsconfig().errors
  )
  done()
  return prog
}
