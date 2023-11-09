import t from 'tap'
import { MessagePort } from 'worker_threads'
import { getUrl } from '../src/get-url.js'

let registerCalled = false
const TSIMP = (await t.mockImport('../src/index.js', {
  'node:module': {
    register: (url: string, args: any) => {
      t.equal(url, getUrl('./hooks/loader.mjs'))
      t.match(args, {
        parentURL: getUrl('./index.js'),
        data: { port: MessagePort },
        transferList: [MessagePort],
      })
      registerCalled = true
    },
  },
})) as typeof import('../src/index.js')

t.equal(registerCalled, true)

t.type(TSIMP.tsimp, TSIMP.DaemonClient)
