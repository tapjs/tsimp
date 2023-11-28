import { format } from 'util'

const yellow = (s: string) =>
  process.stderr.isTTY ? `\x1b[43;30m${s}\x1b[m` : s
const blue = (s: string) =>
  process.stderr.isTTY ? `\x1b[44;37m${s}\x1b[m` : s
const red = (s: string) =>
  process.stderr.isTTY ? `\x1b[41;30;1m${s}\x1b[m` : s
const magenta = (s: string) =>
  process.stderr.isTTY ? `\x1b[45;30m${s}\x1b[m` : s
const green = (s: string) =>
  process.stderr.isTTY ? `\x1b[42;30;2m${s}\x1b[m` : s

const level = parseInt(process.env.TSIMP_DEBUG || '0', 10)

const getLogger =
  (name: string, color: (s: string) => string) =>
  (...args: any[]) => {
    const prefix = `TSIMP ${color(name)} ${process.pid}: `
    const msg = format(...args).trim()
    console.error(prefix + msg.split('\n').join(`\n${prefix}`))
  }

export const error = getLogger('error', red)
export const warn = level > 0 ? getLogger('warn', yellow) : () => {}
export const debug =
  level > 1 ? getLogger('debug', magenta) : () => {}
export const info = level > 2 ? getLogger('info', blue) : () => {}
export const trace = getLogger('trace', green)
