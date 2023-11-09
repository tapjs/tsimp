import t from 'tap'
let listenCalled = false
class MockDaemonServer {
  listen() {
    listenCalled = true
  }
}

await t.mockImport('../../dist/esm/service/daemon.mjs', {
  '../../dist/esm/service/service.js': {
    DaemonServer: MockDaemonServer,
  },
})

t.equal(listenCalled, true)
