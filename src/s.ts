// @ts-ignore - not in @types/node, but it is there
// process?.setSourceMapsEnabled?.(true)

import { readFileSync, realpathSync, writeFileSync } from 'fs'
import { relative, resolve } from 'path'
import { enable, perfalize, perfalizeFn } from 'perfalize'
import ts from 'typescript'
import { deserialize, serialize } from 'v8'
import { error, info, trace, warn } from './debug.js'
import { report } from './service/diagnostic.js'
import { tsconfig } from './service/tsconfig.js'

if (process.env.TSIMP_PROFILE === '1') enable({ minimum: 0 })
const cwd = process.cwd()
const config = tsconfig()

const rootFileNames = new Set(config.fileNames)

let projectVersion = 0
const fileVersions = new Map<string, number>(
  [...rootFileNames].map(fileName => [fileName, 0])
)

const fileNameLowerCaseRegExp =
  /[^\u0130\u0131\u00DFa-z0-9\\/:\-_. ]+/g
// used by moduleResolver stuff
const getCanonicalFileName = ts.sys.useCaseSensitiveFileNames
  ? (x: string) =>
      x.replace(fileNameLowerCaseRegExp, s => s.toLowerCase())
  : (x: string) => x

let pjInfoCache:
  | (ts.PackageJsonInfoCache & {
      getInternalMap: () => Map<string, any>
      setPackageJsonInfo: (packageJsonPath: string, info: any) => void
      getPackageJsonInfo: (packageJsonPath: string) => any
      entries: () => [string, any][]
    })
  | undefined = undefined
// try {
//   const d = perfalize('read serialized module resolution cache')
//   mkdirpSync('node_modules/.cache/tsimp')
//   let cache = deserialize(
//     readFileSync('node_modules/.cache/tsimp/module-resolution-cache')
//   )
//   if (cache) {
//     pjInfoCache = {
//       clear: () => {
//         cache = new Map<string, any>()
//       },
//       getInternalMap: () => cache,
//       getPackageJsonInfo(packageJsonPath: string) {
//         return cache.get(
//           getCanonicalFileName(resolve(cwd, packageJsonPath))
//         )
//       },
//       setPackageJsonInfo(packageJsonPath: string, info: any) {
//         cache.set(
//           getCanonicalFileName(resolve(cwd, packageJsonPath)),
//           info
//         )
//       },
//       entries() {
//         return [...cache.entries()]
//       },
//     }
//   }
//   d()
// } catch {}

const moduleResolutionCache = ts.createModuleResolutionCache(
  cwd,
  getCanonicalFileName,
  config.options,
  pjInfoCache
)

const typeReferenceDirectiveResolutionCache =
  ts.createTypeReferenceDirectiveResolutionCache(
    cwd,
    getCanonicalFileName,
    config.options,
    moduleResolutionCache.getPackageJsonInfoCache()
  )

export function createModeAwareCacheKey(
  specifier: string,
  mode: ts.ResolutionMode
) {
  return mode === undefined ? specifier : `${mode}|${specifier}`
}

let resolveTypeReferenceDirectiveReferencesInternalCache: Map<
  string,
  ts.ResolvedTypeReferenceDirectiveWithFailedLookupLocations
>
try {
  resolveTypeReferenceDirectiveReferencesInternalCache = deserialize(
    readFileSync(
      'node_modules/.cache/tsimp/resolve-type-reference-directives'
    )
  )
} catch {
  resolveTypeReferenceDirectiveReferencesInternalCache = new Map()
}

// ^^^ this is the thing to cache to disk

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

console.error(
  'typeReferenceDirectiveResolutionCache',
  typeReferenceDirectiveResolutionCache
)

console.error(
  'MRC.resolveTypeReferenceDirectiveReferences',
  //@ts-ignore
  moduleResolutionCache.resolveTypeReferenceDirectiveReferences
)

function cached<R>(fn: () => R): () => R
function cached<A, R>(fn: (arg: A) => R): (arg: A) => R
function cached<A, R>(fn: (arg?: A) => R): (arg?: A) => R {
  let cache: Map<A | undefined, R>
  return (arg?: A) => {
    const has = cache?.has(arg)
    if (has) {
      return cache.get(arg) as R
    }
    if (has === undefined) {
      cache = new Map()
    }
    const r = fn(arg)
    cache.set(arg, r)
    return r
  }
}

const fileContents = new Map<string, string>()
const readFile = perfalizeFn('readFile', cached(ts.sys.readFile))
const directoryExists = perfalizeFn(
  'directoryExists',
  cached(ts.sys.directoryExists)
)
const realpath = perfalizeFn(
  'realpath',
  cached(ts.sys.realpath ?? ((path: string) => realpathSync(path)))
)
const getCurrentDirectory = perfalizeFn(
  'getCurrentDirectory',
  cached(ts.sys.getCurrentDirectory)
)
const getDirectories = perfalizeFn(
  'getDirectories',
  cached(ts.sys.getDirectories)
)
const fileExists = perfalizeFn(
  'fileExists',
  cached(ts.sys.fileExists)
)

// spike script using a LanguageService host to do typechecking
const host: ts.LanguageServiceHost = {
  // ModuleResolutionHost
  // readFile function is used to read arbitrary text files on disk, i.e. when resolution procedure needs the content of 'package.json'
  // to determine location of bundled typings for node module
  readFile,
  trace: config.options.tsTrace ? trace : undefined,

  directoryExists,
  realpath,
  getCurrentDirectory,
  getDirectories,
  fileExists: perfalizeFn('fileExists check versions obj', path => {
    if (fileVersions.has(path)) return true
    return fileExists(path)
  }),
  writeFile: perfalizeFn('writeFile', ts.sys.writeFile),

  useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,

  getCompilationSettings: () => config.options,
  getNewLine: () => '\n',
  getProjectVersion: () => String(projectVersion),
  getScriptFileNames: () => [...fileVersions.keys()],
  getScriptVersion: (fileName: string) =>
    String(fileVersions.get(fileName)),
  getScriptSnapshot: perfalizeFn(
    'getScriptSnapshot',
    (fileName: string): ts.IScriptSnapshot | undefined => {
      let contents = fileContents.get(fileName)

      // Read contents into TypeScript memory cache.
      if (contents === undefined) {
        contents = readFile(fileName)
        if (contents === undefined) return

        fileVersions.set(fileName, 1)
        fileContents.set(fileName, contents)
        projectVersion++
      }

      return ts.ScriptSnapshot.fromString(contents)
    }
  ),
  getDefaultLibFileName: perfalizeFn('getDefaultLibFileName', opt =>
    ts.getDefaultLibFilePath(opt)
  ),
  log: (s: string) => info(s),
  error: (s: string) => error(s),
}

const knownInternalFilenames = new Set<string>()
const internalBuckets = new Set<string>()
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
  console.error('resoleModuleNameLiterals', {
    moduleLiterals,
    containingFile,
    redirectedReference,
    options,
    containingSourceFile,
    _reusedNames,
  })
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
    const d = perfalize('resolveModuleName')
    let { resolvedModule } = ts.resolveModuleName(
      moduleName,
      containingFile,
      config.options,
      host,
      moduleResolutionCache,
      redirectedReference,
      mode
    )
    console.error('resolvedModule', moduleName, resolvedModule)
    d()
    if (!resolvedModule && options.experimentalTsImportSpecifiers) {
      const lastDotIndex = moduleName.lastIndexOf('.')
      const ext =
        lastDotIndex >= 0 ? moduleName.slice(lastDotIndex) : ''
      if (ext) {
        const replacements = tsResolverEquivalents.get(ext)
        for (const replacementExt of replacements ?? []) {
          const d = perfalize('resolveModuleName')
          ;({ resolvedModule } = ts.resolveModuleName(
            moduleName.slice(0, -ext.length) + replacementExt,
            containingFile,
            config.options,
            host,
            moduleResolutionCache,
            redirectedReference,
            mode
          ))
          d()
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

const updateMemoryCache = (contents: string, fileName: string) => {
  if (
    !rootFileNames.has(fileName) &&
    !isFileKnownToBeInternal(fileName)
  ) {
    markBucketOfFilenameInternal(fileName)
    rootFileNames.add(fileName)
    projectVersion++
  }

  const previousVersion = fileVersions.get(fileName) || 0
  const previousContents = fileContents.get(fileName)
  if (contents !== previousContents) {
    fileVersions.set(fileName, previousVersion + 1)
    fileContents.set(fileName, contents)
    projectVersion++
  }
}

const registry = ts.createDocumentRegistry(
  ts.sys.useCaseSensitiveFileNames,
  cwd
)
const tsResolverEquivalents = new Map<string, readonly string[]>([
  ['.ts', ['.js']],
  ['.tsx', ['.js', '.jsx']],
  ['.mts', ['.mjs']],
  ['.cts', ['.cjs']],
])

host.resolveModuleNameLiterals = perfalizeFn(
  'resolveModuleNameLiterals',
  resolveModuleNameLiterals
)

host.resolveTypeReferenceDirectiveReferences = perfalizeFn(
  'resolveTypeReferenceDirectiveReferences',
  resolveTypeReferenceDirectiveReferences
)

const getResolvedModuleWithFailedLookupLocationsFromCache: ts.LanguageServiceHost['getResolvedModuleWithFailedLookupLocationsFromCache'] =
  (
    moduleName,
    containingFile,
    resolutionMode?: ts.ModuleKind.CommonJS | ts.ModuleKind.ESNext
  ): ts.ResolvedModuleWithFailedLookupLocations | undefined => {
    const ret = ts.resolveModuleNameFromCache(
      moduleName,
      containingFile,
      moduleResolutionCache,
      resolutionMode
    )
    if (ret && ret.resolvedModule) {
      fixupResolvedModule(ret.resolvedModule)
    }
    return ret
  }
host.getResolvedModuleWithFailedLookupLocationsFromCache =
  perfalizeFn(
    'getResolvedModuleWithFailedLookupLocationsFromCache',
    getResolvedModuleWithFailedLookupLocationsFromCache
  )
//@ts-ignore
host.getModuleResolutionCache = () => moduleResolutionCache

const service = ts.createLanguageService(host, registry)

const ppDone = perfalize('get initial empty previousProgram')
let previousProgram: ts.Program | undefined = service.getProgram()
ppDone()

const typeRefDirectives: any[] = []
previousProgram
  //@ts-ignore
  ?.getResolvedTypeReferenceDirectives()
  //@ts-ignore
  .forEach((d, k, m) => typeRefDirectives.push([k, d, m]))
console.error(typeRefDirectives)

const internalMap: Map<string, any> =
  //@ts-ignore
  moduleResolutionCache.getInternalMap()

const getOutput = (
  code: string,
  fileName: string
): string | undefined => {
  const memCacheDone = perfalize('updateMemoryCache')
  updateMemoryCache(code, fileName)
  memCacheDone()

  const progBeforeDone = perfalize('get program before')
  console.error('CALL GP')
  const programBefore = service.getProgram()
  if (previousProgram && programBefore !== previousProgram) {
    info('compiler rebuilt Program', fileName)
  }
  progBeforeDone()
  const outputDone = perfalize('getEmitOutput')
  const output = service.getEmitOutput(fileName)
  outputDone()

  const diagDone = perfalize('get diagnostics')
  const diagnostics = service
    .getSemanticDiagnostics(fileName)
    .concat(service.getSyntacticDiagnostics(fileName))
  diagDone()

  const progAfterDone = perfalize('get program after')
  console.error('CALL GP AGAIN')
  const programAfter = service.getProgram()
  if (programBefore !== programAfter) {
    // TODO: is this because we're not doing our own moduleResolution
    // stuff, but if we update the program version and internal files
    // and such, then it won't have to make a new Program?
    warn(`service.program changed while compiling ${fileName}`)
  }
  progAfterDone()

  previousProgram = programAfter

  if (diagnostics.length) diagnostics.forEach(d => report(d))

  if (output.emitSkipped) {
    return undefined
  }

  // Throw an error when requiring `.d.ts` files.
  if (output.outputFiles.length === 0) {
    throw new TypeError(
      `Unable to require file: ${relative(cwd, fileName)}\n` +
        'This is usually the result of a faulty configuration or import. ' +
        'Make sure there is a `.js`, `.json` or other executable ' +
        'extension with loader attached before `tsimp` available.'
    )
  }

  return output.outputFiles[0]?.text
}

const done = perfalize('getOutput')

console.error(
  getOutput(
    `
type Foo = { bar: 1 }
console.log({ bar: '1' } as Foo)
;(process as NodeJS.Process & { blahDeeBloo?: boolean }).blahDeeBloo = true
//export type M = Map<string, any>
`,
    resolve('./some-file.ts')
  )
)
done()

//@ts-ignore
//console.error('internalMap', internalMap)
try {
  const d = perfalize('write serialized module res cache')
  writeFileSync(
    'node_modules/.cache/tsimp/module-resolution-cache',
    serialize(internalMap)
  )
  d()
} catch (er) {
  console.error(
    'could not write moduleResolutionCache internal map',
    er
  )
}

try {
  writeFileSync(
    'node_modules/.cache/tsimp/resolve-type-reference-directives',
    serialize(resolveTypeReferenceDirectiveReferencesInternalCache)
  )
} catch {}

//@ts-ignore
//console.error(moduleResolutionCache.entries())
//console.error([...fileContents.keys()])
