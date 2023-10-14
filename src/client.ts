// the client used by loaders to talk to the service on the other side
// of a MessageChannel
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { MessagePort } from 'node:worker_threads'
import { info } from './debug.js'
import {
  isServiceResponse,
  ServiceRequest,
  ServiceResponse,
} from './service.js'
import { start } from './timing.js'

// it's just a gut-check, don't need cryptographic security
const idPref = String(Math.random())
let idCount = 0
const getId = () => `${idPref}_${idCount++}`

export class Client {
  #port: MessagePort
  #requests: Map<string, (res: ServiceResponse) => void> = new Map()
  constructor(port: MessagePort) {
    this.#port = port
    this.#port.on('message', msg => this.#receive(msg))
    this.#port.unref()
  }

  #receive(msg: any) {
    info('CLIENT RECEIVE', msg)
    if (!isServiceResponse(msg)) {
      info('CLIENT MSG IS NOT RESPONSE')
      return
    }
    const resolve = this.#requests.get(msg.id)
    // unpossible
    /* c8 ignore start */
    if (!resolve) {
      info('CLIENT UNKNOWN RESPONSE')
      return
    }
    /* c8 ignore stop */
    this.#requests.delete(msg.id)
    if (this.#requests.size === 0) {
      this.#port.unref()
      info('all requests done, unref')
    } else {
      info('stay reffed', this.#requests.size)
    }
    resolve(msg)
  }

  async #fetch(msg: ServiceRequest) {
    info('CLIENT FETCH', msg)
    return new Promise<ServiceResponse>(resolve => {
      this.#requests.set(msg.id, resolve)
      this.#port.ref()
      this.#port.postMessage(msg)
    })
  }

  async load(url: string) {
    if (!url.startsWith('file://')) return undefined
    const done = start('client: load')
    const { response } = await this.#fetch({
      action: 'load',
      url,
      id: getId(),
    })
    done()
    return response
  }

  async resolve(
    url: string,
    parentURL: string = String(pathToFileURL(resolve('x')))
  ) {
    if (!url.startsWith('file://')) return undefined
    const done = start('client: resolve')
    const res = await this.#fetch({
      action: 'resolve',
      url,
      parentURL,
      id: getId(),
    })
    info('CLIENT RESOLVE', res)
    done()
    return res
  }
}
