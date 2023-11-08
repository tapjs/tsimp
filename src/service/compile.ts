// Compile the input either in typecheck or transpile only mode, and
// fall back to a dialect-forced transpile-only result if the classifier
// gives us a different result than we want.
// This is not cached, it is cached at the load() level based on config
// and file change time.

import ts from 'typescript'
import { classifyModule } from '../classify-module.js'
import { getOutputTypeCheck } from './get-output-typecheck.js'
import {
  getOutputForceCommonJS,
  getOutputForceESM,
  getOutputTranspileOnly,
} from './transpile-only.js'
import { tsconfig } from './tsconfig.js'

export const compile = (
  code: string,
  fileName: string,
  typeCheck = true
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
  const getOutput = typeCheck
    ? getOutputTypeCheck
    : getOutputTranspileOnly

  let { outputText, diagnostics } = getOutput(
    code,
    normalizedFileName
  )

  const emitSkipped = outputText === undefined

  // If module classification contradicts the above, call the relevant transpiler
  if (
    classification === 'commonjs' &&
    (shouldOverwriteEmitWhenForcingCommonJS || emitSkipped)
  ) {
    outputText = getOutputForceCommonJS(
      code,
      normalizedFileName
    ).outputText
  } else if (
    classification === 'module' &&
    (shouldOverwriteEmitWhenForcingEsm || emitSkipped)
  ) {
    outputText = getOutputForceESM(
      code,
      normalizedFileName
    ).outputText
  } else if (emitSkipped) {
    // Happens when ts compiler skips emit or in transpileOnly mode
    const classification = classifyModule(fileName)
    outputText =
      classification === 'commonjs'
        ? getOutputForceCommonJS(code, normalizedFileName).outputText
        : classification === 'module'
        ? getOutputForceESM(code, normalizedFileName).outputText
        : getOutputTranspileOnly(code, normalizedFileName).outputText
  }

  return { outputText, diagnostics }
}
