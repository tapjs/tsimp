import { writeSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import type {
  GlobalPreloadHook,
  InitializeHook,
  LoadHook,
  ResolveHook,
} from 'node:module'
import { resolve as pathResolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { format } from 'node:util'
import { MessagePort } from 'node:worker_threads'
import { classifyModule } from '../classify-module.js'
import { DaemonClient } from '../client.js'
import { getDiagMode } from '../diagnostic-mode.js'
import getPackageJSON from '../service/get-package-json.js'
import { relative } from 'path'

// in some cases on the loader thread, console.error doesn't actually
// print. sync write to fd 1 instead.
const consoleError = (...msg: any[]) =>
  writeSync(1, format(...msg) + '\n')

const diagMode = getDiagMode()
let client: DaemonClient
const getClient = () => client ?? (client = new DaemonClient())

let pretty = !!process.stderr.isTTY
export const getPretty = () => !!pretty
export const globalPreload: GlobalPreloadHook = ({ port }) => {
  const base = String(new URL(import.meta.url))
  port.on('message', ({ stderrIsTTY }) => (pretty = stderrIsTTY))
  port.unref()
  return `
process.setSourceMapsEnabled(true)
const { createRequire } = getBuiltin('module')
const { fileURLToPath } = getBuiltin('url')
const require = createRequire(${JSON.stringify(base)})
require('../../commonjs/hooks/require.js')
port?.postMessage({ stderrIsTTY: !!process.stderr.isTTY })
port?.unref()
  `
}

export const initialize: InitializeHook = ({
  port,
}: {
  port: MessagePort
}) => {
  port.on('message', ({ stderrIsTTY }) => (pretty = stderrIsTTY))
  port.unref()
}

export const resolve: ResolveHook = async (
  url,
  context,
  nextResolve
) => {
  const { parentURL } = context

  if (url.startsWith('#')) {
    const { contents, pathToJSON } = getPackageJSON(process.cwd())!
    if (pathToJSON && contents) {
      const { imports } = contents as {
        imports: Record<string, string>
      }
      if (imports) {
        for (let [importSubpath, relativeSubpath] of Object.entries(
          imports
        )) {
          if (
            !importSubpath.startsWith('#') ||
            !importSubpath.endsWith('/*') ||
            !relativeSubpath.endsWith('/*')
          )
            continue
          importSubpath = relative(dirname(importSubpath), url)
          if (importSubpath.includes('#')) continue

          url = pathResolve(
            dirname(pathToJSON),
            dirname(relativeSubpath),
            importSubpath
          )
          break
        }
      }
    }
  }

  let target =
    /* c8 ignore start */
    parentURL && (url.startsWith('./') || url.startsWith('../'))
      ? /* c8 ignore stop */
        String(new URL(url, parentURL))
      : url

  return nextResolve(
    target.startsWith('file://') && !startsWithCS(target, nm)
      ? await getClient().resolve(url, parentURL)
      : url,
    context
  )
}

// case (in-)sensitive String.startsWith
const cs =
  process.platform !== 'win32' && process.platform !== 'darwin'
/* c8 ignore start */
const startsWithCS = cs
  ? (haystack: string, needle: string) => haystack.startsWith(needle)
  : (haystack: string, needle: string) =>
      haystack.toUpperCase().startsWith(needle.toUpperCase())
/* c8 ignore stop */

// ts programs have import filenames like ./x.js, but the source
// lives in ./x.ts. Find the source and compile it.
const nm = String(pathToFileURL(pathResolve('node_modules'))) + '/'
const proj = String(pathToFileURL(process.cwd())) + '/'
let hookedCJS = false
export const load: LoadHook = async (url, context, nextLoad) => {
  if (startsWithCS(url, proj) && !startsWithCS(url, nm)) {
    const inputFile = fileURLToPath(url)
    const { fileName, diagnostics } = await getClient().compile(
      inputFile,
      diagMode,
      pretty
    )
    for (const d of diagnostics) consoleError(d)
    if (!fileName) {
      throw Object.assign(new Error('compile failure'), {
        code: 'E_TSIMP_COMPILE_FAILURE',
        url,
        context,
      })
    }
    const format = classifyModule(inputFile)
    hookedCJS ||= format === 'commonjs'
    return {
      source: await readFile(fileName, 'utf8'),
      shortCircuit: true,
      format,
    }
  }

  // if we return a source for commonjs ever, we MUST return sources
  // for all commonjs resolutions thereafter.
  // See: https://github.com/nodejs/node/issues/50435
  const result = await nextLoad(url, context)
  if (hookedCJS && result.format === 'commonjs' && !result.source) {
    result.source = await readFile(fileURLToPath(url), 'utf8')
  }
  return result
}
