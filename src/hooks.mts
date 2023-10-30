import { readFileSync } from 'fs'
import type {
  GlobalPreloadHook,
  InitializeHook,
  LoadHook,
  ResolveHook,
} from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'url'
import { MessagePort } from 'worker_threads'
import { DaemonClient } from './client.js'

const typeCheck = process.env.TSIMP_TRANSPILE_ONLY !== '1'
const client = new DaemonClient()

let pretty = process.stderr.isTTY
export const globalPreload: GlobalPreloadHook = ({ port }) => {
  port.on('message', ({ stderrIsTTY }) => (pretty = stderrIsTTY))
  return `
port?.postMessage({ stderrIsTTY: !!process.stderr.isTTY })
  `
}

export const initialize: InitializeHook = ({
  port,
}: {
  port: MessagePort
}) => {
  port.on('message', ({ stderrIsTTY }) => (pretty = stderrIsTTY))
}

export const resolve: ResolveHook = async (
  url,
  context,
  nextResolve
) => {
  const { parentURL } = context
  const target = String(parentURL ? new URL(url, parentURL) : url)
  if (target.startsWith('file://') && !target.startsWith(nm)) {
    const result = await client.resolve(url, parentURL)
    return nextResolve(result, context)
  } else {
    return nextResolve(url, context)
  }
}

// ts programs have import filenames like ./x.js, but the source
// lives in ./x.ts. Find the source and compile it.
const nm = String(pathToFileURL(pathResolve('node_modules'))) + '/'
export const load: LoadHook = async (url, context, nextLoad) => {
  if (url.startsWith('file://') && !url.startsWith(nm)) {
    const { fileName, diagnostics } = await client.compile(
      fileURLToPath(url),
      typeCheck,
      pretty
    )
    if (diagnostics.length) {
      for (const d of diagnostics) console.error(d)
    }
    if (!fileName) {
      throw new Error('compile failure')
    }
    return {
      source: readFileSync(fileName, 'utf8'),
      shortCircuit: true,
      format: context.format ?? 'module',
    }
    //return nextLoad(String(pathToFileURL(fileName)), context)
  }
  return nextLoad(url, context)
}
