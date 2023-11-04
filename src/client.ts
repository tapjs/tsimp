import { resolve } from 'path'
import { SockDaemonClient } from 'sock-daemon'
import { fileURLToPath, pathToFileURL } from 'url'
import { getUrl } from './get-url.js'
import {
  CompileResult,
  PreloadRequest,
  PreloadResult,
  ResolveResult,
  ServiceCompileResult,
  ServiceRequest,
  ServiceResolveResult,
} from './types.js'

export const serviceName = 'tsimp'
export const daemonScript = fileURLToPath(getUrl('./service/daemon.mjs'))

export class DaemonClient extends SockDaemonClient<
  ServiceRequest,
  ServiceResolveResult | ServiceCompileResult
> {
  static get serviceName() {
    return serviceName
  }
  static get daemonScript() {
    return daemonScript
  }

  async preload(req: PreloadRequest = {}): Promise<PreloadResult> {
    const { id, ...result } = await this.request({
      action: 'preload',
      ...req,
    })
    return result
  }

  async compile(
    inputFile: string,
    typeCheck: boolean,
    pretty: boolean = process.stderr.isTTY
  ): Promise<CompileResult> {
    inputFile = resolve(inputFile)
    const { fileName, diagnostics } = (await this.request({
      action: 'compile',
      fileName: String(pathToFileURL(inputFile)),
      typeCheck,
      pretty,
    })) as CompileResult
    return {
      ...(fileName ? { fileName } : {}),
      diagnostics,
    }
  }

  /**
   * Translate a file like ./src/foo.js into ./src/foo.ts
   * A file that isn't .ts or isn't a file:// url is returned as-is.
   */
  async resolve(url: string, parentURL?: string): Promise<string> {
    const { fileName } = (await this.request({
      action: 'resolve',
      url,
      parentURL,
    })) as ResolveResult
    return fileName ?? url
  }
}
