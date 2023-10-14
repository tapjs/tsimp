// hooks for legacy-loader.mts and loader.mts

import {
  GlobalPreloadHook,
  LoadFnOutput,
  LoadHook,
  ResolveFnOutput,
  ResolveHook,
} from 'node:module'
import { fileURLToPath } from 'node:url'
import { MessagePort } from 'node:worker_threads'
import { Client } from './client.js'
import { info } from './debug.js'
import { start } from './timing.js'

let client: Client

export const globalPreload: GlobalPreloadHook = ({ port }) => {
  // loader thread. connect client
  client = new Client(port)
  port.unref()
  const serviceModuleCJS = JSON.stringify(
    fileURLToPath(new URL('../commonjs/service.js', import.meta.url))
  )
  const base = JSON.stringify(fileURLToPath(import.meta.url))
  return `
// main thread, start service and listen for connections
const { createRequire } = getBuiltin('module')
const require = createRequire(${base})
const { fileURLToPath } = getBuiltin('url')
const { Service } = require(${serviceModuleCJS})
new Service().listen(port)
port.unref()
`
}

export const initialize = ({ port }: { port: MessagePort }): void => {
  const done = start('hooks: initialize')
  port.unref()
  client = new Client(port)
  done()
}

export const load: LoadHook = async (url, context, nextLoad) => {
  info('LOAD', url, context)
  if (!client) {
    throw new Error(
      'initialize() or globalPreload() must be run prior to ' +
        'running the load() hook. Did you --loader when you meant ' +
        '--import or vice versa?'
    )
  }
  const done = start('hooks: load')
  const source = await client.load(url)
  info('LOAD', url, {
    format: 'module',
    source: `${source}`,
    shortCircuit: true,
  })
  const result = source
    ? ({
        format: 'module',
        source: `${source}`,
        shortCircuit: true,
      } as LoadFnOutput)
    : nextLoad(url, context)
  done()
  return result
}

export const resolve: ResolveHook = async (
  url,
  context,
  nextResolve
) => {
  const done = start('hooks: resolve')
  info('RESOLVE', url, context)
  if (!client) {
    throw new Error(
      'initialize() or globalPreload() must be run prior to ' +
        'running the resolve() hook. Did you --loader when you meant ' +
        '--import or vice versa?'
    )
  }
  const { response } =
    (await client.resolve(url, context.parentURL)) ?? {}
  info('RESOLVE', { response })
  const result =
    response && response.startsWith('file://')
      ? ({
          url: response,
          format: 'module',
          shortCircuit: true,
        } as ResolveFnOutput)
      : nextResolve(response || url, context)
  done()
  return result
}
