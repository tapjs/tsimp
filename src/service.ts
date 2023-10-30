// define the client and server for the persistent daemon that
// does the compilation for the loader hooks.
import { parse } from 'node:path'
import { pathToFileURL } from 'node:url'
import { SockDaemonServer } from 'sock-daemon'
import { fileURLToPath } from 'url'
import { getUrl } from './get-url.js'
import { getLanguageService } from './language-service.js'
import { load } from './load.js'
import { fileExists } from './ts-sys-cached.js'
import {
  CompileResult,
  PreloadResult,
  ResolveResult,
  ServiceCompileRequest,
  ServiceCompileResult,
  ServicePreloadRequest,
  ServiceRequest,
  ServiceResolveRequest,
  ServiceResolveResult,
} from './types.js'

export const serviceName = 'tsimp'
export const daemonScript = fileURLToPath(getUrl('./daemon.mjs'))

const equivalents = new Map([
  ['.js', ['.ts', '.tsx']],
  ['.jsx', ['.tsx']],
  ['.cjs', ['.cts']],
  ['.mjs', ['.mts']],
])
const allTsExts = ['.ts', '.tsx', '.mts', '.cts']

const findTsFile = (url: string | URL) => {
  if (String(url).startsWith('file://')) {
    const fileName = fileURLToPath(url)
    const { ext } = parse(fileName)
    const exts = equivalents.get(ext)
    const checks = allTsExts.includes(ext)
      ? []
      : exts
      ? exts.map(
          tsExt =>
            fileName.substring(0, fileName.length - ext.length) +
            tsExt
        )
      : allTsExts.map(tsExt => fileName + tsExt)
    checks.unshift(fileName)
    for (const tsFile of [fileName, ...checks]) {
      if (fileExists(tsFile)) {
        return tsFile
      }
    }
  }
}

export class DaemonServer extends SockDaemonServer<
  ServiceRequest,
  ServiceResolveResult | ServiceCompileResult
> {
  static get serviceName() {
    return serviceName
  }

  #handlePreload(_: ServicePreloadRequest): PreloadResult {
    getLanguageService().getProgram()
    return {}
  }

  #handleCompile(request: ServiceCompileRequest): CompileResult {
    const fileName = findTsFile(request.fileName)
    if (!fileName) {
      throw new Error(
        'failed to resolve typescript source for ' + request.fileName
      )
    }
    return load(fileName, request.typeCheck, request.pretty)
  }

  #handleResolve(request: ServiceResolveRequest): ResolveResult {
    const { url, parentURL } = request
    const target =
      url.startsWith('./') || url.startsWith('../')
        ? String(new URL(url, parentURL))
        : url
    if (target.startsWith('file://')) {
      const tsFile = findTsFile(target)
      if (tsFile) {
        const ret = String(pathToFileURL(tsFile))
        return { fileName: ret }
      }
    }
    return {}
  }

  handle(
    request:
      | ServiceCompileRequest
      | ServiceResolveRequest
      | ServicePreloadRequest
  ) {
    switch (request.action) {
      case 'compile':
        return this.#handleCompile(request)
      case 'resolve':
        return this.#handleResolve(request)
      case 'preload':
        return this.#handlePreload(request)
    }
  }
}
