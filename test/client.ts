import { resolve } from 'path'
import t from 'tap'
import { fileURLToPath, pathToFileURL } from 'url'

let requests: any[] = []
class MockSDC {
  static response: any = {}
  async request(req: any) {
    const { id = 'mockid' } = req
    requests.push(req)
    return { id, ...MockSDC.response }
  }
}

const { DaemonClient } = (await t.mockImport('../src/client.js', {
  'sock-daemon': {
    SockDaemonClient: MockSDC,
  },
})) as typeof import('../src/client.js')

t.equal(DaemonClient.serviceName, 'tsimp')
t.equal(
  DaemonClient.daemonScript,
  fileURLToPath(new URL('../src/service/daemon.mjs', import.meta.url))
)

MockSDC.response = {}
const client = new DaemonClient()
t.strictSame(await client.preload(), {})
t.strictSame(requests, [{ action: 'preload' }])
requests.length = 0

MockSDC.response = { fileName: 'some-file.js' }
t.strictSame(await client.resolve('file:///x/y/z.ts'), 'some-file.js')
t.strictSame(requests, [
  {
    action: 'resolve',
    url: 'file:///x/y/z.ts',
    parentURL: undefined,
  },
])
requests.length = 0
MockSDC.response = {}
t.strictSame(
  await client.resolve('file:///x/y/z.js', 'file:///parent'),
  'file:///x/y/z.js'
)
t.strictSame(requests, [
  {
    action: 'resolve',
    url: 'file:///x/y/z.js',
    parentURL: 'file:///parent',
  },
])
requests.length = 0

process.env.TSIMP_DIAG = 'ignore'
MockSDC.response = { fileName: 'f.js', diagnostics: ['x'] }
t.strictSame(await client.compile(resolve('y.ts')), {
  fileName: 'f.js',
  diagnostics: [],
})
t.strictSame(requests, [
  {
    action: 'compile',
    fileName: String(pathToFileURL(resolve('y.ts'))),
    diagMode: 'ignore',
    pretty: !!process.stderr.isTTY,
  },
])
requests.length = 0

MockSDC.response = { fileName: 'f.js', diagnostics: ['x'] }
process.env.TSIMP_DIAG = 'warn'
t.strictSame(await client.compile(resolve('y.ts'), 'error'), {
  diagnostics: ['x'],
})
t.strictSame(requests, [
  {
    action: 'compile',
    fileName: String(pathToFileURL(resolve('y.ts'))),
    diagMode: 'error',
    pretty: !!process.stderr.isTTY,
  },
])
requests.length = 0
