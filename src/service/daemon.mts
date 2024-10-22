import { DaemonServer } from './service.js'
const cwd = process.cwd()
/* c8 ignore start */
const home = (process.env.HOME ?? '').replace(/[\\\/]$/, '')
const d =
  home && cwd.startsWith(home) ?
    `~${cwd.substring(home.length)}`
  : cwd
/* c8 ignore stop */
process.title = 'tsimp daemon ' + d
new DaemonServer().listen()
export {}
