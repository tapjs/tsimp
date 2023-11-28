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

export const serviceName = 'tsimp' as const
export const daemonScript = fileURLToPath(
  getUrl('./service/daemon.mjs')
)

/**
 * Client that can perform various tasks with the TSIMP Daemon
 * process.
 */
export class DaemonClient extends SockDaemonClient<
  ServiceRequest,
  ServiceResolveResult | ServiceCompileResult
> {
  /**
   * Always 'tsimp'. Used by SockDaemon to know where to put stuff.
   */
  static get serviceName() {
    return serviceName
  }

  /**
   * Path to the script that is the daemon program for node to run
   * on demand in the background.
   */
  static get daemonScript() {
    return daemonScript
  }

  /**
   * Explicitly start up the language service, used for type checking
   *
   * This is a slow operation, but it's somewhat rare that you'd need to do
   * this explicitly, since it's done on demand when needed. Mostly this is
   * for testing purposes.
   */
  async preload(req: PreloadRequest = {}): Promise<PreloadResult> {
    const { id, ...result } = await this.request({
      action: 'preload',
      ...req,
    })
    return result
  }

  /**
   * Compile the code contained in `inputFile`.
   *
   * Return the fileName that the resulting JS was written to, and a string[]
   * of diagnostics.
   */
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
