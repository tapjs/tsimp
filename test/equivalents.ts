import t from 'tap'

import { jsExts, tsExts, map, allExts, isExt, equivalents, isTSExt, isJSExt } from '../src/equivalents.js'

const files = [
  '/x/y.ts',
  '/x/y.js',
  '/x/y.mts',
  '/x/y.mjs',
  '/x/y.cts',
  '/x/y.cjs',
  '/x/y.tsx',
  '/x/y.jsx',
  '/x/y',
]

t.test('find equivalents', t => {
  t.plan(files.length)
  for (const f of files) {
    t.test(f, t => {
      t.matchSnapshot(equivalents(f), 'not extensionless')
      t.matchSnapshot(equivalents(f, true), 'extensionless')
      t.end()
    })
  }
})

t.matchSnapshot({
  jsExts,
  tsExts,
})
t.strictSame(allExts, [...jsExts, ...tsExts])
t.equal(isExt('.js'), true)
t.equal(isExt('.xyz'), false)
t.equal(isTSExt('.js'), false)
t.equal(isJSExt('.js'), true)
t.equal(isJSExt('.ts'), false)
t.equal(isTSExt('.ts'), true)
