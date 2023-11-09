import { register } from 'node:module'
import { MessageChannel } from 'node:worker_threads'
import { getUrl } from '../get-url.js'
import './require.js'

//@ts-ignore
process.setSourceMapsEnabled(true)

const { port1, port2 } = new MessageChannel()

register(getUrl('./hooks/loader.mjs'), {
  parentURL: import.meta.url,
  data: { port: port2 },
  transferList: [port2],
})

port1.unref()
port2.unref()

port1.postMessage({ stderrIsTTY: !!process.stderr.isTTY })
