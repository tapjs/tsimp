import { readFileSync } from 'fs'
import {
  LoadFnOutput,
  LoadHookContext,
  ResolveHookContext,
} from 'module'
import * as FS from 'node:fs'
import { resolve } from 'path'
import t from 'tap'
import { fileURLToPath, pathToFileURL } from 'url'
import { MessageChannel } from 'worker_threads'
import { DiagMode } from '../../dist/esm/diagnostic-mode.js'

const stderrWrites: string[] = []
const mockWriteSync = (
  fd: number,
  msg: string | Buffer,
  ...args: any[]
) => {
  if (fd === 1 && typeof msg === 'string') stderrWrites.push(msg)
  else if (typeof msg === 'string') FS.writeSync(fd, msg, ...args)
  else FS.writeSync(fd, msg, ...args)
}

class MockDaemonClient {
  static compileRequest?: {
    inputFile: string
    diagMode: DiagMode
    pretty: boolean
  }
  static compileResponse: {
    fileName?: string
    diagnostics: string[]
  } = {
    diagnostics: [],
  }
  static resolveRequest?: { url: string; parentURL?: string }
  static resolveResponse: string = ''
  async resolve(url: string, parentURL?: string) {
    MockDaemonClient.resolveRequest = { url, parentURL }
    return MockDaemonClient.resolveResponse
  }
  async compile(
    inputFile: string,
    diagMode: DiagMode = 'warn',
    pretty: boolean = false
  ) {
    MockDaemonClient.compileRequest = { inputFile, diagMode, pretty }
    return MockDaemonClient.compileResponse
  }
}

const hooks = await t.mockImport('../../dist/esm/hooks/hooks.mjs', {
  'node:fs': t.createMock(FS, { writeSync: mockWriteSync }),
  '../../dist/esm/client.js': {
    DaemonClient: MockDaemonClient,
  },
})

t.test('globalPreload', async t => {
  const { port1, port2 } = new MessageChannel()
  port1.unref()
  port2.unref()
  const res = hooks.globalPreload({ port: port2 })
  t.type(res, 'string')
  port1.postMessage({ stderrIsTTY: false })
  await new Promise<void>(r => setTimeout(r, 10))
  t.equal(hooks.getPretty(), false)
  // this means that compiles are pretty from here on
  port1.postMessage({ stderrIsTTY: true })
  await new Promise<void>(r => setTimeout(r, 10))
  t.equal(hooks.getPretty(), true)
})

t.test('initialize', async t => {
  const { port1, port2 } = new MessageChannel()
  port1.unref()
  port2.unref()
  const res = hooks.initialize({ port: port2 })
  t.equal(res, undefined)
  port1.postMessage({ stderrIsTTY: false })
  await new Promise<void>(r => setTimeout(r, 10))
  t.equal(hooks.getPretty(), false)
  port1.postMessage({ stderrIsTTY: true })
  await new Promise<void>(r => setTimeout(r, 10))
  t.equal(hooks.getPretty(), true)
})

t.test('resolve', async t => {
  MockDaemonClient.resolveResponse = 'file:///some/test.ts'
  const nextResolve = (url: string, context: ResolveHookContext) => [
    url,
    context,
  ]
  t.strictSame(await hooks.resolve('xyz', {}, nextResolve), [
    'xyz',
    {},
  ])
  t.strictSame(
    await hooks.resolve(
      './xyz',
      { parentURL: 'file:///asdf/asdf.js' },
      nextResolve
    ),
    ['file:///some/test.ts', { parentURL: 'file:///asdf/asdf.js' }]
  )
  t.strictSame(MockDaemonClient.resolveRequest, {
    url: './xyz',
    parentURL: 'file:///asdf/asdf.js',
  })
})

t.test('load', async t => {
  t.test('not one of ours, just call nextLoad', async t => {
    delete MockDaemonClient.compileRequest
    MockDaemonClient.compileResponse = {
      fileName: 'outputfile',
      diagnostics: [],
    }
    const nextLoad = (url: string, context?: LoadHookContext) => ({
      url,
      ...context,
    })
    t.strictSame(await hooks.load('xyz', {}, nextLoad), {
      url: 'xyz',
    })
    t.equal(MockDaemonClient.compileRequest, undefined)
  })

  t.test('do a compile, with diagnostics', async t => {
    const dir = t.testdir({ file: 'contents' })
    const nextLoad = (url: string, context?: LoadHookContext) => ({
      url,
      ...context,
    })
    delete MockDaemonClient.compileRequest
    MockDaemonClient.compileResponse = {
      fileName: resolve(dir, 'file'),
      diagnostics: ['diagnostics'],
    }
    t.strictSame(await hooks.load(import.meta.url, {}, nextLoad), {
      source: 'contents',
      shortCircuit: true,
      format: 'module',
    })
    t.strictSame(stderrWrites, ['diagnostics\n'])
    stderrWrites.length = 0
  })

  t.test('compile failure', async t => {
    const nextLoad = (url: string, context?: LoadHookContext) => ({
      url,
      ...context,
    })
    delete MockDaemonClient.compileRequest
    MockDaemonClient.compileResponse = {
      diagnostics: ['diagnostics'],
    }
    await t.rejects(hooks.load(import.meta.url, {}, nextLoad), {
      message: 'compile failure',
      code: 'E_TSIMP_COMPILE_FAILURE',
    })
    t.strictSame(stderrWrites, ['diagnostics\n'])
    stderrWrites.length = 0
    t.match(MockDaemonClient.compileRequest, {
      inputFile: fileURLToPath(import.meta.url),
      diagMode: String,
      pretty: true,
    })
  })

  t.test('source for commonjs once hooked', async t => {
    const dir = t.testdir({
      'package.json': JSON.stringify({ type: 'commonjs' }),
      project: {
        'foo.ts': 'console.log("feet")',
        'foo.js': 'console.log("feet");',
        'boo.ts': 'console.log("shoes")',
        'boo.js': 'console.log("shoes");',
      },
      'outside.js': 'console.log("outside");',
    })
    const cwd = process.cwd()
    t.teardown(() => process.chdir(cwd))
    process.chdir(dir + '/project')

    const hooks = (await t.mockImport(
      '../../dist/esm/hooks/hooks.mjs',
      {
        'node:fs': t.createMock(FS, { writeSync: mockWriteSync }),
        '../../dist/esm/client.js': {
          DaemonClient: MockDaemonClient,
        },
      }
    )) as typeof import('../../dist/esm/hooks/hooks.mjs')

    const nextLoad = (url: string, context?: LoadHookContext) =>
      ({
        format: 'commonjs',
      } as unknown as LoadFnOutput)
    delete MockDaemonClient.compileRequest
    MockDaemonClient.compileResponse = {
      fileName: resolve(dir, 'project/foo.js'),
      diagnostics: [],
    }
    // load one time to have compiled a cjs file.
    const result = await hooks.load(
      String(pathToFileURL(resolve(dir, 'project/foo.ts'))),
      { conditions: [], format: 'commonjs', importAssertions: {} },
      nextLoad
    )
    t.same(result, {
      format: 'commonjs',
      source: readFileSync(resolve(dir, 'project/foo.js'), 'utf8'),
      shortCircuit: true,
    })
    const outRes = await hooks.load(
      String(pathToFileURL(resolve(dir, 'outside.js'))),
      { conditions: [], format: 'commonjs', importAssertions: {} },
      nextLoad
    )
    t.same(outRes, {
      format: 'commonjs',
      source: readFileSync(resolve(dir, 'outside.js'), 'utf8'),
    })
  })
})
