import t from 'tap'
import { fileURLToPath } from 'url'
import { MessagePort } from 'worker_threads'
import { getUrl } from '../../dist/esm/get-url.js'

let registerCalled = false
await t.mockImport('../../dist/esm/hooks/import.mjs', {
  '../../dist/esm/hooks/require.js': {},
  'node:module': {
    register: (url: string, options: any) => {
      registerCalled = true
      t.equal(url, getUrl('./hooks/loader.mjs'))
      t.equal(
        fileURLToPath(options.parentURL).toLowerCase(),
        fileURLToPath(
          new URL('../../dist/esm/hooks/import.mjs', import.meta.url),
        ).toLowerCase(),
      )
      const { port } = options.data
      t.type(port, MessagePort)
      t.strictSame(options.transferList, [port])
      ;(port as MessagePort).on('message', msg => {
        t.strictSame(msg, { stderrIsTTY: !!process.stderr.isTTY })
      })
      port.unref()
    },
  },
})

t.equal(registerCalled, true)
