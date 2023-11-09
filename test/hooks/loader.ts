import t from 'tap'
import {
  initialize,
  load,
  resolve,
} from '../../dist/esm/hooks/hooks.mjs'
import * as L from '../../dist/esm/hooks/loader.mjs'

t.same(L, { initialize, load, resolve })
