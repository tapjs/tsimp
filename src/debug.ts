import { format } from 'util'
import { createWriteStream } from 'node:fs'
import { mkdirSync } from 'fs'

type LogWriter = (logEntry: string) => void
let isClient = true
let logWriter: LogWriter = console.error

const useColor = () => process.stderr.isTTY && isClient

const yellow = (s: string) =>
  useColor() ? `\x1b[43;30m${s}\x1b[m` : s
const blue = (s: string) => (useColor() ? `\x1b[44;37m${s}\x1b[m` : s)
const red = (s: string) =>
  useColor() ? `\x1b[41;30;1m${s}\x1b[m` : s
const magenta = (s: string) =>
  useColor() ? `\x1b[45;30m${s}\x1b[m` : s
const green = (s: string) =>
  useColor() ? `\x1b[42;30;2m${s}\x1b[m` : s

const level = parseInt(process.env.TSIMP_DEBUG || '0', 10)

type Logger = (...args: any[]) => undefined

const getLogger =
  (name: string, color: (s: string) => string): Logger =>
  (...args: any[]) => {
    const prefix = `TSIMP ${color(name)} ${process.pid}: `
    const msg = format(...args).trim()
    logWriter(prefix + msg.split('\n').join(`\n${prefix}`))
  }

export let error: Logger
export let warn: Logger
export let debug: Logger
export let info: Logger
export let trace: Logger

const initializeLoggers = () => {
  error = getLogger('error', red)
  warn = level > 0 ? getLogger('warn', yellow) : () => {}
  debug = level > 1 ? getLogger('debug', magenta) : () => {}
  info = level > 2 ? getLogger('info', blue) : () => {}
  trace = getLogger('trace', green)
}

export const markProcessAsDaemon = () => {
  if (isClient) {
    isClient = false
    mkdirSync('.tsimp/daemon', { recursive: true })
    const writeStream = createWriteStream('.tsimp/daemon/log', {
      flags: 'a',
    })
    logWriter = text => writeStream.write(`${text}\n`)
    initializeLoggers()
  }
}

initializeLoggers()
