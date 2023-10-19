// Compile the input either in typecheck or transpile only mode, and
// fall back to a dialect-forced transpile-only result if the classifier
// gives us a different result than we want.

import { resolve } from 'node:path'
import ts from 'typescript'
import { getOutputTypeCheck } from './get-output-typecheck.js'
import {
  getOutputForceCommonJS,
  getOutputForceESM,
  getOutputTranspileOnly,
} from './transpile-only.js'
import { tsconfig } from './tsconfig.js'

const classifyModule = (fileName: string) =>
  fileName.endsWith('.cts') || fileName.endsWith('.cjs')
    ? 'nodecjs'
    : fileName.endsWith('.mts') || fileName.endsWith('.mjs')
    ? 'nodeesm'
    : 'auto'

export const compile = (
  code: string,
  fileName: string,
  transpileOnly = false
) => {
  const config = tsconfig()
  const shouldOverwriteEmitWhenForcingCommonJS =
    config.options.module !== ts.ModuleKind.CommonJS
  const shouldOverwriteEmitWhenForcingEsm = !(
    config.options.module === ts.ModuleKind.ES2015 ||
    (ts.ModuleKind.ES2020 &&
      config.options.module === ts.ModuleKind.ES2020) ||
    (ts.ModuleKind.ES2022 &&
      config.options.module === ts.ModuleKind.ES2022) ||
    config.options.module === ts.ModuleKind.ESNext
  )

  const normalizedFileName: string = (ts as any).normalizeSlashes(
    fileName
  )
  const classification = classifyModule(normalizedFileName)
  let value: string | undefined = ''
  const getOutput = transpileOnly
    ? getOutputTranspileOnly
    : getOutputTypeCheck

  const emitSkipped =
    (value = getOutput(code, normalizedFileName)) === undefined

  // If module classification contradicts the above, call the relevant transpiler
  if (
    classification === 'nodecjs' &&
    (shouldOverwriteEmitWhenForcingCommonJS || emitSkipped)
  ) {
    value = getOutputForceCommonJS(code, normalizedFileName)
  } else if (
    classification === 'nodeesm' &&
    (shouldOverwriteEmitWhenForcingEsm || emitSkipped)
  ) {
    value = getOutputForceESM(code, normalizedFileName)
  } else if (emitSkipped) {
    // Happens when ts compiler skips emit or in transpileOnly mode
    const classification = classifyModule(fileName)
    value =
      classification === 'nodecjs'
        ? getOutputForceCommonJS(code, normalizedFileName)
        : classification === 'nodeesm'
        ? getOutputForceESM(code, normalizedFileName)
        : getOutputTranspileOnly(code, normalizedFileName)
  }

  return value
}

for (const to of [true, false]) {
  console.error('compileOnly='+to,
    compile(
      `
type Foo = { bar: 1 }
console.log({ bar: '1' } as Foo)
;(process as NodeJS.Process & { blahDeeBloo?: boolean }).blahDeeBloo = true
//export type M = Map<string, any>
`,
      resolve('./some-file.ts'),
      to
    )
  )
}
