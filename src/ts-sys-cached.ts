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
import { cached, cachedMtime } from './cached.js'
import { catcher, catchWrap } from './catcher.js'
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
export const realpath = cachedMtime((path: string) =>
  catcher(() => realpathSync(path, 'utf8'), path)
)
export const getCurrentDirectory = () => cwd
export const fileExists = cached(
  (p: string) => !!safeStat(p)?.isFile()
)

const pathHasTrailingSlash =
  sep === '/'
    ? (p: string) => p.endsWith('/')
    : (p: string) => p.endsWith('/') || p.endsWith(sep)

const normalizePathRaw = (path: string): string => {
  const trailingSlash = pathHasTrailingSlash(path)
  path = normalizeSlashes(path)
  const isFileUrl = path.startsWith('file://')
  if (isFileUrl) path = path.substring('file://'.length)
  const isAbs = isFileUrl || isAbsolute(path)
  path = resolve(path)
  if (!isAbs) path = relative(cwd, path)
  if (isFileUrl) path = 'file://' + path
  return (
    (isFileUrl ? 'file://' : '') +
    normalizeSlashes(path) +
    (trailingSlash ? '/' : '')
  )
}
export const normalizePath = cached(normalizePathRaw)

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
      if (entry === '.' || entry === '..') continue
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
