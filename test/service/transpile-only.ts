import t from 'tap'
const cwd = process.cwd()

for (const tsconfigModule of ['commonjs', 'esnext', 'nodenext']) {
  t.test(`tsconfig module=${tsconfigModule}`, async t => {
    for (const packageJsonType of ['module', 'commonjs']) {
      t.test(`package.json type=${packageJsonType}`, async t => {
        for (const verbatimModuleSyntax of [true, false]) {
          t.test(`vms=${verbatimModuleSyntax}`, async t => {
            const fixture = {
              'package.json': JSON.stringify({
                type: packageJsonType,
              }),
              'tsconfig.json': JSON.stringify({
                compilerOptions: {
                  verbatimModuleSyntax,
                  jsx: verbatimModuleSyntax ? 'preserve' : undefined,
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
              mix: {
                'mixed.ts': `
                  import 'chalk'
                  import '../file.js'
                  import '../foo.js'
                  import '../esm.mjs'
                  import '../commonjs.cjs'
                `,
              },
            }
            const dir = t.testdir(fixture)
            process.chdir(dir)
            const {
              getOutputTranspileOnly,
              getOutputForceESM,
              getOutputForceCommonJS,
            } = (await t.mockImport(
              '../../src/service/transpile-only.js'
            )) as typeof import('../../src/service/transpile-only.js')

            for (const file of [
              'mix/mixed.ts',
              'commonjs.cts',
              'esm.mts',
              'foo.ts',
              'file.ts',
            ] as const) {
              t.test(file, async t => {
                const content = file === 'mix/mixed.ts'
                  ? fixture.mix['mixed.ts'] : fixture[file]
                const noForce = getOutputTranspileOnly(
                  content,
                  `${dir}/${file}`
                )
                const forceCommonJS = getOutputForceCommonJS(
                  content,
                  `${dir}/${file}`
                )
                const forceESM = getOutputForceESM(
                  content,
                  `${dir}/${file}`
                )
                t.strictSame(noForce.diagnostics, [], 'no diags')
                t.strictSame(
                  forceCommonJS.diagnostics,
                  [],
                  'no diags commonjs'
                )
                t.strictSame(forceESM.diagnostics, [], 'no diags esm')
                t.matchSnapshot(
                  {
                    noForce: noForce.outputText?.replace(
                      /# sourceMappingURL=.*/,
                      '# sourceMappingURL='
                    ),
                    forceCommonJS: forceCommonJS.outputText?.replace(
                      /# sourceMappingURL=.*/,
                      '# sourceMappingURL='
                    ),
                    forceESM: forceESM.outputText?.replace(
                      /# sourceMappingURL=.*/,
                      '# sourceMappingURL='
                    ),
                  },
                  'outputs'
                )
              })
            }
            t.test('chdir', async () => process.chdir(cwd))
          })
        }
      })
    }
  })
}
