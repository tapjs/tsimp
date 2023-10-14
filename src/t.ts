// @ts-ignore - not in @types/node, but it is there
process?.setSourceMapsEnabled?.(true)

import { resolve } from 'path'
import ts from 'typescript'
const readResult = ts.readConfigFile(
  '.tshy/esm.json',
  ts.sys.readFile
)
console.error(readResult)
const config = ts.parseJsonConfigFileContent(
  // read the config file, data object can be mutated here to
  // apply the "tsimp" section, if provided.
  // caveat that it can only be present in the first config, not anything
  // it extends, unless we get more involved with it, probably not worthwhile.
  {
    ...readResult.config,
    compilerOptions: {
      ...readResult.config.compilerOptions,
      outDir: resolve('.tsimp-compiled'),
      inlineSourceMap: true,
      declarationMap: false,
      declaration: false,
      rootDir: process.cwd(),
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      noEmit: false,
    },
  },
  ts.sys,
  resolve('.tshy')
)

console.error(
  config,
  ts.ModuleKind.NodeNext,
  ts.ModuleResolutionKind.NodeNext
)
const configOptions = config.options

// create a compiler host
const host = ts.createCompilerHost(configOptions, true)
const compiledJS = new Map<string, string>()
host.writeFile = (fileName: string, contents: string) =>
  compiledJS.set(fileName, contents)

// this is probably going to be useful in the resolve hook?
const resolved = ts.resolveModuleName(
  './src/t.js',
  resolve('x'),
  configOptions,
  host
)
console.error(resolved)
const resolvedFileName =
  resolved.resolvedModule?.resolvedFileName || ''

console.error(host.readFile(resolvedFileName))
const program = ts.createProgram(['src/t.ts'], configOptions, host)
const sf = program.getSourceFile('src/t.ts')
console.error(program.getGlobalDiagnostics())
console.log('sourceFile', sf)
const emitResult = program.emit(sf)
console.log(emitResult, compiledJS, sf)
const tshy = ts.resolveModuleName(
  'tshy',
  resolve('src/x.ts'),
  configOptions,
  host,
  // TODO: module resolution cache
  host.getModuleResolutionCache?.(),
  undefined,
  ts.getImpliedNodeFormatForFile(
    './src/x.ts' as ts.Path,
    // TODO: package.json cache
    undefined,
    host,
    configOptions
  )
)
console.error(tshy)
