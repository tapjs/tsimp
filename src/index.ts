import Module from 'node:module'
import { MessageChannel } from 'node:worker_threads'
import { DaemonClient } from './client.js'
import { getUrl } from './get-url.js'
import './hooks/require.js'

//@ts-ignore
process.setSourceMapsEnabled(true)

if (typeof Module.register === 'function') {
  const { port1, port2 } = new MessageChannel()
  port1.unref()
  port2.unref()

  Module.register(getUrl('./hooks/loader.mjs'), {
    parentURL: getUrl('./index.js'),
    data: { port: port2 },
    transferList: [port2],
  })

  port1.postMessage({ stderrIsTTY: !!process.stderr.isTTY })
}

export * from './client.js'

// the imp is a client of the daemon
export const tsimp = new DaemonClient()
