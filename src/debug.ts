import { format } from 'util'

const yellow = (s: string) =>
  process.stderr.isTTY ? `\x1b[43;30m${s}\x1b[m` : s
const blue = (s: string) =>
  process.stderr.isTTY ? `\x1b[44;37m${s}\x1b[m` : s
const red = (s: string) =>
  process.stderr.isTTY ? `\x1b[41;30m${s}\x1b[m` : s

const level = parseInt(process.env.TSIMP_DEBUG || '0', 10)

export const warn =
  level > 0
    ? (...args: any[]) => {
        const prefix = `TSIMP ${red('warn')} ${process.pid}: `
        const msg = format(...args).trim()
        console.error(prefix + msg.split('\n').join(`\n${prefix}`))
      }
    : () => {}

export const debug =
  level > 1
    ? (...args: any[]) => {
        const prefix = `TSIMP ${yellow('debug')} ${process.pid}: `
        const msg = format(...args).trim()
        console.error(prefix + msg.split('\n').join(`\n${prefix}`))
      }
    : () => {}

export const info =
  level > 2
    ? (...args: any[]) => {
        const prefix = `TSIMP ${blue('info')} ${process.pid}: `
        const msg = format(...args).trim()
        console.error(prefix + msg.split('\n').join(`\n${prefix}`))
      }
    : () => {}
