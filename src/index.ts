// TODO
// - [ ] use pirates to hijack the commonjs loader
// - [x] use module.register to attach the esm loader

process.on('beforeExit', () => done())

import { register } from 'node:module'
import { MessageChannel } from 'node:worker_threads'

import { getUrl } from './get-url.js'
import { Service } from './service.js'
import { start } from './timing.js'

const done = start('import script')

if (register) {
  const { port1, port2 } = new MessageChannel()
  port1.unref()
  port2.unref()
  register(getUrl('loader.mjs'), {
    parentURL: getUrl('index.js'),
    data: { port: port2 },
    transferList: [port2],
  })
  new Service().listen(port1)
}

export {}
