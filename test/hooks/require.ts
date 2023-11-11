import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import t from 'tap'

const MockModule = {
  _resolveFilename: (request: string, parent: any) => {
    return ['original', request, parent]
  },
}
Object.assign(MockModule, { default: MockModule })

t.test('resolve a ts module for require()', async t => {
  await t.mockImport('../../src/hooks/require.js', {
    module: MockModule,
  })

  const parent = { filename: fileURLToPath(import.meta.url) }
  const h = MockModule._resolveFilename('./require.js', parent)
  t.equal(h[0], 'original')
  t.equal(basename(h[1]), 'require.ts')
  t.equal(h[2], parent)

  const j = MockModule._resolveFilename('./require', parent)
  t.equal(j[0], 'original')
  t.equal(basename(j[1]), 'require.ts')
  t.equal(j[2], parent)

  const i = MockModule._resolveFilename('./not-found.ts', parent)
  t.equal(i[0], 'original')
  t.equal(basename(i[1]), 'not-found.ts')
  t.equal(i[2], parent)
})
