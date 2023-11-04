// Load a module from disk, and compile it.
// Result is cached by fileName + mtime, and cleared when config changes.
import { writeFileSync } from 'fs'
import { mkdirpSync } from 'mkdirp'
import { relative, resolve } from 'path'
import { enable, perfalize } from 'perfalize'
import { ParsedCommandLine } from 'typescript'
import { cachedMtime } from '@isaacs/cached'
import { compile } from './compile.js'
import { reportAll } from './diagnostic.js'
import {
  fileExists,
  getCurrentDirectory,
  normalizeSlashes,
  readFile,
} from './ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'
import { CompileResult } from '../types.js'

enable({ minimum: 0 })

const sSMEdone = perfalize('setSourceMapsEnabled')
//@ts-ignore
process.setSourceMapsEnabled(true)
sSMEdone()

const setupDone = perfalize('setup')
let lastConfig: ParsedCommandLine
const cwd = getCurrentDirectory()
let didMkdirp = false
setupDone()

const loadDefine = perfalize('define load function')
// { fileName: jsFile, diagnostics: [...] }
export const load = (
  fileName: string,
  typeCheck = true,
  pretty = true
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
  const outFileBase = relative(cwd, fileName)
    .replace(/\.\./g, '__')
    .replace(/[\\\/]/g, '$$')
  const outFile = resolve(cwd, '.tsimp/compiled', outFileBase) + '.js'
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
  console.error('compiled', [
    relative(process.cwd(), fileName),
    duration,
  ])
  if (outputText) {
    if (!didMkdirp) {
      didMkdirp = true
      mkdirpSync(resolve(cwd, '.tsimp/compiled'))
    }
    writeFileSync(outFile, outputText)
    return {
      fileName: outFile,
      diagnostics: reportAll(diagnostics, pretty),
    }
  }
  return { diagnostics: reportAll(diagnostics, pretty) }
}
loadDefine()

const defineCompileTC = perfalize('define compileTypeCheck')
const compileTypeCheck = cachedMtime((fileName: string) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  return compile(readFile(fileName) || '', normalizedFileName, true)
})
defineCompileTC()

const defineCompileTO = perfalize('define compile transpile only')
const compileTranspileOnly = cachedMtime((fileName: string) => {
  const normalizedFileName: string = normalizeSlashes(fileName)
  return compile(readFile(fileName) || '', normalizedFileName, false)
})
defineCompileTO()

export const loadTypeCheck = (path: string) => load(path, true)
export const loadTranspileOnly = (path: string) => load(path, false)
