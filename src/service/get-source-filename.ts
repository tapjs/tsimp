import { statSync } from 'fs'
import { parse, relative, resolve } from 'path'
import ts from 'typescript'
import { debug } from '../debug.js'
import { tsconfig } from './tsconfig.js'

/**
 * Get the source filename from the transpiled filename.
 *
 * Inverse of getTranspiledFileName
 */
export const getSourceFileName = (outFile: string): string => {
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

  const { dir, ext, name } = parse(resolve(outFile))
  const rel = relative(outDir, dir)

  // in jsx mode other than preserve, .js can be .tsx or .ts
  let sourceExt =
    ext === '.mjs'
      ? '.mts'
      : ext === '.cjs'
      ? '.cts'
      : ext === '.jsx'
      ? '.tsx'
      : jsx === ts.JsxEmit.Preserve
      ? '.ts'
      : ''

  const srcFile = resolve(rootDir, rel, name + sourceExt)
  try {
    if (!sourceExt) {
      try {
        if (statSync(srcFile + '.ts').isFile()) return srcFile + '.ts'
      } catch {}
      try {
        if (statSync(srcFile + '.tsx').isFile())
          return srcFile + '.tsx'
      } catch {}
    }
  } catch {}
  return srcFile
}
