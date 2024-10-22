import ts from 'typescript'
import { equivalents } from '../equivalents.js'
import { getCurrentDirectory } from '../ts-sys-cached.js'
import { addRootFile } from './file-versions.js'
import { getCanonicalFileName } from './get-canonical-filename.js'
import { tsconfig } from './tsconfig.js'

// reset cache on config change
let mrc: ts.ModuleResolutionCache | undefined = undefined
let config: ts.ParsedCommandLine | undefined = undefined
export const getModuleResolutionCache = () => {
  const newConf = tsconfig()
  if (newConf !== config) {
    mrc = undefined
    config = newConf
  }
  return (
    mrc ??
    (mrc = ts.createModuleResolutionCache(
      getCurrentDirectory(),
      getCanonicalFileName,
      tsconfig().options,
      undefined,
    ))
  )
}

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
const isFileInInternalBucket = (filename: string) =>
  internalBuckets.has(getModuleBucket(filename))
const isFileKnownToBeInternal = (filename: string) =>
  knownInternalFilenames.has(filename)

const fixupResolvedModule = (
  resolvedModule:
    | ts.ResolvedModule
    | ts.ResolvedTypeReferenceDirective,
) => {
  const { resolvedFileName } = resolvedModule
  /* c8 ignore next */
  if (resolvedFileName === undefined) return
  // [MUST_UPDATE_FOR_NEW_FILE_EXTENSIONS]
  // .ts,.mts,.cts is always switched to internal
  // .js is switched on-demand
  /* c8 ignore start */
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
  /* c8 ignore stop */
  if (!resolvedModule.isExternalLibraryImport) {
    knownInternalFilenames.add(resolvedFileName)
  }
}

export const getResolveModuleNameLiterals = (
  host: ts.LanguageServiceHost,
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
    reusedNames: readonly ts.StringLiteralLike[] | undefined,
  ) => readonly ts.ResolvedModuleWithFailedLookupLocations[] = (
    moduleLiterals,
    containingFile,
    redirectedReference,
    options,
    containingSourceFile,
    _reusedNames,
  ) => {
    return moduleLiterals.map((moduleLiteral, i) => {
      const moduleName = moduleLiteral.text
      const mode =
        containingSourceFile ?
          (
            ts as any as {
              getModeForResolutionAtIndex?(
                containingSourceFile: ts.SourceFile,
                index: number,
              ):
                | ts.ModuleKind.CommonJS
                | ts.ModuleKind.ESNext
                | undefined
            }
          ).getModeForResolutionAtIndex?.(containingSourceFile, i)
        : /* c8 ignore start */ undefined
      /* c8 ignore stop */
      let { resolvedModule } = ts.resolveModuleName(
        moduleName,
        containingFile,
        options,
        host,
        getModuleResolutionCache(),
        redirectedReference,
        mode,
      )
      if (!resolvedModule) {
        const lastDotIndex = moduleName.lastIndexOf('.')
        const ext =
          lastDotIndex >= 0 ? moduleName.slice(lastDotIndex) : ''
        if (ext) {
          const replacements = equivalents(
            moduleName,
            mode !== ts.ModuleKind.ESNext,
          )
          for (const rep of replacements) {
            ;({ resolvedModule } = ts.resolveModuleName(
              rep,
              containingFile,
              options,
              host,
              getModuleResolutionCache(),
              redirectedReference,
              mode,
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

export const markFileNameInternal = (fileName: string) => {
  if (!isFileKnownToBeInternal(fileName)) {
    markBucketOfFilenameInternal(fileName)
  }
  addRootFile(fileName)
}
