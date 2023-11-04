import { resolve } from 'path'
import { SockDaemonClient } from 'sock-daemon'
import { fileURLToPath, pathToFileURL } from 'url'
import { DiagMode, getDiagMode } from './diagnostic-mode.js'
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
export const daemonScript = fileURLToPath(
  getUrl('./service/daemon.mjs')
)

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
    diagMode: DiagMode = getDiagMode(),
    pretty: boolean = !!process.stderr.isTTY
  ): Promise<CompileResult> {
    inputFile = resolve(inputFile)
    const { fileName, diagnostics } = (await this.request({
      action: 'compile',
      fileName: String(pathToFileURL(inputFile)),
      diagMode,
      pretty,
    })) as CompileResult
    if (diagMode === 'ignore') {
      diagnostics.length = 0
    }
    if ((diagMode === 'error' && diagnostics.length) || !fileName) {
      return { diagnostics }
    }
    return {
      fileName,
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
