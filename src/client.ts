// only run after confirming that the daemon is ready

import { connect, Socket } from 'net'
import { resolve } from 'path'
import { catcher } from './catcher.js'
import { getCurrentDirectory } from './ts-sys-cached.js'
import { CompileResult, Request, Response } from './types.js'

const cwd = getCurrentDirectory()

const socket = resolve(cwd, '.tsimp/daemon/sock')

const pid = process.pid
let clientID = 0

export class Client {
  #msgId = 0
  #clientID = `${pid}-${clientID++}`
  #resolves = new Map<string, (r: CompileResult) => void>()
  #buffer!: Buffer
  #socket!: Socket
  #connected: boolean = false

  constructor() {
    this.#connect()
  }

  #connect() {
    this.#buffer = Buffer.alloc(0)
    this.#socket = connect(socket, () => (this.#connected = true))
    this.#socket.on('data', c => this.#onData(c))
    this.#socket.unref()
    // on error or close, just note that we're not connected.
    // we'll reconnect when needed anyway.
    this.#socket.on('close', () => (this.#connected = false))
    this.#socket.on('error', () => (this.#connected = false))
  }

  async compile(fileName: string, typeCheck: boolean) {
    if (!this.#connected) this.#connect()
    fileName = resolve(fileName)
    const id = `${this.#clientID}-${this.#msgId++}`
    const request: Request = [id, fileName, typeCheck]
    console.error('writing request:', request)
    this.#socket!.write(JSON.stringify(request))
    return new Promise<CompileResult>(res => {
      this.#resolves.set(id, res)
    })
  }

  #onData(chunk: Buffer) {
    this.#buffer = Buffer.concat([this.#buffer, chunk])
    let msgStart = 0
    while (msgStart < this.#buffer.length) {
      if (this.#buffer[msgStart] !== '['.charCodeAt(0)) {
        throw new Error(
          'invalid response: ' + this.#buffer.subarray(0, 20)
        )
      }
      for (let i = msgStart + 1; i < this.#buffer.length; i++) {
        if (this.#buffer[i] !== ']'.charCodeAt(0)) continue

        const msg = catcher(() =>
          JSON.parse(
            this.#buffer.subarray(msgStart, i + 1).toString()
          )
        )
        if (
          !msg ||
          (!Array.isArray(msg) && typeof msg[0] !== 'string') ||
          typeof msg[1] !== 'string'
        ) {
          continue
        }
        const [id, outputText, diagnostics] = msg as Response
        const resolve = this.#resolves.get(id)
        if (typeof resolve !== 'function') {
          throw new Error('response for unknown message id: ' + id)
        }
        resolve({ outputText, diagnostics })
        this.#resolves.delete(id)
        msgStart = i + 1
        break
      }
      break
    }
    this.#buffer = this.#buffer.subarray(msgStart)
  }
}
