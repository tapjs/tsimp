import ts from 'typescript'
import { getCanonicalFileName } from './get-canonical-filename.js'
import { createModeAwareCacheKey } from './create-mode-aware-cache-key.js'
import { getCurrentDirectory } from './ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'

const config = tsconfig()

const resolveTypeReferenceDirectiveReferencesInternalCache = new Map<
  string,
  ts.ResolvedTypeReferenceDirectiveWithFailedLookupLocations
>()

export const getResolveTypeReferenceDirectiveReferences = (
  host: ts.LanguageServiceHost,
  moduleResolutionCache: ts.ModuleResolutionCache
) => {
  const typeReferenceDirectiveResolutionCache =
    ts.createTypeReferenceDirectiveResolutionCache(
      getCurrentDirectory(),
      getCanonicalFileName,
      config.options,
      moduleResolutionCache.getPackageJsonInfoCache()
    )
  const resolveTypeReferenceDirectiveReferences = (
    typeDirectiveReferences: readonly (ts.FileReference | string)[],
    containingFile: string,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions,
    containingSourceFile: ts.SourceFile | string | undefined
  ): readonly ts.ResolvedTypeReferenceDirectiveWithFailedLookupLocations[] => {
    const entries = typeDirectiveReferences
    const resolutionCache = typeReferenceDirectiveResolutionCache
    const createLoader = (ts as any)
      .createTypeReferenceResolutionLoader as (
      containingFile: string,
      redirectedReference: ts.ResolvedProjectReference | undefined,
      options: ts.CompilerOptions,
      host: ts.ModuleResolutionHost,
      resolutionCache: ts.TypeReferenceDirectiveResolutionCache
    ) => any

    if (typeDirectiveReferences.length === 0) return []
    const resolutions: any[] = []

    const cache = resolveTypeReferenceDirectiveReferencesInternalCache

    const loader = createLoader(
      containingFile,
      redirectedReference,
      options,
      host,
      resolutionCache
    )
    for (const entry of entries) {
      const name = loader.nameAndMode.getName(entry)
      const mode = loader.nameAndMode.getMode(
        entry,
        containingSourceFile
      )
      const key = createModeAwareCacheKey(name, mode)
      let result = cache.get(key)
      if (!result) {
        cache.set(key, (result = loader.resolve(name, mode)))
      }
      resolutions.push(result)
    }
    return resolutions
  }
  return resolveTypeReferenceDirectiveReferences
}
