import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { basename, resolve } from 'path'
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
              nested: {
                'sourcemap.ts': `
                  console.log(new Error().stack)
                `,
              },
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
                t.matchSnapshot(
                  outputText?.replace(
                    /# sourceMappingURL=.*/,
                    '# sourceMappingURL='
                  ),
                  'compiled'
                )
                t.matchSnapshot(d, 'diagnostics')
              })
            }
            t.test('sourcemap.ts', async t => {
              const sourcePath = `${dir}/nested/sourcemap.ts`
              const { outputText } = compile(
                fixture['nested']['sourcemap.ts'],
                sourcePath,
                typeCheck
              )

              const outputPath = `${dir}/nested/sourcemap.js`
              writeFileSync(outputPath, outputText ?? '')

              const stdout = execSync(
                `${process.argv[0]} --enable-source-maps ${outputPath}`
              ).toString()
              const stackTracePath =
                stdout.match(
                  /^\s+at [^\(]+\((([a-zA-Z]:)?[^:]+)/im
                )?.[1] ?? ''
              t.equal(
                resolve(stackTracePath).toLowerCase(),
                resolve(sourcePath).toLowerCase()
              )
            })
            t.test('chdir', async () => process.chdir(cwd))
          })
        }
      })
    }
  })
}
