import { resolve } from 'path'
import t from 'tap'

import { getOutputFile } from '../src/get-output-file.js'

t.equal(
  getOutputFile(resolve('./src/a/b/c.ts')),
  resolve('.tsimp/compiled/src_$$_a_$$_b_$$_c_ts.js'),
)
t.equal(
  getOutputFile(resolve('../a/b/c.ts')),
  resolve('.tsimp/compiled/___$$_a_$$_b_$$_c_ts.js'),
)
