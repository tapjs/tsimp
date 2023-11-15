import { basename } from 'path'
import t from 'tap'
const cwd = process.cwd()

for (const tsconfigModule of ['commonjs', 'esnext', 'nodenext']) {
  t.test(`tsconfig module=${tsconfigModule}`, async t => {
    for (const packageJsonType of ['module', 'commonjs']) {
      t.test(`package.json type=${packageJsonType}`, async t => {
        for (const typeCheck of [true, false]) {
          t.test(`typeCheck=${typeCheck}`, async t => {
            const fixture = {
              'package.json': JSON.stringify({
                type: packageJsonType,
              }),
              'tsconfig.json': JSON.stringify({
                compilerOptions: {
                  module: tsconfigModule,
                  moduleResolution:
                    tsconfigModule === 'nodenext'
                      ? 'nodenext'
                      : 'node10',
                },
              }),
              'file.ts': `
                import { Foo } from './foo.js'
                const f: Foo = { bar: 'bar' }
                console.error(f)
              `,
              'foo.ts': `
                export type Foo = { bar: string }
              `,
              'esm.mts': `
                console.error('esm!')
                export const dialect = 'esm'
              `,
              'commonjs.cts': `
                console.error('commonjs!')
                export const dialect = 'commonjs'
              `,
              'mixed.ts': `
                import 'chalk'
                import './file.js'
                import './foo.js'
                import './esm.mjs'
                import './commonjs.cjs'
              `,
            }
            const dir = t.testdir(fixture)
            process.chdir(dir)
            const { compile } = (await t.mockImport(
              '../../src/service/compile.js',
              {
                '../../src/service/tsconfig.js': await t.mockImport(
                  '../../src/service/tsconfig.js'
                ),
              }
            )) as typeof import('../../src/service/compile.js')
            for (const file of [
              'mixed.ts',
              'commonjs.cts',
              'esm.mts',
              'foo.ts',
              'file.ts',
            ] as const) {
              t.test(file, async t => {
                const { outputText, diagnostics } = compile(
                  fixture[file],
                  `${dir}/${file}`,
                  typeCheck
                )
                const d = diagnostics.map(d => [
                  d.file && basename(d.file.fileName),
                  d.code,
                  typeof d.messageText === 'object'
                    ? d.messageText.messageText
                    : d.messageText,
                ])
                t.matchSnapshot(outputText, 'compiled')
                t.matchSnapshot(d, 'diagnostics')
              })
            }
	    t.test('chdir', async () => process.chdir(cwd))
          })
        }
      })
    }
  })
}
