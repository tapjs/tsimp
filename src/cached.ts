import { statSync } from 'fs'
import { catcher } from './catcher.js'

// cache an arbitrary function of arity 0 or 1
export function cached<R>(
  fn: () => R
): (() => R) & { cache: Map<undefined, R> }
export function cached<A, R>(
  fn: (arg: A) => R
): ((arg: A) => R) & { cache: Map<A, R> }
export function cached<A, R>(
  fn: (arg?: A) => R
): ((arg?: A) => R) & { cache: Map<A | undefined, R> } {
  const cache = new Map<A | undefined, R>()
  return Object.assign(
    (arg?: A) => {
      const has = cache.has(arg)
      if (has) {
        return cache.get(arg) as R
      }
      const r = fn(arg)
      cache.set(arg, r)
      return r
    },
    { cache }
  )
}

// some fs ops need to cache-bust when file changes
// only use when stat is faster than whatever it's doing.
export function cachedMtime<R>(
  fn: (path: string) => R,
  statFreqMs: number = 10
): ((path: string) => R) & {
  mtimeCache: Map<string, number>
  cache: Map<string, R>
  getMtime: (path: string) => number | undefined
} {
  let lastStat = -1 * statFreqMs
  const mtimeCache = new Map<string, number>()
  const cfn = cached(fn)
  const { cache } = cfn
  const getMtime = (path: string) => {
    if (performance.now() - lastStat > statFreqMs) {
      const m = catcher(() => Number(statSync(path).mtime))
      if (typeof m === 'number') {
        const cm = mtimeCache.get(path)
        if (cm && m !== cm) cache.delete(path)
        mtimeCache.set(path, m)
      } else {
        mtimeCache.delete(path)
      }
    }
    return mtimeCache.get(path)
  }
  return Object.assign(
    (path: string) => {
      getMtime(path)
      return cfn(path)
    },
    { mtimeCache, cache, getMtime }
  )
}
