import t from 'tap'
import {
  globalPreload,
  load,
  resolve,
} from '../../dist/esm/hooks/hooks.mjs'
import * as L from '../../dist/esm/hooks/legacy-loader.mjs'

t.same(L, { globalPreload, load, resolve })
