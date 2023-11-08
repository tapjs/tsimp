import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import t from 'tap'

import { classifyModule } from '../src/classify-module.js'

t.test('classify some modules', t => {
  const files = {
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
  for (const pjType of ['typeCommonjs', 'typeModule', 'noType']) {
    t.test(pjType, t => {
      const d = resolve(dir, pjType)
      const results = Object.fromEntries(
        Object.entries(files).map(([fileName]) => [
          fileName,
          classifyModule(resolve(d, fileName)),
        ])
      )
      t.matchSnapshot(results)
      t.end()
    })
  }
  t.test('responds to changes in package.json file', t => {
    for (const pjType of ['typeCommonjs', 'typeModule', 'noType']) {
      t.test(pjType, t => {
        const d = resolve(dir, pjType)
        writeFileSync(
          resolve(dir, pjType, 'package.json'),
          JSON.stringify({ type: 'module' })
        )
        const results = Object.fromEntries(
          Object.entries(files).map(([fileName]) => [
            fileName,
            classifyModule(resolve(d, fileName)),
          ])
        )
        t.matchSnapshot(results)
        t.end()
      })
    }
    t.end()
  })
  t.test('missing pj means commonjs', async t => {
    const { classifyModule } = await t.mockImport(
      '../src/classify-module.js',
      {
        '../src/service/ts-sys-cached.js': {
          readFile: () => undefined,
        },
      }
    )
    t.equal(
      classifyModule(resolve(t.testdirName, 'index.js')),
      'commonjs'
    )
  })
  t.end()
})
