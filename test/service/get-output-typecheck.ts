import { basename } from 'path'
import t from 'tap'

for (const tsconfigModule of ['commonjs', 'esnext', 'nodenext']) {
  t.test(`tsconfig module=${tsconfigModule}`, async t => {
    for (const packageJsonType of ['module', 'commonjs']) {
      t.test(`package.json type=${packageJsonType}`, async t => {
        const fixture = {
          'package.json': JSON.stringify({
            type: packageJsonType,
          }),
          'tsconfig.json': JSON.stringify({
            compilerOptions: {
              module: tsconfigModule,
              moduleResolution:
                tsconfigModule === 'nodenext' ? 'nodenext' : 'node10',
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
        const { getOutputTypeCheck } = (await t.mockImport(
          '../../src/service/get-output-typecheck.js'
        )) as typeof import('../../src/service/get-output-typecheck.js')

        for (const file of [
          'mix/mixed.ts',
          'commonjs.cts',
          'esm.mts',
          'foo.ts',
          'file.ts',
        ] as const) {
          t.test(file, async t => {
            const content =
              file === 'mix/mixed.ts'
                ? fixture.mix['mixed.ts']
                : fixture[file]
            const { outputText, diagnostics } = getOutputTypeCheck(
              content,
              `${dir}/${file}`
            )
            const d = diagnostics
              .map(
                d =>
                  [
                    d.file && basename(d.file.fileName),
                    d.code,
                    typeof d.messageText === 'object'
                      ? d.messageText.messageText
                      : d.messageText,
                  ] as [string, number, string]
              )
              .sort(
                ([a, aa], [b, bb]) =>
                  a.localeCompare(b, 'en') || aa - bb
              )
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
      })
    }
  })
}
