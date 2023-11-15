import { cached, cachedMtime } from '@isaacs/cached'
import { catcher, catchWrap } from '@isaacs/catcher'
import {
  BigIntStats,
  Dirent,
  readdirSync,
  readFileSync,
  realpathSync,
  Stats,
  statSync,
} from 'fs'
import { isAbsolute, relative, resolve, sep } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
const cwd = process.cwd()

export const normalizeSlashes = (path: string): string =>
  path.includes('\\') ? path.replace(/\\/g, '/') : path

export const readFile = cachedMtime(
  catchWrap((p: string) => readFileSync(p, 'utf8'), undefined)
)

const safeStat = catchWrap(statSync)
export const directoryExists = cached(
  (p: string) => !!safeStat(p)?.isDirectory()
)
export const fileExists = cached(
  (p: string) => !!safeStat(p)?.isFile()
)

export const realpath = cachedMtime((path: string) =>
  catcher(() => realpathSync(path, 'utf8'), path)
)

export const getCurrentDirectory = () => cwd

/* c8 ignore start */
const pathHasTrailingSlash =
  sep === '/'
    ? (p: string) => p.endsWith('/')
    : (p: string) => p.endsWith('/') || p.endsWith(sep)
/* c8 ignore stop */

export const normalizePath = cached((path: string): string => {
  const trailingSlash = pathHasTrailingSlash(path)
  path = normalizeSlashes(path)
  const isFileUrl = path.startsWith('file://')
  if (isFileUrl) path = fileURLToPath(path)
  const isAbs = isFileUrl || isAbsolute(path)
  path = resolve(path)
  if (!isAbs) path = relative(cwd, path)
  if (isFileUrl) path = String(pathToFileURL(path))
  path = normalizeSlashes(path)
  if (trailingSlash) path += '/'
  if (sep === '\\') {
    // capitalize drive letters and UNC host/share names.
    path = path.replace(/^([a-z]:\/|\/\/[^\/]+\/[^\/]+)/, $ =>
      $.toUpperCase()
    )
  }
  return path
})

export interface FileSystemEntries {
  files: string[]
  directories: string[]
}
const emptyFileSystemEntries: FileSystemEntries = {
  files: [],
  directories: [],
}

const getFileSystemEntries = cachedMtime(
  catchWrap((path: string): FileSystemEntries => {
    const entries = readdirSync(path || '.', { withFileTypes: true })
    const files: string[] = []
    const directories: string[] = []
    for (const dirent of entries) {
      const entry = dirent.name
      let stat: Dirent | Stats | BigIntStats | undefined
      /* c8 ignore start */
      if (entry === '.' || entry === '..') continue
      /* c8 ignore stop */
      if (dirent.isSymbolicLink()) {
        stat = safeStat(resolve(path, entry))
      } else {
        stat = dirent
      }
      if (stat?.isFile()) files.push(entry)
      else if (stat?.isDirectory()) directories.push(entry)
    }
    files.sort((a, b) => a.localeCompare(b, 'en'))
    directories.sort((a, b) => a.localeCompare(b, 'en'))
    return { files, directories }
  }, emptyFileSystemEntries)
)

export const getDirectories = (path: string) =>
  getFileSystemEntries(path).directories

export const getFiles = (path: string) =>
  getFileSystemEntries(path).files
