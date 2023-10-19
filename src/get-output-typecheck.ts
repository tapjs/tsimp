// Get output with full type-checking from the LanguageService.

import { relative } from 'path'
import { info, warn } from './debug.js'
import { report } from './diagnostic.js'
import { updateMemoryCache } from './resolve-module-name-literals.js'
import { getLanguageService } from './service.js'
import { getCurrentDirectory } from './ts-sys-cached.js'

export const getOutputTypeCheck = (
  code: string,
  fileName: string
): string | undefined => {
  const { service, initialProgram } = getLanguageService()
  const cwd = getCurrentDirectory()
  updateMemoryCache(code, fileName)

  const programBefore = service.getProgram()
  if (initialProgram && programBefore !== initialProgram) {
    info('compiler rebuilt Program', fileName)
  }

  const output = service.getEmitOutput(fileName)

  const diagnostics = service
    .getSemanticDiagnostics(fileName)
    .concat(service.getSyntacticDiagnostics(fileName))

  const programAfter = service.getProgram()
  if (programBefore !== programAfter) {
    // TODO: is this because we're not doing our own moduleResolution
    // stuff, but if we update the program version and internal files
    // and such, then it won't have to make a new Program?
    warn(`service.program changed while compiling ${fileName}`)
  }

  if (diagnostics.length) diagnostics.forEach(d => report(d))

  if (output.emitSkipped) {
    return undefined
  }

  // Throw an error when requiring `.d.ts` files.
  if (output.outputFiles.length === 0) {
    throw new TypeError(
      `Unable to require file: ${relative(cwd, fileName)}\n` +
        'This is usually the result of a faulty configuration or import. ' +
        'Make sure there is a `.js`, `.json` or other executable ' +
        'extension with loader attached before `tsimp` available.'
    )
  }

  return output.outputFiles[0]?.text
}
