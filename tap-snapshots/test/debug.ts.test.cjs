/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/debug.ts > TAP > process.stderr.isTTY=false > TSIMP_DEBUG=0 > output 1`] = `
TSIMP error {PID}: ["error"]
TSIMP trace {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=false > TSIMP_DEBUG=1 > output 1`] = `
TSIMP error {PID}: ["error"]
TSIMP warn {PID}: ["warn"]
TSIMP trace {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=false > TSIMP_DEBUG=2 > output 1`] = `
TSIMP error {PID}: ["error"]
TSIMP warn {PID}: ["warn"]
TSIMP debug {PID}: ["debug"]
TSIMP trace {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=false > TSIMP_DEBUG=3 > output 1`] = `
TSIMP error {PID}: ["error"]
TSIMP warn {PID}: ["warn"]
TSIMP debug {PID}: ["debug"]
TSIMP info {PID}: ["info"]
TSIMP trace {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=false > TSIMP_DEBUG=nan > output 1`] = `
TSIMP error {PID}: ["error"]
TSIMP trace {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=false > TSIMP_DEBUG=undefined > output 1`] = `
TSIMP error {PID}: ["error"]
TSIMP trace {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=true > TSIMP_DEBUG=0 > output 1`] = `
TSIMP [41;30;1merror[m {PID}: ["error"]
TSIMP [42;30;2mtrace[m {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=true > TSIMP_DEBUG=1 > output 1`] = `
TSIMP [41;30;1merror[m {PID}: ["error"]
TSIMP [43;30mwarn[m {PID}: ["warn"]
TSIMP [42;30;2mtrace[m {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=true > TSIMP_DEBUG=2 > output 1`] = `
TSIMP [41;30;1merror[m {PID}: ["error"]
TSIMP [43;30mwarn[m {PID}: ["warn"]
TSIMP [45;30mdebug[m {PID}: ["debug"]
TSIMP [42;30;2mtrace[m {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=true > TSIMP_DEBUG=3 > output 1`] = `
TSIMP [41;30;1merror[m {PID}: ["error"]
TSIMP [43;30mwarn[m {PID}: ["warn"]
TSIMP [45;30mdebug[m {PID}: ["debug"]
TSIMP [44;37minfo[m {PID}: ["info"]
TSIMP [42;30;2mtrace[m {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=true > TSIMP_DEBUG=nan > output 1`] = `
TSIMP [41;30;1merror[m {PID}: ["error"]
TSIMP [42;30;2mtrace[m {PID}: ["trace"]
`

exports[`test/debug.ts > TAP > process.stderr.isTTY=true > TSIMP_DEBUG=undefined > output 1`] = `
TSIMP [41;30;1merror[m {PID}: ["error"]
TSIMP [42;30;2mtrace[m {PID}: ["trace"]
`
