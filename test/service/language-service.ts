import { readFileSync } from 'fs'
import { basename } from 'path'
import t from 'tap'
import ts from 'typescript'
import { fileURLToPath } from 'url'
import { getLanguageService } from '../../src/service/language-service.js'
import { tsconfig } from '../../src/service/tsconfig.js'

process.env.TSIMP_CONFIG_DEBOUNCE = '-1'

const languageService = getLanguageService()
const rootTsconfig = tsconfig()
t.equal(languageService, getLanguageService(), 'cached')

const __filename = fileURLToPath(import.meta.url)
t.equal(languageService.getHost().fileExists(__filename), true)
t.equal(
  languageService.getHost().fileExists(__filename + 'asdfasdf'),
  false
)
const content = readFileSync(__filename, 'utf8')
t.equal(
  languageService
    .getHost()
    .getScriptSnapshot(__filename)
    ?.getText(0, content.length),
  content
)
t.equal(
  languageService
    .getHost()
    .getScriptSnapshot(__filename + 'asdfasdf'),
  undefined
)

const cwd = process.cwd()
t.test('change config reloads service', async t => {
  const dir = t.testdir({
    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        traceResolution: true,
      },
    }),
  })
  process.chdir(dir)

  const { tsconfig } = (await t.mockImport(
    '../../src/service/tsconfig.js'
  )) as typeof import('../../src/service/tsconfig.js')

  let tscfg = tsconfig()
  const mockTsconfig = {
    tsconfig: () => tscfg,
  }
  const INFO: string[] = []
  const ERROR: string[] = []
  const { getLanguageService } = await t.mockImport(
    '../../src/service/language-service.js',
    {
      '../../src/service/tsconfig.js': mockTsconfig,
      '../../src/debug.js': {
        info: (msg: string) => INFO.push(msg),
        error: (msg: string) => ERROR.push(msg),
        trace: () => {},
      },
    }
  )
  const svc = getLanguageService()
  const host = svc.getHost()
  t.type(host.trace, 'function')
  t.equal(
    host.getCompilationSettings().moduleResolution,
    ts.ModuleResolutionKind.NodeNext
  )
  t.equal(host.getNewLine(), '\n')
  t.match(host.getScriptFileNames(), Array)
  t.match(
    host.getScriptVersion(host.getScriptFileNames()),
    String(undefined)
  )
  INFO.length = 0
  host.log('info')
  t.strictSame(INFO, ['info'])
  ERROR.length = 0
  host.error('error')
  t.strictSame(ERROR, ['error'])
  t.equal(
    basename(host.getDefaultLibFileName(tscfg.options)),
    'lib.es2022.full.d.ts'
  )
  tscfg = rootTsconfig

  const svc2 = getLanguageService()
  t.not(svc, svc2, 'changed config, reload cached service')
  t.test('chdir', async () => process.chdir(cwd))
})
