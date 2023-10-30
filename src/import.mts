import { register } from 'node:module'
import { MessageChannel } from 'node:worker_threads'

import { getUrl } from './get-url.js'

const { port1, port2 } = new MessageChannel()
port1.unref()
port2.unref()

register(getUrl('./loader.mjs'), {
  parentURL: import.meta.url,
  data: { port: port2 },
  transferList: [port2],
})

port1.postMessage({ stderrIsTTY: !!process.stderr.isTTY })
