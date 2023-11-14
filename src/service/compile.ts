// Compile the input either in typecheck or transpile only mode, and
// fall back to a dialect-forced transpile-only result if the classifier
// gives us a different result than we want.
// This is not cached, it is cached at the load() level based on config
// and file change time.

import ts from 'typescript'
import { classifyModule } from '../classify-module.js'
import { normalizeSlashes } from '../ts-sys-cached.js'
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
  // if the module config is node(16|next), then we'll get what it
  // is classified as anyway.
  const shouldOverwriteEmitWhenForcingCommonJS = !(
    config.options.module === ts.ModuleKind.CommonJS ||
    config.options.module === ts.ModuleKind.Node16 ||
    config.options.module === ts.ModuleKind.NodeNext
  )
  const shouldOverwriteEmitWhenForcingEsm = !(
    config.options.module === ts.ModuleKind.ES2015 ||
    config.options.module === ts.ModuleKind.ES2020 ||
    config.options.module === ts.ModuleKind.ES2022 ||
    config.options.module === ts.ModuleKind.ESNext ||
    config.options.module === ts.ModuleKind.Node16 ||
    config.options.module === ts.ModuleKind.NodeNext
  )

  const normalizedFileName: string = normalizeSlashes(fileName)
  const classification = classifyModule(normalizedFileName)
  const getOutput = typeCheck
    ? getOutputTypeCheck
    : getOutputTranspileOnly

  let { outputText, diagnostics } = getOutput(
    code,
    normalizedFileName
  )

  const emitSkipped = outputText === undefined

  // If module classification contradicts the module config,
  // call the relevant transpile-only method
  switch (classification) {
    case 'commonjs':
      if (shouldOverwriteEmitWhenForcingCommonJS || emitSkipped) {
        return {
          ...getOutputForceCommonJS(code, normalizedFileName),
          diagnostics,
        }
      }
      break
    case 'module':
      if (shouldOverwriteEmitWhenForcingEsm || emitSkipped) {
        return {
          ...getOutputForceESM(code, normalizedFileName),
          diagnostics,
        }
      }
      break
  }

  return { outputText, diagnostics }
}
