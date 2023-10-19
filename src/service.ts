// Initialize the program in process.cwd, with the rootfiles
// specified in the tsconfig.
// This is slow! It is only done once per service instance.

import ts from 'typescript'
import { error, info, trace } from './debug.js'
import {
  fileContents,
  fileVersions,
  incProjectVersion,
  projectVersion,
} from './file-versions.js'
import {
  getResolveModuleNameLiterals,
  moduleResolutionCache,
} from './resolve-module-name-literals.js'
import { getResolveTypeReferenceDirectiveReferences } from './resolve-type-reference-directive-references.js'
import {
  directoryExists,
  fileExists,
  getCurrentDirectory,
  getDirectories,
  readFile,
  realpath,
} from './ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'

export const getLanguageService = () => {
  const config = tsconfig()

  // spike script using a LanguageService host to do typechecking
  const host: ts.LanguageServiceHost = {
    readFile,
    trace: config.options.tsTrace ? trace : undefined,

    directoryExists,
    realpath,
    getCurrentDirectory,
    getDirectories,
    fileExists: path => {
      if (fileVersions.has(path)) return true
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
      fileName: string
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

  host.resolveModuleNameLiterals = getResolveModuleNameLiterals(host)
  host.resolveTypeReferenceDirectiveReferences =
    getResolveTypeReferenceDirectiveReferences(
      host,
      moduleResolutionCache
    )

  Object.assign(host, {
    getModuleResolutionCache: () => moduleResolutionCache,
  })

  const registry = ts.createDocumentRegistry(
    ts.sys.useCaseSensitiveFileNames,
    getCurrentDirectory()
  )
  const service = ts.createLanguageService(host, registry)

  // take the hit up front loading reference types
  return { initialProgram: service.getProgram(), service }
}
