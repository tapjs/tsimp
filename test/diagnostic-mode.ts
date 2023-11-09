import t from 'tap'

import { getDiagMode } from '../src/diagnostic-mode.js'

delete process.env.TSIMP_DIAG
t.equal(getDiagMode(), 'warn')
process.env.TSIMP_DIAG = 'warn'
t.equal(getDiagMode(), 'warn')
process.env.TSIMP_DIAG = 'error'
t.equal(getDiagMode(), 'error')
process.env.TSIMP_DIAG = 'ignore'
t.equal(getDiagMode(), 'ignore')
process.env.TSIMP_DIAG = 'invalid'
t.throws(() => getDiagMode())
