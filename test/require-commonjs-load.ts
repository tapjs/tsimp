import t from 'tap'
import { fileURLToPath } from 'url'
const { requireCommonJSLoad: fromSrc } = (await t.mockImport(
  '../src/require-commonjs-load.js',
  {
    module: {
      createRequire: () => (req: string) => req,
    },
  }
)) as typeof import('../src/require-commonjs-load.js')
const { requireCommonJSLoad: fromDist } = (await t.mockImport(
  '../dist/esm/require-commonjs-load.js',
  {
    module: {
      createRequire: () => (req: string) => req,
    },
  }
)) as typeof import('../dist/esm/require-commonjs-load.js')

t.equal(
  fromSrc(),
  fileURLToPath(
    new URL('../dist/commonjs/service/load.js', import.meta.url)
  )
)
t.equal(
  fromDist(),
  fileURLToPath(
    new URL('../dist/commonjs/service/load.js', import.meta.url)
  )
)
