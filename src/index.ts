// TODO
// - [ ] use pirates to hijack the commonjs loader
import { MessageChannel } from 'node:worker_threads'
import { getUrl } from './get-url.js'

// Exports the client on main
export * from './client.js'

import Module from 'node:module'
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
