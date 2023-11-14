// Get output with full type-checking from the LanguageService.

import { relative } from 'path'
import type ts from 'typescript'
import { info, warn } from '../debug.js'
import { addRootFile, updateFileVersion } from './file-versions.js'
import { getLanguageService } from './language-service.js'
import { markFileNameInternal } from './resolve-module-name-literals.js'

const cwd = process.cwd()
export const getOutputTypeCheck = (
  code: string,
  fileName: string
): {
  outputText: string | undefined
  diagnostics: ts.Diagnostic[]
} => {
  const start = performance.now()
  const service = getLanguageService()
  const initialProgram = service.getProgram()
  /* c8 ignore start */
  if (!initialProgram) {
    throw new Error('failed to load TS program')
  }
  /* c8 ignore stop */
  addRootFile(fileName)
  markFileNameInternal(fileName)
  updateFileVersion(fileName, code)

  // if we can't get the source file, then return the code un-compiled.
  // Eg, loading a JS file if allowJs is not set.
  const programBefore = service.getProgram()
  const sf = programBefore?.getSourceFile(fileName)

  /* c8 ignore start */
  if (!sf) {
    warn('could not get sourceFile, returning raw contents', fileName)
    return {
      outputText: code,
      diagnostics: [],
    }
  }
  /* c8 ignore stop */

  if (initialProgram && programBefore !== initialProgram) {
    info('compiler rebuilt Program', fileName)
  }

  const output = service.getEmitOutput(fileName)

  const diagnostics = service
    .getSemanticDiagnostics(fileName)
    .concat(service.getSyntacticDiagnostics(fileName))

  const programAfter = service.getProgram()
  if (programBefore !== programAfter) {
    warn(`service.program changed while compiling ${fileName}`)
  }

  try {
    // these errors *should* be impossible.
    /* c8 ignore start */
    if (output.emitSkipped) {
      return { outputText: undefined, diagnostics }
    }
    if (output.outputFiles.length === 0) {
      throw new TypeError(
        `Unable to require file: ${relative(cwd, fileName)}\n` +
          'This is usually the result of a faulty configuration or import. ' +
          'Make sure there is a `.js`, `.json` or other executable ' +
          'extension with loader attached before `tsimp` available.'
      )
    }
    /* c8 ignore stop */

    return {
      outputText: output.outputFiles[0]?.text,
      diagnostics,
    }
  } finally {
    const duration =
      Math.floor((performance.now() - start) * 1000) / 1000
    const rel = relative(cwd, fileName)
    info('emitted with typeCheck', [rel, duration])
  }
}
