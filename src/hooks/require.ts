import { writeSync } from 'node:fs'
import Module from 'node:module'
import { dirname, resolve } from 'node:path'
import { format } from 'node:util'
import { addHook } from 'pirates'
import { getDiagMode } from '../diagnostic-mode.js'
import { equivalents } from '../equivalents.js'
import { getOutputFile } from '../get-output-file.js'
import { requireCommonJSLoad } from '../require-commonjs-load.js'
import { fileExists, readFile } from '../ts-sys-cached.js'

let svcLoad: typeof import('../service/load.js') | undefined =
  undefined
const diagMode = getDiagMode()

const ModuleWithLoad = Module as typeof Module & {
  _resolveFilename: (specifier: string, parent?: Module) => any
}

const { _resolveFilename: originalResolve } = ModuleWithLoad

// As of node 21, we still must patch this method, because it is
// called *prior* to the resolve hook for require(), and will fail
// if it ends up pointing to a file that doesn't exist, even though
// the load hook can load it just fine.
Object.assign(Module, {
  _resolveFilename: (request: string, parent?: Module) => {
    if (
      parent &&
      (request.startsWith('../') || request.startsWith('./'))
    ) {
      const target = resolve(dirname(parent.filename), request)
      const equiv = equivalents(target, true)
      if (equiv && !fileExists(target)) {
        for (const target of equiv) {
          if (fileExists(target)) {
            return originalResolve(target, parent)
          }
        }
      }
    }
    return originalResolve(request, parent)
  },
})

// Note: this incurs a *significant* per-process overhead if we need to
// do the actual compilation! Thankfully, by the time this is hit, we've
// probably already precompiled it in the resolve hook.
// Only add this hook if we're on a node version that cannot provide
// source in the load hook for commonjs. This functionality was added
// at the same time as --import and Module.register, so test that.
/* c8 ignore start */
if (typeof Module.register !== 'function') {
  const consoleError = (...msg: any[]) =>
    writeSync(1, format(...msg) + '\n')

  addHook(
    (code, fileName) => {
      if (fileName.endsWith('.js') && code) return code
      let outputFile = getOutputFile(fileName)
      const tx = readFile(outputFile)
      if (tx) return tx

      // have to do the full transpile inline.
      if (!svcLoad) {
        svcLoad = requireCommonJSLoad()
      }
      const { fileName: file, diagnostics } = svcLoad.load(fileName)
      if (diagnostics.length && diagMode !== 'ignore') {
        for (const d of diagnostics) consoleError(d)
        if (diagMode === 'error') process.exit(1)
      }
      return (file ? readFile(file) : code) || code
    },
    { exts: ['.ts', '.cts'], ignoreNodeModules: true },
  )
}
/* c8 ignore stop */
