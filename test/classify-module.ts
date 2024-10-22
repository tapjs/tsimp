import { utimesSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import t from 'tap'

import { classifyModule } from '../src/classify-module.js'

t.test('classify some modules', t => {
  const files = {
    'index.json': '',
    'index.cjs': '',
    'index.cts': '',
    'index.mjs': '',
    'index.mts': '',
    'index.jsx': '',
    'index.tsx': '',
    'index.js': '',
    'index.ts': '',
  }

  const pj = (type?: 'commonjs' | 'module') => ({
    'package.json': JSON.stringify({ type }),
  })

  const dir = t.testdir({
    typeCommonjs: pj('commonjs'),
    typeModule: pj('module'),
    noType: pj(),
  })
  // set the mtime way in the past so that it notes the change,
  // otherwise if this code takes less than the mtime check debounce,
  // it'll fail.
  const when = new Date('1985-10-26T08:15:00.0007')
  utimesSync(resolve(dir, 'typeCommonjs/package.json'), when, when)
  utimesSync(resolve(dir, 'typeModule/package.json'), when, when)
  utimesSync(resolve(dir, 'noType/package.json'), when, when)

  for (const pjType of ['typeCommonjs', 'typeModule', 'noType']) {
    t.test(pjType, t => {
      const d = resolve(dir, pjType)
      const results = Object.fromEntries(
        Object.entries(files).map(([fileName]) => [
          fileName,
          classifyModule(resolve(d, fileName)),
        ]),
      )
      t.matchSnapshot(results)
      t.end()
    })
  }

  t.test('responds to changes in package.json file', async t => {
    // wait for the mtime debounce
    await new Promise<void>(r => setTimeout(r, 20))
    for (const pjType of ['typeCommonjs', 'typeModule', 'noType']) {
      t.test(pjType, t => {
        const d = resolve(dir, pjType)
        writeFileSync(
          resolve(d, 'package.json'),
          JSON.stringify({ type: 'module' }),
        )

        const results = Object.fromEntries(
          Object.entries(files).map(([fileName]) => [
            fileName,
            classifyModule(resolve(d, fileName)),
          ]),
        )
        t.strictSame(
          results,
          {
            'index.json': 'json',
            'index.cjs': 'commonjs',
            'index.cts': 'commonjs',
            'index.mjs': 'module',
            'index.mts': 'module',
            'index.jsx': 'module',
            'index.tsx': 'module',
            'index.js': 'module',
            'index.ts': 'module',
          },
          'should default to module now',
        )
        t.end()
      })
    }
    t.end()
  })

  t.test('missing pj means commonjs', async t => {
    const { classifyModule } = await t.mockImport(
      '../src/classify-module.js',
      {
        '../src/ts-sys-cached.js': {
          readFile: () => undefined,
        },
      },
    )
    t.equal(
      classifyModule(resolve(t.testdirName, 'index.js')),
      'commonjs',
    )
  })

  t.end()
})
