// Initialize the program in process.cwd, with the rootfiles
// specified in the tsconfig.
// This is slow! It is only done once per service instance.

import ts from 'typescript'
import { error, info, trace } from '../debug.js'
import {
  directoryExists,
  fileExists,
  getCurrentDirectory,
  getDirectories,
  normalizePath,
  readFile,
  realpath,
} from '../ts-sys-cached.js'
import {
  fileContents,
  fileVersions,
  incProjectVersion,
  projectVersion,
} from './file-versions.js'
import {
  getModuleResolutionCache,
  getResolveModuleNameLiterals,
} from './resolve-module-name-literals.js'
import { getResolveTypeReferenceDirectiveReferences } from './resolve-type-reference-directive-references.js'
import { tsconfig } from './tsconfig.js'

let lastConfig: ts.ParsedCommandLine
export type LSHostWithResolveModuleNameLiterals =
  ts.LanguageServiceHost & {
    resolveModuleNameLiterals: Exclude<
      ts.LanguageServiceHost['resolveModuleNameLiterals'],
      undefined
    >
  }

export type LanguageServiceWithHost = ts.LanguageService & {
  getHost(): LSHostWithResolveModuleNameLiterals
}

let lastService: LanguageServiceWithHost

export const getLanguageService = (): LanguageServiceWithHost => {
  const config = tsconfig()
  if (lastService && config === lastConfig) {
    return lastService
  }
  lastConfig = config
  const start = performance.now()

  // spike script using a LanguageService host to do typechecking
  const host: ts.LanguageServiceHost = {
    readFile,
    trace: config.options.traceResolution ? trace : undefined,

    directoryExists,
    realpath,
    getCurrentDirectory,
    getDirectories,
    fileExists: path => {
      if (fileVersions.has(normalizePath(path))) return true
      return fileExists(path)
    },
    writeFile: ts.sys.writeFile,

    useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,

    getCompilationSettings: () => config.options,
    getNewLine: () => '\n',
    getProjectVersion: projectVersion,
    getScriptFileNames: () => [...fileVersions.keys()],
    getScriptVersion: (fileName: string) =>
      String(fileVersions.get(fileName)),
    getScriptSnapshot: (
      fileName: string,
    ): ts.IScriptSnapshot | undefined => {
      let contents = fileContents.get(fileName)

      // Read contents into TypeScript memory cache.
      if (contents === undefined) {
        contents = readFile(fileName)
        if (contents === undefined) return

        fileVersions.set(fileName, 1)
        fileContents.set(fileName, contents)
        incProjectVersion()
      }

      return ts.ScriptSnapshot.fromString(contents)
    },
    getDefaultLibFileName: opt => ts.getDefaultLibFilePath(opt),
    log: (s: string) => info(s),
    error: (s: string) => error(s),
  }

  const hostWithResModNameLit: LSHostWithResolveModuleNameLiterals =
    Object.assign(host, {
      resolveTypeReferenceDirectiveReferences:
        getResolveTypeReferenceDirectiveReferences(
          host,
          getModuleResolutionCache(),
        ),
      resolveModuleNameLiterals: getResolveModuleNameLiterals(host),
      getModuleResolutionCache,
    })

  const registry = ts.createDocumentRegistry(
    ts.sys.useCaseSensitiveFileNames,
    getCurrentDirectory(),
  )

  lastService = Object.assign(
    ts.createLanguageService(hostWithResModNameLit, registry),
    {
      getHost: () => hostWithResModNameLit,
    },
  )
  const duration =
    Math.floor((performance.now() - start) * 1000) / 1000
  info('created language service', duration)
  return lastService
}
