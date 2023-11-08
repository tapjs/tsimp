import t from 'tap'
import { getUrl } from '../src/get-url.js'

t.equal(getUrl('xyz'), String(new URL('../src/xyz', import.meta.url)))
