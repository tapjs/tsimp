// one compiler daemon should be instantiated per project
// folder where compilations will be done.
// this is started on demand as a detached node process

import { mkdirpSync } from 'mkdirp'
import {
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { createConnection, createServer } from 'node:net'
import { resolve } from 'node:path'
import { onExit } from 'signal-exit'
import { catcher } from './catcher.js'
import { load } from './load.js'
import { getCurrentDirectory } from './ts-sys-cached.js'
import { ReadyState } from './types.js'

const reportReady = (state: ReadyState) => console.log(state)

const cwd = getCurrentDirectory()
mkdirpSync(resolve(cwd, '.tsimp/daemon'))
const socket = resolve(cwd, '.tsimp/daemon/sock')
const pidFile = resolve(cwd, '.tsimp/daemon/pid')

// if the socket and pid exist, and the service can be connected to,
// then no need for another one, so just quit.
const sockExists = catcher(() => statSync(socket).isSocket(), false)
const pidExists = catcher(() => statSync(pidFile).isFile(), false)

if (sockExists && pidExists) {
  await new Promise<void>(res => {
    // if we get an error
    const conn = createConnection(socket)
    conn.setTimeout(10)
    conn.on('error', () => {
      conn.destroy()
      res()
    })
    conn.on('timeout', () => {
      conn.destroy()
      res()
    })
    const id = `daemon-${process.pid}`
    conn.on('data', c => {
      if (String(c) === `["${id}","PONG"]`) {
        reportReady('ALREADY RUNNING')
        process.exit()
      } else {
        conn.destroy()
        res()
      }
    })
    conn.write(`["${id}","PING"]`)
  })
}

// got here, means prior incarnation not responding or not running.
// if there's a socket, give it a chance to close, just in case.
const formerPid = catcher(() => Number(readFileSync(pidFile, 'utf8')))
if (typeof formerPid === 'number') {
  const signal = sockExists ? 'SIGHUP' : 'SIGTERM'
  const sigRes = catcher(() => process.kill(formerPid, signal), false)
  if (sockExists && sigRes) {
    await new Promise<void>(r => setTimeout(r, 100))
    catcher(() => process.kill(formerPid, 'SIGTERM'))
  }
}
writeFileSync(pidFile, String(process.pid))
catcher(() => unlinkSync(socket))

// ok! the way is clear for us to listen
const server = createServer(conn => {
  console.error('new connection')
  let buf: Buffer
  conn.setTimeout(1000)
  conn.on('timeout', () => conn.destroy())
  conn.on('data', chunk => {
    idleTimer()
    buf = buf ? Buffer.concat([buf, chunk]) : chunk
    let msgStart = 0
    while (msgStart < buf.length) {
      if (buf[msgStart] !== '['.charCodeAt(0)) {
        console.error('invalid message', buf.subarray(0, 40).toString())
        conn.end('["","error","invalid message"]')
        return
      }
      for (let i = msgStart + 1; i < buf.length; i++) {
        if (buf[i] !== ']'.charCodeAt(0)) {
          continue
        }

        console.error('found message end at', i)
        const msg = catcher(() =>
          JSON.parse(buf.subarray(msgStart, i + 1).toString())
        )
        console.error('message', msg)
        if (
          !msg ||
          (!Array.isArray(msg) && typeof msg[0] !== 'string') ||
          typeof msg[1] !== 'string'
        ) {
          console.error('not message', msg)
          continue
        }
        if (msg[1] === 'PING' && msg.length === 2) {
          conn.write(JSON.stringify([msg[0], 'PONG']))
        } else if (typeof msg[2] === 'boolean') {
          const { outputText, diagnostics } = load(msg[1], msg[2])
          conn.write(
            JSON.stringify([msg[0], outputText, diagnostics])
          )
        }
        msgStart = i + 1
        break
      }
      break
    }
    buf = buf.subarray(msgStart)
  })
})

server.listen(socket, () => reportReady('READY'))

const gracefulExit = () => {
  server.close()
  catcher(() => unlinkSync(pidFile))
}
onExit(gracefulExit)
process.on('SIGHUP', gracefulExit)

// if no requests for 1 hour, shut down
const idleTimeout = 1000 * 60 * 60
let timer: NodeJS.Timeout
const idleTimer = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(gracefulExit, idleTimeout)
  timer.unref()
}

// mostly just for testing, if we open it up directly
// I keep pressing ^D and expecting that to close it
if (process.stdin.isTTY) {
  process.openStdin()
  process.stdin.on('end', () => gracefulExit())
}

export {}
