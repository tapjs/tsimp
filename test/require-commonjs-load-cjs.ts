import { createRequire } from 'module'
import t from 'tap'
import * as r from '../dist/commonjs/require-commonjs-load.js'
const { requireCommonJSLoad } = r

const req = createRequire(import.meta.url)
t.equal(
  requireCommonJSLoad(),
  req('../dist/commonjs/service/load.js'),
)
