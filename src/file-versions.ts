import { tsconfig } from './tsconfig.js'

// XXX needs reset when tsconfig changes

// a map of files versioned by number
const config = tsconfig()
export const rootFileNames = new Set(config.fileNames)
export const fileContents = new Map<string, string>()

let projectVersionNum = 0
export const fileVersions = new Map<string, number>(
  [...rootFileNames].map(fileName => [fileName, 0])
)
export const projectVersion = () => String(projectVersionNum)
export const incProjectVersion = () => String(++projectVersionNum)
