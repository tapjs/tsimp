import { resolve } from 'path'
import t from 'tap'
// import { fileURLToPath } from 'url'
// import { getLanguageService } from '../../src/service/language-service.js'
// import { markFileNameInternal } from '../../src/service/resolve-module-name-literals.js'
//
// const svc = getLanguageService()
// svc.getProgram()
//
// markFileNameInternal(fileURLToPath(import.meta.url))

t.test('commonjs program', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify({
      include: ['index.ts'],
      compilerOptions: {
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        module: 'commonjs',
        moduleResolution: 'node10',
        skipLibCheck: true,
        strict: true,
        target: 'es2022',
      },
    }),
    'package.json': JSON.stringify({ type: 'commonjs' }),
    'index.ts': `
import assert from 'node:assert'
import './def'
import { bar } from './bar'
import { baz } from './baz'
import t from 'tap'
assert.equal(1, 1)
export type Foo = {
  foo: string
}
export const foo = (f: Foo) => f.foo
`,
    'bar.cts': `
export const bar = 'bar'
`,
    'baz.ts': `
export const baz = 'baz'
`,
  })
  const cwd = process.cwd()
  process.chdir(dir)
  const { getLanguageService } = (await t.mockImport(
    '../../src/service/language-service.js',
  )) as typeof import('../../src/service/language-service.js')
  const { markFileNameInternal } = (await t.mockImport(
    '../../src/service/resolve-module-name-literals.js',
  )) as typeof import('../../src/service/resolve-module-name-literals.js')
  const svc = getLanguageService()
  svc.getHost().resolveModuleNameLiterals
  svc.getProgram()
  markFileNameInternal(resolve(dir, 'index.ts'))

  t.test('chdir', async () => process.chdir(cwd))
})

t.test('esm program', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify({
      include: ['index.ts'],
      compilerOptions: {
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        module: 'nodenext',
        moduleResolution: 'nodenext',
        skipLibCheck: true,
        strict: true,
        target: 'es2022',
      },
    }),
    'package.json': JSON.stringify({ type: 'module' }),
    'index.ts': `
import assert from 'node:assert'
import { bar } from './bar.cjs'
import { baz } from './baz.js'
import t from 'tap'
assert.equal(1, 1)
export type Foo = {
  foo: string
}
export const foo = (f: Foo) => f.foo
`,
    'bar.cts': `
export const bar = 'bar'
`,
    'baz.ts': `
export const baz = 'baz'
`,
  })
  const cwd = process.cwd()
  process.chdir(dir)
  const { getLanguageService } = (await t.mockImport(
    '../../src/service/language-service.js',
  )) as typeof import('../../src/service/language-service.js')
  const { markFileNameInternal } = (await t.mockImport(
    '../../src/service/resolve-module-name-literals.js',
  )) as typeof import('../../src/service/resolve-module-name-literals.js')
  const svc = getLanguageService()
  svc.getHost().resolveModuleNameLiterals
  svc.getProgram()
  markFileNameInternal(resolve(dir, 'index.ts'))
  t.test('chdir', async () => process.chdir(cwd))
})
