import type { ParsedCommandLine } from 'typescript'
import { tsconfig } from './tsconfig.js'

// a map of files versioned by number
let config: ParsedCommandLine | undefined = undefined
let rfn: Set<string> | undefined = undefined
export const rootFileNames = () => {
  const newConf = tsconfig()
  if (newConf !== config) {
    rfn = undefined
    config = newConf
  }
  return rfn ?? (rfn = new Set(config.fileNames))
}
export const fileContents = new Map<string, string>()

let projectVersionNum = 0
export const fileVersions = new Map<string, number>(
  [...rootFileNames()].map(fileName => [fileName, 0])
)
export const projectVersion = () => String(projectVersionNum)
export const incProjectVersion = () => String(++projectVersionNum)

export const updateFileVersion = (
  fileName: string,
  contents: string
) => {
  const previousVersion = fileVersions.get(fileName) ?? 0
  const previousContents = fileContents.get(fileName)
  if (contents !== previousContents) {
    fileVersions.set(fileName, previousVersion + 1)
    fileContents.set(fileName, contents)
    incProjectVersion()
  }
}

export const addRootFile = (fileName: string) => {
  const rfn = rootFileNames()
  if (!rfn.has(fileName)) {
    rfn.add(fileName)
    incProjectVersion()
  }
}
