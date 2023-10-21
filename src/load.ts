// Load a module from disk, and compile it.
// Result is cached by fileName + mtime, and cleared when config changes.
//@ts-ignore
process.setSourceMapsEnabled(true)
import { resolve } from 'path'
import ts from 'typescript'
import { cachedMtime } from './cached.js'
import { compile } from './compile.js'
import { readFile } from './ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'

// TODO: serialize load caches to disk

let lastConfig: ts.ParsedCommandLine

export const load = (fileName: string, typeCheck = true) => {
  console.error('LOAD', fileName)
  fileName = resolve(fileName)
  const config = tsconfig()
  if (lastConfig && config !== lastConfig) {
    console.error('load: config changed, clear compile caches')
    compileTypeCheck.cache.clear()
    compileTranspileOnly.cache.clear()
    compileTypeCheck.mtimeCache.clear()
    compileTranspileOnly.mtimeCache.clear()
  }
  lastConfig = config
  const compile = typeCheck ? compileTypeCheck : compileTranspileOnly
  return compile(fileName)
}

const compileTypeCheck = cachedMtime((fileName: string) => {
  const normalizedFileName: string = (ts as any).normalizeSlashes(
    fileName
  )
  return compile(readFile(fileName) || '', normalizedFileName, true)
})

const compileTranspileOnly = cachedMtime((fileName: string) => {
  const normalizedFileName: string = (ts as any).normalizeSlashes(
    fileName
  )
  return compile(readFile(fileName) || '', normalizedFileName, false)
})

export const loadTypeCheck = (path: string) => load(path, true)
export const loadTranspileOnly = (path: string) => load(path, false)

import { enable, perfalize } from 'perfalize'
if (process.env.SMOKE_TEST_LOAD === '1') {
  enable({ minimum: 0 })
  for (const i of [1, 2]) {
    for (const typeCheck of [true, false]) {
      const d = perfalize(`load typeCheck=${typeCheck} i=${i}`)
      const load = typeCheck ? loadTypeCheck : loadTranspileOnly
      console.error(
        `load typeCheck=${typeCheck} i=${i}`,
        load('./src/x.ts')
      )
      d()
    }
  }
}
