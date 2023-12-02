import { resolve } from 'path'
import t from 'tap'
import { pathToFileURL } from 'url'
import { CompileResult } from '../../src/types.js'

t.test('preload', async t => {
  const { DaemonServer } = (await t.mockImport(
    '../../src/service/service.js',
    {
      '../../src/service/language-service.js': {
        getLanguageService: () => {
          return {
            getProgram: () => {},
          }
        },
      },
    }
  )) as typeof import('../../src/service/service.js')
  const ds = new DaemonServer()
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'preload',
    }),
    {}
  )
})

t.test('resolve', async t => {
  const dir = t.testdir({
    'foo.ts': '',
    'bar.tsx': '',
    'baz.js': '',
  })

  const { DaemonServer } = (await t.mockImport(
    '../../src/service/service.js'
  )) as typeof import('../../src/service/service.js')
  t.equal(DaemonServer.serviceName, 'tsimp')
  const ds = new DaemonServer()
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: String(pathToFileURL(resolve(dir, 'foo.ts'))),
    }),
    {
      fileName: String(pathToFileURL(resolve(dir, 'foo.ts'))),
    }
  )
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: String(pathToFileURL(resolve(dir, 'foo.js'))),
    }),
    {
      fileName: String(pathToFileURL(resolve(dir, 'foo.ts'))),
    }
  )
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: String(pathToFileURL(resolve(dir, 'bar.js'))),
    }),
    {
      fileName: String(pathToFileURL(resolve(dir, 'bar.tsx'))),
    }
  )

  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: './foo.ts',
      parentURL: String(pathToFileURL(resolve(dir, 'bar.ts'))),
    }),
    {
      fileName: String(pathToFileURL(resolve(dir, 'foo.ts'))),
    }
  )
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: './foo.js',
      parentURL: String(pathToFileURL(resolve(dir, 'bar.js'))),
    }),
    {
      fileName: String(pathToFileURL(resolve(dir, 'foo.ts'))),
    }
  )
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: './bar.js',
      parentURL: String(pathToFileURL(resolve(dir, 'foo.js'))),
    }),
    {
      fileName: String(pathToFileURL(resolve(dir, 'bar.tsx'))),
    }
  )

  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url: String(pathToFileURL(resolve(dir, 'does-not-exist'))),
    }),
    {}
  )
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'preload',
    }),
    {}
  )

  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url:
        String(pathToFileURL(resolve(dir, 'foo.ts'))) + '?name=value',
    }),
    {
      fileName:
        String(pathToFileURL(resolve(dir, 'foo.ts'))) + '?name=value',
    }
  )
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'resolve',
      url:
        String(pathToFileURL(resolve(dir, 'foo.js'))) + '?name=value',
    }),
    {
      fileName:
        String(pathToFileURL(resolve(dir, 'foo.ts'))) + '?name=value',
    }
  )
})

t.test('compile', async t => {
  let compileResult: CompileResult = {
    fileName: 'some/file',
    diagnostics: [],
  }
  const dir = t.testdir({
    'foo.tsx': '',
  })
  const fileName = String(pathToFileURL(resolve(dir, 'foo')))
  const { DaemonServer } = (await t.mockImport(
    '../../src/service/service.js',
    {
      '../../src/service/load.js': {
        load: () => compileResult,
      },
    }
  )) as typeof import('../../src/service/service.js')
  const ds = new DaemonServer()
  t.strictSame(
    ds.handle({
      id: 'id',
      action: 'compile',
      fileName,
      diagMode: 'warn',
      pretty: true,
    }),
    compileResult
  )
})
