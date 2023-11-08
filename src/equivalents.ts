import { parse } from 'path'

export const jsExts = ['.js', '.mjs', '.cjs', '.jsx'] as const
export const tsExts = ['.ts', '.mts', '.cts', '.tsx'] as const
export type JSExt = (typeof jsExts)[number]
export type TSExt = (typeof tsExts)[number]

export const isTSExt = (e: any): e is TSExt => tsExts.includes(e)
export const isJSExt = (e: any): e is JSExt => jsExts.includes(e)

type MapBase = {
  [k in JSExt]: readonly TSExt[]
} & {
  [t in TSExt]: readonly JSExt[]
}
interface ExtMap extends MapBase {
  '.js': readonly ['.ts', '.tsx']
  '.jsx': readonly ['.tsx']
  '.cjs': readonly ['.cts']
  '.mjs': readonly ['.mts']
  '.ts': readonly ['.js']
  '.mts': readonly ['.mjs']
  '.cts': readonly ['.cjs']
  '.tsx': readonly ['.js', '.jsx']
}

export const map: ExtMap = {
  '.js': ['.ts', '.tsx'],
  '.jsx': ['.tsx'],
  '.cjs': ['.cts'],
  '.mjs': ['.mts'],
  '.ts': ['.js'],
  '.mts': ['.mjs'],
  '.cts': ['.cjs'],
  '.tsx': ['.js', '.jsx'],
} as const

export const allExts = Object.keys(map)
export const isExt = (e: any): e is TSExt | JSExt => allExts.includes(e)

export const equivalents = (path: string, extensionless = false): string[] => {
  const { ext } = parse(path)
  const stem = path.substring(0, path.length - ext.length)
  const equivs:string[] = []
  if (isExt(ext)) {
    equivs.push(...map[ext].map((e => stem+e)))
  }
  if (extensionless) {
    equivs.push(...allExts.map(e => path + e))
  }
  return equivs
}
