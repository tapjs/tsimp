import ts from 'typescript'
import {
  fileContents,
  fileVersions,
  incProjectVersion,
  rootFileNames,
} from './file-versions.js'
import { getCanonicalFileName } from './get-canonical-filename.js'
import { getCurrentDirectory } from './ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'

// XXX needs reset when tsconfig changes
const config = tsconfig()

export const moduleResolutionCache = ts.createModuleResolutionCache(
  getCurrentDirectory(),
  getCanonicalFileName,
  config.options,
  undefined
)

const knownInternalFilenames = new Set<string>()
const internalBuckets = new Set<string>([''])
const moduleBucketRe = /.*\/node_modules\/(?:@[^\/]+\/)?[^\/]+\//
const getModuleBucket = (filename: string) => {
  const find = moduleBucketRe.exec(filename)
  if (find) return find[0]
  return ''
}
const markBucketOfFilenameInternal = (filename: string) =>
  internalBuckets.add(getModuleBucket(filename))
export const isFileInInternalBucket = (filename: string) =>
  internalBuckets.has(getModuleBucket(filename))
const isFileKnownToBeInternal = (filename: string) =>
  knownInternalFilenames.has(filename)
const fixupResolvedModule = (
  resolvedModule:
    | ts.ResolvedModule
    | ts.ResolvedTypeReferenceDirective
) => {
  const { resolvedFileName } = resolvedModule
  if (resolvedFileName === undefined) return
  // [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
  // .ts,.mts,.cts is always switched to internal
  // .js is switched on-demand
  if (
    resolvedModule.isExternalLibraryImport &&
    ((resolvedFileName.endsWith('.ts') &&
      !resolvedFileName.endsWith('.d.ts')) ||
      (resolvedFileName.endsWith('.cts') &&
        !resolvedFileName.endsWith('.d.cts')) ||
      (resolvedFileName.endsWith('.mts') &&
        !resolvedFileName.endsWith('.d.mts')) ||
      isFileKnownToBeInternal(resolvedFileName) ||
      isFileInInternalBucket(resolvedFileName))
  ) {
    resolvedModule.isExternalLibraryImport = false
  }
  if (!resolvedModule.isExternalLibraryImport) {
    knownInternalFilenames.add(resolvedFileName)
  }
}

const tsResolverEquivalents = new Map<string, readonly string[]>([
  ['.ts', ['.js']],
  ['.tsx', ['.js', '.jsx']],
  ['.mts', ['.mjs']],
  ['.cts', ['.cjs']],
])

export const getResolveModuleNameLiterals = (
  host: ts.LanguageServiceHost
): Exclude<
  ts.LanguageServiceHost['resolveModuleNameLiterals'],
  undefined
> => {
  const resolveModuleNameLiterals: (
    moduleLiterals: readonly ts.StringLiteralLike[],
    containingFile: string,
    redirectedReference: ts.ResolvedProjectReference | undefined,
    options: ts.CompilerOptions,
    containingSourceFile: ts.SourceFile,
    reusedNames: readonly ts.StringLiteralLike[] | undefined
  ) => readonly ts.ResolvedModuleWithFailedLookupLocations[] = (
    moduleLiterals,
    containingFile,
    redirectedReference,
    options,
    containingSourceFile,
    _reusedNames
  ) => {
    // moduleLiterals[n].text is the equivalent to moduleName string
    return moduleLiterals.map((moduleLiteral, i) => {
      const moduleName = moduleLiteral.text
      const mode = containingSourceFile
        ? (
            ts as any as {
              getModeForResolutionAtIndex?(
                containingSourceFile: ts.SourceFile,
                index: number
              ):
                | ts.ModuleKind.CommonJS
                | ts.ModuleKind.ESNext
                | undefined
            }
          ).getModeForResolutionAtIndex?.(containingSourceFile, i)
        : undefined
      let { resolvedModule } = ts.resolveModuleName(
        moduleName,
        containingFile,
        options,
        host,
        moduleResolutionCache,
        redirectedReference,
        mode
      )
      if (!resolvedModule) {
        const lastDotIndex = moduleName.lastIndexOf('.')
        const ext =
          lastDotIndex >= 0 ? moduleName.slice(lastDotIndex) : ''
        if (ext) {
          const replacements = tsResolverEquivalents.get(ext)
          for (const replacementExt of replacements ?? []) {
            ;({ resolvedModule } = ts.resolveModuleName(
              moduleName.slice(0, -ext.length) + replacementExt,
              containingFile,
              options,
              host,
              moduleResolutionCache,
              redirectedReference,
              mode
            ))
            if (resolvedModule) break
          }
        }
      }
      if (resolvedModule) {
        fixupResolvedModule(resolvedModule)
      }
      return { resolvedModule }
    })
  }
  return resolveModuleNameLiterals
}

export const updateMemoryCache = (
  contents: string,
  fileName: string
) => {
  if (
    !rootFileNames.has(fileName) &&
    !isFileKnownToBeInternal(fileName)
  ) {
    markBucketOfFilenameInternal(fileName)
    rootFileNames.add(fileName)
    incProjectVersion()
  }

  const previousVersion = fileVersions.get(fileName) || 0
  const previousContents = fileContents.get(fileName)
  if (contents !== previousContents) {
    fileVersions.set(fileName, previousVersion + 1)
    fileContents.set(fileName, contents)
    incProjectVersion()
  }
}
