import { relative, resolve } from 'node:path'

const cwd = process.cwd()

export const getOutputFile = (fileName: string): string => {
  const outFileBase = relative(cwd, fileName)
    .replace(/\./g, '_')
    .replace(/[\\\/]/g, '_$$$$_')
  return resolve(cwd, '.tsimp/compiled', outFileBase) + '.js'
}
