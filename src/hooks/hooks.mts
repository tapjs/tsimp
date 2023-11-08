import { readFileSync, writeSync } from 'fs'
import type {
  GlobalPreloadHook,
  InitializeHook,
  LoadHook,
  ResolveHook,
} from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'url'
import { format } from 'util'
import { MessagePort } from 'worker_threads'
import { classifyModule } from '../classify-module.js'
import { DaemonClient } from '../client.js'
import { getDiagMode } from '../diagnostic-mode.js'
import { readFile } from '../service/ts-sys-cached.js'

// in some cases on the loader thread, console.error doesn't actually
// print. sync write to fd 1 instead.
const consoleError = (...msg: any[]) =>
  writeSync(1, format(...msg) + '\n')

const diagMode = getDiagMode()
let client: DaemonClient
const getClient = () => client ?? (client = new DaemonClient())

let pretty = process.stderr.isTTY
export const globalPreload: GlobalPreloadHook = ({ port }) => {
  //@ts-ignore
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
  const target = parentURL ? String(new URL(url, parentURL)) : url
  return nextResolve(
    target.startsWith('file://') && !target.startsWith(nm)
      ? await getClient().resolve(url, parentURL)
      : url,
    context
  )
}

// ts programs have import filenames like ./x.js, but the source
// lives in ./x.ts. Find the source and compile it.
const nm = String(pathToFileURL(pathResolve('node_modules'))) + '/'
let hookedCJS = false
export const load: LoadHook = async (url, context, nextLoad) => {
  if (url.startsWith('file://') && !url.startsWith(nm)) {
    const inputFile = fileURLToPath(url)
    const { fileName, diagnostics } = await getClient().compile(
      inputFile,
      diagMode,
      pretty
    )
    if (diagnostics.length) {
      for (const d of diagnostics) consoleError(d)
    }
    if (!fileName) {
      throw new Error('compile failure')
    }
    const format = classifyModule(inputFile)
    hookedCJS ||= format === 'commonjs'
    return {
      source: readFileSync(fileName, 'utf8'),
      shortCircuit: true,
      format,
    }
  }

  // if we return a source for commonjs ever, we MUST return sources
  // for all commonjs resolutions thereafter.
  // See: https://github.com/nodejs/node/issues/50435
  const result = await nextLoad(url, context)
  if (hookedCJS && result.format === 'commonjs' && !result.source) {
    result.source = readFile(fileURLToPath(url))
  }
  return result
}
