// get output functions to transpile TS code without typechecking
import { dirname } from 'path'
import ts from 'typescript'
import { walkUp } from 'walk-up-path'
import { report } from './diagnostic.js'
import { normalizePath, readFile } from '../ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'

// The technique here is lifted from ts-node's transpileOnly method
// We create a CompilerHost, and mock the loading of package.json
// in order to tell it to use the appropriate module type.

const config = tsconfig()

export type NodeModuleEmitKind = 'nodeesm' | 'nodecjs'

const createTranspileOnlyGetOutputFunction = (
  overrideModuleType?: ts.ModuleKind,
  nodeModuleEmitKind?: NodeModuleEmitKind
): ((
  code: string,
  fileName: string
) => {
  outputText: string | undefined
  diagnostics: ts.Diagnostic[]
}) => {
  const compilerOptions = { ...config.options }
  if (overrideModuleType !== undefined)
    compilerOptions.module = overrideModuleType

  const tsTranspileModule = createTsTranspileModule({
    compilerOptions,
    reportDiagnostics: true,
  })

  return (code: string, fileName: string) => {
    let result: ts.TranspileOutput
    result = tsTranspileModule(
      code,
      {
        fileName,
      },
      nodeModuleEmitKind === 'nodeesm'
        ? 'module'
        : nodeModuleEmitKind === 'nodecjs'
        ? 'commonjs'
        : undefined
    )

    if (result.diagnostics?.length)
      result.diagnostics.forEach(d => report(d))

    const { outputText, diagnostics = [] } = result

    return { outputText, diagnostics }
  }
}

const optionsRedundantWithVerbatimModuleSyntax = new Set([
  'isolatedModules',
  'preserveValueImports',
  'importsNotUsedAsValues',
])

const createTsTranspileModule = ({
  compilerOptions: options = tsconfig().options,
  reportDiagnostics = true,
}: Pick<
  ts.TranspileOptions,
  'compilerOptions' | 'reportDiagnostics'
>) => {
  const compilerOptionsDiagnostics: ts.Diagnostic[] = []

  //@ts-ignore - type not exported, but it's there.
  for (const option of ts.transpileOptionValueCompilerOptions) {
    // Do not set redundant config options if `verbatimModuleSyntax` was supplied.
    if (
      options.verbatimModuleSyntax &&
      optionsRedundantWithVerbatimModuleSyntax.has(option.name)
    ) {
      continue
    }

    options[option.name] = option.transpileOptionValue
  }

  // transpileModule does not write anything to disk so there is no need to
  // verify that there are no conflicts between input and output paths.
  options.suppressOutputPathCheck = true

  // Filename can be non-ts file.
  options.allowNonTsExtensions = true

  const newLine = (ts as any).getNewLineCharacter(options) as string

  let inputFileName: string
  let packageJsonFileName: string
  let packageJsonType: 'module' | 'commonjs'
  let sourceFile: ts.SourceFile
  let outputText: string | undefined

  // Create a compilerHost object to allow the compiler to read and write files
  const compilerHost: ts.CompilerHost = {
    getSourceFile: fileName =>
      fileName === normalizePath(inputFileName)
        ? sourceFile
        : undefined,
    // we only write exactly one file, the output text
    writeFile: (_, text) => {
      outputText = text
    },
    getDefaultLibFileName: () => 'lib.d.ts',
    useCaseSensitiveFileNames: () => true,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => '',
    getNewLine: () => newLine,
    fileExists: (fileName): boolean =>
      fileName === inputFileName || fileName === packageJsonFileName,
    readFile: fileName =>
      fileName === packageJsonFileName
        ? `{"type": "${packageJsonType}"}`
        : '',
    directoryExists: () => true,
    getDirectories: () => [],
  }

  const transpileModule = (
    input: string,
    transpileOptions2: ts.TranspileOptions,
    pjType?: 'module' | 'commonjs'
  ): ts.TranspileOutput => {
    // if jsx is specified then treat file as .tsx
    inputFileName =
      transpileOptions2.fileName ||
      (options && options.jsx ? 'module.tsx' : 'module.ts')
    const dir = dirname(inputFileName)
    packageJsonFileName = dir + '/package.json'
    if (pjType) packageJsonType = pjType
    else {
      for (const d of walkUp(dir)) {
        try {
          const json = readFile(d + '/package.json')
          if (!json) continue
          const { type: pjType = 'commonjs' } = JSON.parse(json)
          packageJsonType = pjType
          break
        } catch {}
      }
    }

    sourceFile = ts.createSourceFile(inputFileName, input, {
      languageVersion: (ts as any).getEmitScriptTarget(options),
      impliedNodeFormat: ts.getImpliedNodeFormatForFile(
        (ts as any).toPath(
          inputFileName,
          '',
          compilerHost.getCanonicalFileName
        ),
        /*cache*/ undefined,
        compilerHost,
        options
      ),
      setExternalModuleIndicator: (
        ts as any
      ).getSetExternalModuleIndicator(options),
    })

    if (transpileOptions2.moduleName) {
      sourceFile.moduleName = transpileOptions2.moduleName
    }

    if (transpileOptions2.renamedDependencies) {
      ;(sourceFile as any).renamedDependencies = new Map(
        Object.entries(transpileOptions2.renamedDependencies)
      )
    }

    // Output
    outputText = undefined

    const program = ts.createProgram(
      [inputFileName],
      options,
      compilerHost
    )

    const diagnostics = compilerOptionsDiagnostics.slice()

    if (reportDiagnostics) {
      ;(ts as any).addRange(
        /*to*/ diagnostics,
        /*from*/ program.getSyntacticDiagnostics(sourceFile)
      )
      ;(ts as any).addRange(
        /*to*/ diagnostics,
        /*from*/ program.getOptionsDiagnostics()
      )
    }

    // Emit
    program.emit()

    if (outputText === undefined) {
      throw new Error('Output generation failed')
    }

    return { outputText, diagnostics }
  }

  return transpileModule
}

export const getOutputForceCommonJS =
  createTranspileOnlyGetOutputFunction(
    ts.ModuleKind.NodeNext,
    'nodecjs'
  )

export const getOutputForceESM = createTranspileOnlyGetOutputFunction(
  ts.ModuleKind.NodeNext,
  'nodeesm'
)

export const getOutputTranspileOnly =
  createTranspileOnlyGetOutputFunction()
