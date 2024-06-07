// Load a module from disk, and compile it.
// Result is cached by fileName + mtime, and cleared when config changes.
import { cachedMtime } from '@isaacs/cached'
import { mkdirSync, writeFileSync } from 'fs'
import { relative, resolve } from 'path'
import { Diagnostic, ParsedCommandLine } from 'typescript'
import { info } from '../debug.js'
import { getOutputFile } from '../get-output-file.js'
import {
  fileExists,
  getCurrentDirectory,
  normalizeSlashes,
  readFile,
} from '../ts-sys-cached.js'
import { CompileResult } from '../types.js'
import { compile } from './compile.js'
import { reportAll } from './diagnostic.js'
import { tsconfig } from './tsconfig.js'

let lastConfig: ParsedCommandLine
const cwd = getCurrentDirectory()
let didMkdirp = false

// { fileName: jsFile, diagnostics: [...] }
export const load = (
  fileName: string,
  typeCheck = true,
  pretty = true
): CompileResult => {
  fileName = resolve(fileName)
  const config = tsconfig()

  if (lastConfig && config !== lastConfig) {
    compileTranspileOnly.cache.clear()
    compileTranspileOnly.mtimeCache.clear()
  }
  lastConfig = config

  let compile: (fileName: string) => {
    outputText: string | undefined
    diagnostics: Diagnostic[]
  }
  const outFile = getOutputFile(fileName)

  // TODO: Re-enable caching of type-checked results
  if (typeCheck) {
    compile = compileTypeCheck
  } else {
    let cachedCompile = compileTranspileOnly
    compile = cachedCompile

    // Skip compiling if the source has not changed
    const cachedMtime = cachedCompile.mtimeCache.get(fileName)?.[0]
    const newMtime = cachedCompile.getMtime(fileName)
    const cachedResult = cachedCompile.cache.get(fileName)

    if (
      cachedMtime &&
      cachedMtime === newMtime &&
      fileExists(outFile) &&
      cachedResult
    ) {
      // saw this one, and have previous build available
      return {
        fileName: outFile,
        diagnostics: reportAll(cachedResult.diagnostics, pretty),
      }
    }
  }

  // have to perform the compilation
  const start = performance.now()
  const { outputText, diagnostics } = compile(fileName)
  const duration =
    Math.floor((performance.now() - start) * 1000) / 1000
  info('compiled', [relative(process.cwd(), fileName), duration])

  /* c8 ignore start */
  if (!outputText) {
    return { diagnostics: reportAll(diagnostics, pretty) }
  }
  /* c8 ignore stop */

  if (!didMkdirp) {
    didMkdirp = true
    mkdirSync(resolve(cwd, '.tsimp/compiled'), { recursive: true })
  }
  writeFileSync(outFile, outputText)
  return {
    fileName: outFile,
    diagnostics: reportAll(diagnostics, pretty),
  }
}

// It's fine to cache the results of transpilation, as compileTranspileOnly does,
// but it's not safe for this function to perform caching based purely on the
// mtime of a single source file. A dependency may have (for example)
// deleted something that the file was referencing.
// TODO: Cache compile results based on the mtime of all affected files,
//       not just the one we're currently getting the results for
//       (update cachedMtime() to accept an array of paths)
const compileTypeCheck = (fileName: string) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  /* c8 ignore next */
  const content = readFile(fileName) || ''
  return compile(content, normalizedFileName, true)
}

const compileTranspileOnly = cachedMtime((fileName: string) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  /* c8 ignore next */
  const content = readFile(fileName) || ''
  return compile(content, normalizedFileName, false)
})

export const loadTypeCheck = (path: string) => load(path, true)
export const loadTranspileOnly = (path: string) => load(path, false)
