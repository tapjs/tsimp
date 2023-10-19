import * as fs from "fs";

// cached fs.stat calls
const stats = new Map<string, fs.Stats>()
const errors = new Map<string, NodeJS.ErrnoException>()

export const statSync = (path: string) => {
  const c = stats.get(path)
  if (c) return c
  const e = errors.get(path)
  if (e) throw e
  try {
    const st = fs.statSync(path)
    stats.set(path, st)
    return st
  } catch (e) {
    errors.set(path, e as NodeJS.ErrnoException)
    throw e
  }
}

export const exists = (path: string) => {
  try {
    statSync(path)
    return true
  } catch {
    return false
  }
}

export const fileExist = (path: string) => {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

export const directoryExists = (path: string) => {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}
