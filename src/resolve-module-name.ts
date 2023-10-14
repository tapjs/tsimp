import { statSync } from 'node:fs'
import ts from 'typescript'
import { resolveCache } from './caches.js'
import { compilerHost } from './compiler-host.js'
import { entryModule } from './entry-module.js'
import {start} from './timing.js'
import { tsconfig } from './tsconfig.js'

const cacheCheckVerified = new Set<string>()

export const resolveModuleName = (
  moduleName: string,
  containingFile: string = entryModule()
) => {
  const done = start('resolveModuleName')
  const cache =
    resolveCache.get(containingFile) ??
    new Map<string, ts.ResolvedModuleWithFailedLookupLocations>()
  const fromCache = cache.get(moduleName)
  if (fromCache) {
    if (!fromCache.resolvedModule) {
      done()
      return fromCache
    }

    // verify that there still exists a file there
    const fn = fromCache.resolvedModule.resolvedFileName
    try {
      if (cacheCheckVerified.has(fn)) {
        done()
        return fromCache
      } else if (statSync(fn).isFile()) {
        cacheCheckVerified.add(fn)
        done()
        return fromCache
      }
    } catch {}
  }

  const doneUncached = start('resolveModuleName: uncached')
  const { options } = tsconfig()
  const host = compilerHost()
  const resolved = ts.resolveModuleName(
    moduleName,
    containingFile,
    options,
    host,
    undefined,
    undefined,
    ts.getImpliedNodeFormatForFile(
      containingFile as ts.Path,
      undefined,
      host,
      options
    )
  )
  cache.set(moduleName, resolved)
  resolveCache.set(containingFile, cache)
  // only trust the cache for the moment if it was an error
  // this saves repeated failed lookups in a single tick, without
  // punishing the user forever if they try to load a missing file once.
  if (!resolved.resolvedModule?.resolvedFileName) {
    queueMicrotask(() => {
      cache.delete(moduleName)
      resolveCache.set(containingFile, cache)
    })
  }
  done()
  doneUncached()
  return resolved
}
