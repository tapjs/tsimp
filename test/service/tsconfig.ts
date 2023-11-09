import { unlinkSync, utimesSync } from 'node:fs'
import { resolve } from 'node:path'
import t from 'tap'
import ts from 'typescript'

const exits = t.capture(process, 'exit').args

t.afterEach(() => delete process.env.TSIMP_PROJECT)
process.env.TSIMP_CONFIG_DEBOUNCE = '10'

t.test('basic loading', async t => {
  const cwd = process.cwd()
  t.after(() => process.chdir(cwd))
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        jsx: 'preserve',
      },
    }),
    dir: {
      sub: {},
      'tsconfig.json': JSON.stringify({
        tsimp: {
          compilerOptions: {
            jsx: 'react',
          },
        },
        compilerOptions: {
          jsx: 'reactjsxdev',
        },
      }),
    },
  })

  process.chdir(resolve(dir, 'dir/sub'))

  const { tsconfig } = (await t.mockImport(
    '../../dist/esm/service/tsconfig.js'
  )) as typeof import('../../dist/esm/service/tsconfig.js')
  const first = tsconfig()
  const second = tsconfig()
  t.equal(first, second, 'cached')
  t.equal(first.options.jsx, ts.JsxEmit.React, 'override applied')
  await new Promise<void>(r => setTimeout(r, 20))
  unlinkSync(resolve(dir, 'dir/tsconfig.json'))
  const third = tsconfig()
  t.equal(third.options.jsx, ts.JsxEmit.Preserve)
  await new Promise<void>(r => setTimeout(r, 20))
  const fourth = tsconfig()
  t.equal(fourth, third, 'got cached value after another stat')
  const now = new Date()
  // touch the file, but do not alter contents
  await new Promise<void>(r => setTimeout(r, 20))
  utimesSync(resolve(dir, 'tsconfig.json'), now, now)
  const fifth = tsconfig()
  t.equal(fifth, fourth, 'same content, same config')
})

t.test('exit in error if tsconfig not found', async t => {
  process.env.TSIMP_PROJECT = 'this-file-does-not-exist-i-hope.json'
  const warns: any[][] = []
  const errs: any[][] = []
  const { tsconfig } = (await t.mockImport(
    '../../dist/esm/service/tsconfig.js',
    {
      '../../dist/esm/debug.js': {
        warn: (...args: any[]) => warns.push(args),
        error: (...args: any[]) => errs.push(args),
      },
    }
  )) as typeof import('../../dist/esm/service/tsconfig.js')
  const res = tsconfig()
  t.matchSnapshot({ warns, errs })
  t.strictSame(exits(), [[1]])
  t.equal(res, undefined)
})
