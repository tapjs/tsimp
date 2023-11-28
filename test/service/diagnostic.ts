import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import t from 'tap'
import { compile } from '../../src/service/compile.js'

import { report, reportAll } from '../../src/service/diagnostic.js'

t.cleanSnapshot = s => s.replace(/\\/g, '/')
t.saveFixture = true

const dir = t.testdir({
  'bad-foo.ts': `export type Foo = { bar: string }
export const f: Foo = { bar: true, baz: 'xyz' }
`,
})

const f = resolve(dir, 'bad-foo.ts')
const { diagnostics } = compile(readFileSync(f, 'utf8'), f, true)

const d = diagnostics[0]
if (!d) throw new Error('no diagnostics')
t.type(report(d), 'string')

t.matchSnapshot(reportAll(diagnostics, true).join('\n'), 'pretty')
t.matchSnapshot(reportAll(diagnostics, false).join('\n'), 'ugly')
