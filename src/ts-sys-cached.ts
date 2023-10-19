import { realpathSync } from 'fs'
import ts from 'typescript'
import { cached } from './cached.js'

export const readFile = cached(ts.sys.readFile)
export const directoryExists = cached(ts.sys.directoryExists)
export const realpath = cached(
  /* c8 ignore start */
  ts.sys.realpath ?? ((path: string) => realpathSync(path))
  /* c8 ignore stop */
)
export const getCurrentDirectory = cached(ts.sys.getCurrentDirectory)
export const getDirectories = cached(ts.sys.getDirectories)
export const fileExists = cached(ts.sys.fileExists)

export const normalizePath = cached(
  (ts as any).normalizePath as (p: string) => string
)
