import { spawnSync } from 'child_process'
import { readFileSync, statSync } from 'fs'
import { relative, resolve } from 'node:path'
import t from 'tap'
import { fileURLToPath, pathToFileURL } from 'url'

const bin = fileURLToPath(
  new URL('../dist/esm/bin.mjs', import.meta.url)
)

const run = (args: string[]) =>
  spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8' })

t.teardown(() => run(['--stop']))

t.test('help', async t => {
  for (const h of ['-h', '--help']) {
    const { stdout } = run([h])
    t.equal(stdout.startsWith('Usage: tsimp '), true, h)
  }
})

t.test('stop', async t => {
  run(['--stop'])
  t.throws(() =>
    process.kill(Number(readFileSync('.tsimp/daemon/pid')), 'SIGTERM')
  )
})

t.test('start', async t => {
  run(['--start'])
  t.equal(statSync('.tsimp/daemon/pid').isFile(), true)
})

t.test('clear', async t => {
  run(['--clear'])
  t.throws(() => statSync('.tsimp'))
  const { stdout } = run(['--log'])
  t.match(stdout, /^log could not be read/)
})

t.test('ping', async t => {
  const { stdout } = run(['--ping'])
  t.match(stdout, /^\{\n  PING: .*?'PONG'.*?,\n/)
  const { stdout: log } = run(['--log'])
  t.equal(
    log,
    readFileSync('.tsimp/daemon/log', 'utf8').trimEnd() + '\n'
  )
})

t.test('actually run a program', async t => {
  const dir = t.testdir({
    'file.ts': 'console.log("ok")',
    'bad.ts': `
      export type Foo = { bar: string }
      export const f: Foo = { bar: true, baz: 'xyz' }
      console.error(f)
    `,
  })
  const rel = relative(process.cwd(), dir).replace(/\\/g, '/')

  t.test('resolve', async t => {
    t.equal(run(['--resolve']).status, 1, 'file is required')
    {
      const { stdout, stderr } = run([
        '--resolve',
        `./${rel}/file.ts`,
      ])
      t.equal(
        stdout,
        String(pathToFileURL(resolve(dir, 'file.ts'))) + '\n'
      )
      t.equal(
        stderr.replace(/\\/g, '/'),
        `import('./${rel}/file.ts') from cwd\n`
      )
    }
    {
      const { stdout, stderr } = run([
        '--resolve',
        `./file.ts`,
        `./${rel}/foo.js`,
      ])
      t.equal(
        stdout,
        String(pathToFileURL(resolve(dir, 'file.ts'))) + '\n'
      )
      t.equal(
        stderr.replace(/\\/g, '/'),
        `import('./file.ts') from ${pathToFileURL(
          resolve(dir, 'foo.js')
        )}\n`
      )
    }
    {
      const { stdout, stderr } = run(['--resolve', 'chalk'])
      t.strictSame(
        { stdout, stderr },
        { stdout: 'chalk\n', stderr: `import('chalk')\n` }
      )
    }
  })
  t.test('compile', async t => {
    t.equal(run(['--compile']).status, 1, 'file is required')
    const { stdout } = run(['--compile', `./${rel}/file.ts`])
    t.matchSnapshot(
      stdout.replace(/# sourceMappingURL=.*/, '# sourceMappingURL=')
    )
  })
  t.test('compile with diags', async t => {
    const { stderr } = run(['--compile', `./${rel}/bad.ts`])
    t.match(stderr, /error TS2322/)
  })
  t.test('run file', async t => {
    const { stdout, status } = run([`./${rel}/file.ts`])
    t.equal(status, 0)
    t.equal(stdout, 'ok\n')
  })
})
