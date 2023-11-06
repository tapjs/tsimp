import Module from 'node:module'
import { dirname, parse, resolve } from 'node:path'
import { addHook } from 'pirates'
import { getDiagMode } from '../diagnostic-mode.js'
import { equivalents, tsExts } from '../equivalents.js'
import { getOutputFile } from '../get-output-file.js'
import { requireCommonJSLoad } from '../require-commonjs-load.js'
import { fileExists, readFile } from '../service/ts-sys-cached.js'
let svcLoad: typeof import('../service/load.js') | undefined =
  undefined
const diagMode = getDiagMode()

const ModuleWithLoad = Module as typeof Module & {
  _load: (request: string, parent: Module, isMain: boolean) => any
}

// We have to hijack Module._load because the module specifier does
// not match the actual filename.
const { _load: originalLoad } = ModuleWithLoad
ModuleWithLoad._load = (request, parent, isMain) => {
  if (
    parent &&
    (request.startsWith('../') || request.startsWith('./'))
  ) {
    const { ext } = parse(parent.filename)
    const pr = parse(request)
    const equiv = tsExts.has(ext) && equivalents.get(pr.ext)
    if (equiv) {
      console.error('try ts load', request, equiv)
      // in a ts file, figure out if maybe this js file should be a ts file
      for (const e of equiv) {
        const nr =
          request.substring(0, request.length - pr.ext.length) + e
        const target = resolve(dirname(parent.filename), nr)
        console.error('target', nr, target)
        if (fileExists(target)) {
          return originalLoad(nr, parent, isMain)
        }
      }
    }
  }
  return originalLoad(request, parent, isMain)
}

// Note: this incurs a *significant* per-process overhead if we need to
// do the actual compilation! Thankfully, by the time this is hit, we've
// probably already precompiled it in the resolve hook.
addHook(
  (code, fileName) => {
    if (fileName.endsWith('.js') && code) return code
    let outputFile = getOutputFile(fileName)
    console.error('arr', { fileName, outputFile })
    const tx = readFile(outputFile)
    if (tx) return tx

    // have to do the full transpile inline.
    if (!svcLoad) {
      svcLoad = requireCommonJSLoad()
    }
    const { fileName: file, diagnostics } = svcLoad.load(fileName)
    if (diagnostics.length && diagMode !== 'ignore') {
      for (const d of diagnostics) console.error(d)
      if (diagMode === 'error') process.exit(1)
    }
    return (file ? readFile(file) : code) || code
  },
  { exts: ['.ts', '.cts', '.js', '.cjs'], ignoreNodeModules: true }
)
