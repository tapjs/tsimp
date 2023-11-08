import t from 'tap'
import { default as g } from '../dist/commonjs/get-url.js'
import { default as h } from '../src/get-url-cjs.cjs'

const { getUrl: getUrlDist } = g
const { getUrl: getUrlSrc } = h

t.equal(
  getUrlDist('x'),
  String(new URL('../dist/esm/x', import.meta.url))
)
t.equal(getUrlSrc('x'), String(new URL('../src/x', import.meta.url)))
