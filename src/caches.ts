import { mkdirp } from 'mkdirp'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { deserialize, serialize } from 'node:v8'
import { rimrafSync } from 'rimraf'
import ts from 'typescript'
import { info } from './debug.js'
import { start } from './timing.js'
import { tsconfig } from './tsconfig.js'

const initDone = start('cache init')
export type Caches = {
  /** cache of compiled code, key is the outFile */
  compileCache: Map<string, string>

  /** map of mtime values we saw last time we compiled */
  mtimeCache: Map<string, number>

  /** cache of resolved modules, from=>{to=>resolved} */
  resolveCache: Map<
    string,
    Map<string, ts.ResolvedModuleWithFailedLookupLocations>
  >

  /** map of source contents of files we compiled, key is inFile */
  sourceCache: Map<string, string>
}

// load from a serialized cache on disk to avoid having to transpile
// files that haven't changed since the last run. Disk cache has to
// be keyed to the config and ts version, as changing the config/compiler
// changes the program.

const options = Object.fromEntries(
  Object.entries(tsconfig().options).sort(([a], [b]) =>
    a.localeCompare(b, 'en')
  )
)

const optionsDigest =
  `ts${ts.versionMajorMinor}.` +
  createHash('sha-512').update(serialize(options)).digest('hex')

const fsCacheRoot = resolve('node_modules/.cache/tsimp')
// if there are caches for other configs, delete them.
// they're outdated and just taking up space.
try {
  rimrafSync(
    readdirSync(fsCacheRoot).filter(e => e !== optionsDigest)
  )
} catch {}

const fsCacheFile = resolve(
  'node_modules/.cache/tsimp/cache/' + optionsDigest
)

const readDiskCache = (): Caches => {
  const done = start('readDiskCache')
  try {
    try {
      const fromFileCache = deserialize(
        readFileSync(fsCacheFile)
      ) as Caches
      if (
        fromFileCache.compileCache instanceof Map &&
        fromFileCache.resolveCache instanceof Map &&
        fromFileCache.sourceCache instanceof Map &&
        fromFileCache.mtimeCache instanceof Map
      ) {
        return fromFileCache
      }
    } catch {}
    return {
      compileCache: new Map<string, string>(),
      resolveCache: new Map<
        string,
        Map<string, ts.ResolvedModuleWithFailedLookupLocations>
      >(),
      sourceCache: new Map<string, string>(),
      mtimeCache: new Map<string, number>(),
    }
  } finally {
    done()
  }
}

let saving: Promise<void> | null = null
const saveDiskCache = (): Promise<void> => {
  if (saving) return saving
  const done = start('saveDiskCache')
  info('SAVE DISK CACHE', caches)
  // defer it to prevent blocking any other actions with the CPU-heavy
  // serialization. This also prevents writing to the cache more than
  // 10x per second, and since cache lookups are always best-effort,
  // it's fine.
  saving = setTimeout(100, undefined, { ref: false })
    .then(() => mkdirp(dirname(fsCacheFile)))
    .then(() => writeFile(fsCacheFile, serialize(caches)))
    .then(() => {
      info('SAVED SUCCESSFULLY')
      saving = null
    })
    .catch(er => {
      saving = null
      throw er
    })
    .finally(() => done())
  return saving
}

type MapK<M> = M extends Map<infer K, any> ? K : never
type MapV<M> = M extends Map<any, infer V> ? V : never

function saveSet<T extends Map<any, any>>(
  this: T,
  k: MapK<T>,
  v: MapV<T>
) {
  const ret = Map.prototype.set.call(this, k, v)
  saveDiskCache()
  return ret
}

function saveDelete<T extends Map<any, any>>(this: T, k: MapK<T>) {
  const ret = Map.prototype.delete.call(this, k)
  saveDiskCache()
  return ret
}

const caches: Caches = readDiskCache()
export const { compileCache, mtimeCache, resolveCache, sourceCache } =
  caches

compileCache.delete = saveDelete<typeof compileCache>
compileCache.set = saveSet<typeof compileCache>
mtimeCache.delete = saveDelete<typeof mtimeCache>
mtimeCache.set = saveSet<typeof mtimeCache>
resolveCache.delete = saveDelete<typeof resolveCache>
resolveCache.set = saveSet<typeof resolveCache>
sourceCache.delete = saveDelete<typeof sourceCache>
sourceCache.set = saveSet<typeof sourceCache>

initDone()
