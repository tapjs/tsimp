// Load a module from disk, and compile it.
// Result is cached by fileName + mtime, and cleared when config changes.
import { cachedMtime } from '@isaacs/cached'
import { mkdirSync, writeFileSync } from 'fs'
import { relative, resolve } from 'path'
import { ParsedCommandLine } from 'typescript'
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
  pretty = true,
): CompileResult => {
  fileName = resolve(fileName)
  const config = tsconfig()

  if (lastConfig && config !== lastConfig) {
    compileTypeCheck.cache.clear()
    compileTranspileOnly.cache.clear()
    compileTypeCheck.mtimeCache.clear()
    compileTranspileOnly.mtimeCache.clear()
  }
  lastConfig = config

  // compile to a file on disk, but only if the source has changed.
  const compile = typeCheck ? compileTypeCheck : compileTranspileOnly
  const cachedMtime = compile.mtimeCache.get(fileName)?.[0]
  const newMtime = compile.getMtime(fileName)
  const outFile = getOutputFile(fileName)
  const cachedResult = compile.cache.get(fileName)

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

const compileTypeCheck = cachedMtime((fileName: string) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  /* c8 ignore next */
  const content = readFile(fileName) || ''
  return compile(content, normalizedFileName, true)
})

const compileTranspileOnly = cachedMtime((fileName: string) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  /* c8 ignore next */
  const content = readFile(fileName) || ''
  return compile(content, normalizedFileName, false)
})

export const loadTypeCheck = (path: string) => load(path, true)
export const loadTranspileOnly = (path: string) => load(path, false)
