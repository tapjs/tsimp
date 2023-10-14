import { parse, relative, resolve } from 'path'
import ts from 'typescript'
import { debug } from './debug.js'
import { tsconfig } from './tsconfig.js'

/**
 * Get the transpiled filename from the source filename
 *
 * Inverse of getSourceFileName
 */
export const getTranspiledFileName = (sourceFile: string): string => {
  const {
    options: { outDir, rootDir, jsx },
  } = tsconfig()
  if (!outDir) {
    debug(tsconfig())
    throw new Error('did not get outDir in resolved tsconfig options')
  }
  if (!rootDir) {
    debug(tsconfig())
    throw new Error(
      'did not get rootDir in resolved tsconfig options'
    )
  }
  const { dir, ext, name } = parse(resolve(sourceFile))
  const rel = relative(rootDir, dir)
  const resultExt =
    ext === '.mts'
      ? '.mjs'
      : ext === '.cts'
      ? '.cjs'
      : ext === '.tsx' && jsx === ts.JsxEmit.Preserve
      ? '.jsx'
      : '.js'
  return resolve(outDir, rel, name + resultExt)
}
