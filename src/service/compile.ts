// Compile the input either in typecheck or transpile only mode, and
// fall back to a dialect-forced transpile-only result if the classifier
// gives us a different result than we want.
// This is not cached, it is cached at the load() level based on config
// and file change time.

import { classifyModule } from '../classify-module.js'
import { normalizeSlashes } from '../ts-sys-cached.js'
import { getOutputTypeCheck } from './get-output-typecheck.js'
import {
  getOutputForceCommonJS,
  getOutputForceESM,
  getOutputTranspileOnly,
} from './transpile-only.js'

export const compile = (
  code: string,
  fileName: string,
  typeCheck = true,
) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  const classification = classifyModule(normalizedFileName)
  const getOutput =
    typeCheck ? getOutputTypeCheck : getOutputTranspileOnly
  const forceOutput =
    classification === 'commonjs' ?
      getOutputForceCommonJS
    : getOutputForceESM

  let { outputText, diagnostics } = getOutput(
    code,
    normalizedFileName,
  )

  return {
    /* c8 ignore start */
    outputText:
      outputText ?? forceOutput(code, normalizedFileName).outputText,
    /* c8 ignore stop */
    diagnostics,
  }
}
