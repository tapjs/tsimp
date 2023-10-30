// TODO
// - [ ] use pirates to hijack the commonjs loader
import { MessageChannel } from 'node:worker_threads'
import { getUrl } from './get-url.js'

import Module from 'node:module'
if (typeof Module.register === 'function') {
  const { port1, port2 } = new MessageChannel()
  port1.unref()
  port2.unref()

  Module.register(getUrl('./loader.mjs'), {
    parentURL: getUrl('./index.js'),
    data: { port: port2 },
    transferList: [port2],
  })

  port1.postMessage({ stderrIsTTY: !!process.stderr.isTTY })
}

export {}
