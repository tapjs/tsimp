// This is the service that powers the loader hooks.
// It communicates over the MessageChannel that is created either in
// the globalPreload hook or the import script.
// The load and resolve hooks ask it for their return values.

import { fileURLToPath, pathToFileURL } from 'node:url'
import type { MessagePort } from 'node:worker_threads'
import {info} from './debug.js'
import fail from './fail.js'
import { getTranspiledFileName } from './get-transpiled-filename.js'
import { load } from './load.js'
import { resolveModuleName } from './resolve-module-name.js'
import {start} from './timing.js'

export type ServiceLoadRequest = {
  action: 'load'
  url: string
  id: string
}
export type ServiceResolveRequest = {
  action: 'resolve'
  url: string
  parentURL: string
  id: string
}
export type ServiceRequest =
  | ServiceResolveRequest
  | ServiceLoadRequest

export type ServiceResponse = ServiceRequest & {
  // undefined response means it's not something we're handling
  response: string | undefined
}

export const isServiceRequest = (m: any): m is ServiceRequest =>
  !!m &&
  typeof m === 'object' &&
  ((m.action === 'resolve' && typeof m.parentURL === 'string') ||
    (m.action === 'load' && m.parentURL === undefined)) &&
  typeof m.url === 'string' &&
  typeof m.id === 'string'

export const isServiceResponse = (m: any): m is ServiceResponse =>
  isServiceRequest(m) &&
  Object.keys(m).includes('response') &&
  (typeof (m as ServiceResponse).response === 'string' ||
    typeof (m as ServiceResponse).response === 'undefined')

export class Service {
  listen(port: MessagePort) {
    const done = start('service: listen')
    info('SERVICE LISTEN', port)
    port.on('message', async msg => {
      if (!isServiceRequest(msg)) return
      // any throws should cause a crash elsewhere, fail just in case
      /* c8 ignore start */
      const r = await this.handle(msg).catch(e => fail(e.message))
      /* c8 ignore stop */
      const response = r === undefined ? undefined : r
      const sr: ServiceResponse = { ...msg, response }
      port.postMessage(sr)
    })
    port.ref = () => {
      throw new Error('do not ref this')
    }
    port.unref()
    done()
  }

  async handle(msg: ServiceRequest) {
    return msg.action === 'resolve'
      ? this.resolve(msg)
      : this.load(msg)
  }

  async resolve(req: ServiceResolveRequest) {
    const done = start('service: resolve')
    const { url, parentURL } = req
    const fileName = fileURLToPath(url)
    const fromPath = fileURLToPath(parentURL)
    info('SERVICE RESOLVE', {
      url,
      parentURL,
      fileName,
      fromPath,
    })
    // compile the code here, and then return the outFile path
    const resolvedSource = resolveModuleName(fileName, fromPath)
    info(resolvedSource)
    if (
      !resolvedSource?.resolvedModule ||
      resolvedSource.resolvedModule.isExternalLibraryImport ||
      resolvedSource.resolvedModule.extension === '.d.ts' ||
      resolvedSource.resolvedModule.extension === '.js'
    ) {
      // not one of ours, or not something to be transpiled.
      // XXX: should we do something with external modules if
      // skipLibCheck is not true?
      done()
      return undefined
    }

    // compile now so it's cached and ready for the load coming next
    const outFile = String(
      pathToFileURL(
        getTranspiledFileName(
          resolvedSource.resolvedModule.resolvedFileName
        )
      )
    )
    info('resolve', { url, outFile })
    load(outFile)
    done()
    return outFile
  }

  async load({ url }: ServiceLoadRequest) {
    const done = start('service: load')
    const result = load(url)
    done()
    return result
  }
}
