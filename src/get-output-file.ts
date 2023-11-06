import { relative, resolve } from 'node:path'

const cwd = process.cwd()

export const getOutputFile = (fileName: string): string => {
  const outFileBase = relative(cwd, fileName)
    .replace(/\.\./g, '__')
    .replace(/[\\\/]/g, '$$')
  return resolve(cwd, '.tsimp/compiled', outFileBase) + '.js'
}
