import { readFileSync, utimesSync, writeFileSync } from 'fs'
import t from 'tap'
process.env.TSIMP_CONFIG_DEBOUNCE = '-1'
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
                    tsconfigModule === 'nodenext' ? 'nodenext' : (
                      'node10'
                    ),
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
            const { load, loadTypeCheck, loadTranspileOnly } =
              (await t.mockImport('../../src/service/load.js', {
                '../../src/service/tsconfig.js': await t.mockImport(
                  '../../src/service/tsconfig.js',
                ),
              })) as typeof import('../../src/service/load.js')
            for (const file of [
              'mixed.ts',
              'commonjs.cts',
              'esm.mts',
              'foo.ts',
              'file.ts',
            ] as const) {
              t.test(file, async t => {
                const { fileName, diagnostics } = load(
                  `${dir}/${file}`,
                  typeCheck,
                )
                t.matchSnapshot(
                  fileName &&
                    Buffer.from(
                      readFileSync(fileName)
                        .toString()
                        .replace(
                          /# sourceMappingURL=.*/,
                          '# sourceMappingURL=',
                        ),
                    ),
                  'compiled',
                )
                t.matchSnapshot(diagnostics, 'diagnostics')
              })
            }
            // cached if called again
            const { fileName } = (
              typeCheck ? loadTypeCheck : loadTranspileOnly)(
              `${dir}/mixed.ts`,
            )
            t.equal(
              load(`${dir}/mixed.ts`, typeCheck).fileName,
              fileName,
              'second compilation is cached',
            )
            // calling again with new config re-loads caches
            writeFileSync(
              `${dir}/tsconfig.json`,
              JSON.stringify({
                compilerOptions: {
                  verbatimModuleSyntax: true,
                },
              }),
            )
            utimesSync(`${dir}/tsconfig.json`, new Date(), new Date())
            t.equal(
              load(`${dir}/mixed.ts`, typeCheck).fileName,
              fileName,
              'load after config change not cached, but still same output',
            )
            t.test('chdir', async () => process.chdir(cwd))
          })
        }
      })
    }
  })
}
