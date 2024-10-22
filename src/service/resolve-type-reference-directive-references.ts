import ts from 'typescript'
import { getCurrentDirectory } from '../ts-sys-cached.js'
import { createModeAwareCacheKey } from './create-mode-aware-cache-key.js'
import { getCanonicalFileName } from './get-canonical-filename.js'
import { tsconfig } from './tsconfig.js'

// ResolveTypeReferenceDirectiveReferences internal cache
const rtrdrInternalCache = new Map<
  string,
  ts.ResolvedTypeReferenceDirectiveWithFailedLookupLocations
>()

export const getResolveTypeReferenceDirectiveReferences = (
  host: ts.LanguageServiceHost,
  moduleResolutionCache: ts.ModuleResolutionCache,
) => {
  const config = tsconfig()
  const typeReferenceDirectiveResolutionCache =
    ts.createTypeReferenceDirectiveResolutionCache(
      getCurrentDirectory(),
      getCanonicalFileName,
      config.options,
      moduleResolutionCache.getPackageJsonInfoCache(),
    )

  const resolveTypeReferenceDirectiveReferences = (
    typeDirectiveReferences: readonly (ts.FileReference | string)[],
    containingFile: string,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions,
    containingSourceFile: ts.SourceFile | string | undefined,
    _reusedNames?: (ts.FileReference | string)[],
  ): readonly ts.ResolvedTypeReferenceDirectiveWithFailedLookupLocations[] => {
    const entries = typeDirectiveReferences
    const resolutionCache = typeReferenceDirectiveResolutionCache
    const createLoader = (ts as any)
      .createTypeReferenceResolutionLoader as (
      containingFile: string,
      redirectedReference: ts.ResolvedProjectReference | undefined,
      options: ts.CompilerOptions,
      host: ts.ModuleResolutionHost,
      resolutionCache: ts.TypeReferenceDirectiveResolutionCache,
    ) => any

    /* c8 ignore start */
    if (typeDirectiveReferences.length === 0) return []
    /* c8 ignore stop */
    const resolutions: any[] = []

    const loader = createLoader(
      containingFile,
      redirectedReference,
      options,
      host,
      resolutionCache,
    )
    for (const entry of entries) {
      const name = loader.nameAndMode.getName(entry)
      const mode = loader.nameAndMode.getMode(
        entry,
        containingSourceFile,
        options,
      )
      const key = createModeAwareCacheKey(name, mode)
      let result = rtrdrInternalCache.get(key)
      if (!result) {
        rtrdrInternalCache.set(
          key,
          (result = loader.resolve(name, mode)),
        )
      }
      resolutions.push(result)
    }
    return resolutions
  }

  return resolveTypeReferenceDirectiveReferences
}
