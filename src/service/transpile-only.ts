// get output functions to transpile TS code without typechecking
// Note: this is only used when forcing a given compilation target
// if the emit was skipped, or when diagnostics are suppressed with
// TSIMP_DIAG=ignore, so we don't even bother collecting diagnostics.
import { catcher } from '@isaacs/catcher'
import { dirname, relative } from 'path'
import ts from 'typescript'
import { walkUp } from 'walk-up-path'
import { normalizePath, readFile } from '../ts-sys-cached.js'
import { tsconfig } from './tsconfig.js'
import getPackageJSON from './get-package-json.js'

// Basic technique lifted from ts-node's transpileOnly method.
// Create a CompilerHost, and mock the loading of package.json
// in order to tell it to use the appropriate module type.

export type NodeModuleEmitKind = 'nodeesm' | 'nodecjs'

const createTranspileOnlyGetOutputFunction = (
  nodeModuleEmitKind?: NodeModuleEmitKind
): ((
  code: string,
  fileName: string
) => {
  outputText: string | undefined
  diagnostics: ts.Diagnostic[]
}) => {
  const config = tsconfig()
  // note: module and moduleResolution are always NodeNext
  const compilerOptions = { ...config.options }

  const tsTranspileModule = createTsTranspileModule({
    compilerOptions,
  })

  return (code: string, fileName: string) => {
    const { outputText } = tsTranspileModule(
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

    return { outputText, diagnostics: [] }
  }
}

const optionsRedundantWithVerbatimModuleSyntax = new Set([
  'isolatedModules',
  'preserveValueImports',
  'importsNotUsedAsValues',
])

const createTsTranspileModule = ({
  compilerOptions: options = tsconfig().options,
}: Pick<ts.TranspileOptions, 'compilerOptions'>) => {
  // Pick up the default set of transpile-only settings from tsc
  // Omit any redunddant with verbatimModuleSyntax, if set.
  //@ts-ignore - type not exported, but it's there.
  for (const option of ts.transpileOptionValueCompilerOptions) {
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
        : /* c8 ignore start */
          undefined,
    /* c8 ignore stop */
    // we only write exactly one file, the output text
    writeFile: (_, text) => {
      outputText = text
    },
    getDefaultLibFileName: () => 'lib.d.ts',
    useCaseSensitiveFileNames: () => true,
    getCanonicalFileName: fileName => fileName,
    getCurrentDirectory: () => '',
    /* c8 ignore next */
    getNewLine: () => newLine,
    fileExists: (fileName): boolean =>
      relative(fileName, inputFileName) === '' ||
      relative(fileName, packageJsonFileName) === '',
    readFile: fileName =>
      relative(fileName, packageJsonFileName) === ''
        ? `{"type": "${packageJsonType}"}`
        : /* c8 ignore start */
          '',
    /* c8 ignore stop */
    directoryExists: () => true,
    getDirectories: () => [],
  }

  const transpileModule = (
    input: string,
    transpileOptions2: ts.TranspileOptions,
    pjType?: 'module' | 'commonjs'
  ): {
    outputText: string | undefined
    diagnostics: ts.Diagnostic[]
  } => {
    // if jsx is specified then treat file as .tsx
    inputFileName = transpileOptions2.fileName as string
    const dir = dirname(inputFileName)
    packageJsonFileName = dir + '/package.json'
    if (pjType) packageJsonType = pjType
    else {
      const pj = getPackageJSON(dir)?.contents as {
        type?: 'commonjs' | 'module'
      }
      if (pj?.type) {
        packageJsonType = pj.type
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

    // Output
    outputText = undefined

    const program = ts.createProgram(
      [inputFileName],
      options,
      compilerHost
    )

    // Emit
    program.emit()

    // unpossible
    /* c8 ignore start */
    if (outputText === undefined) {
      throw new Error('Output generation failed')
    }
    /* c8 ignore stop */

    return { outputText, diagnostics: [] }
  }

  return transpileModule
}

export const getOutputForceCommonJS =
  createTranspileOnlyGetOutputFunction('nodecjs')

export const getOutputForceESM =
  createTranspileOnlyGetOutputFunction('nodeesm')

export const getOutputTranspileOnly =
  createTranspileOnlyGetOutputFunction()
