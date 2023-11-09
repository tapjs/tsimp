import t from 'tap'

t.cleanSnapshot = s => s.split(`${process.pid}`).join('{PID}')

for (const isTTY of [true, false]) {
  t.test(`process.stderr.isTTY=${isTTY}`, async t => {
    for (const TSIMP_DEBUG of [
      '0',
      '1',
      '2',
      '3',
      'nan',
      undefined,
    ]) {
      t.test(`TSIMP_DEBUG=${TSIMP_DEBUG}`, async t => {
        const errs = t.capture(console, 'error').args
        Object.defineProperty(process.stderr, 'isTTY', {
          configurable: true,
          writable: true,
          value: isTTY,
        })
        if (TSIMP_DEBUG)
          process.env.TSIMP_DEBUG = TSIMP_DEBUG
        else
          delete process.env.TSIMP_DEBUG
        const d = (await t.mockImport('../dist/esm/debug.js', {
          'node:util': {
            format: (...args: any[]) => JSON.stringify(args),
          },
        })) as typeof import('../dist/esm/debug.js')
        d.error('error')
        d.warn('warn')
        d.debug('debug')
        d.info('info')
        d.trace('trace')
        t.matchSnapshot(errs().map(s => s.join('')).join('\n'), 'output')
      })
    }
  })
}
