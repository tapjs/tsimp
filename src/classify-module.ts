// figure out whether a given module should be interpreted as ESM or CJS

import { cachedMtime } from '@isaacs/cached'
import { catchWrap } from '@isaacs/catcher'
import { dirname, resolve } from 'path'
import { walkUp } from 'walk-up-path'
import { readFile } from './ts-sys-cached.js'

export type PackageJsonType = 'commonjs' | 'module'
export const isPackageJsonType = (t: any): t is PackageJsonType =>
  typeof t === 'string' && (t === 'commonjs' || t === 'module')

const readPJType = cachedMtime(
  catchWrap((pj: string) => {
    const contents = readFile(pj)
    if (!contents) {
      return undefined
    }
    const t = JSON.parse(contents).type
    return isPackageJsonType(t) ? t : 'commonjs'
  }),
)

export const classifyModule = (
  fileName: string,
): PackageJsonType | 'json' => {
  if (fileName.endsWith('.json')) {
    return 'json'
  }
  if (fileName.endsWith('.cts') || fileName.endsWith('.cjs')) {
    return 'commonjs'
  } else if (fileName.endsWith('.mts') || fileName.endsWith('.mjs')) {
    return 'module'
  } else {
    for (const dir of walkUp(dirname(fileName))) {
      const t = readPJType(resolve(dir, 'package.json'))
      if (t) return t
    }
  }
  return 'commonjs'
}
