import { resolve } from 'path'
import { fileURLToPath } from 'url'

let entry: string
/* c8 ignore start */
const proc = (globalThis.process ?? {
  _forceRepl: false,
  argv: [],
}) as NodeJS.Process & {
  argv: string[]
  _forceRepl: boolean
  _eval?: string
}
/* c8 ignore stop */

/**
 * Get the main script for this process
 */
export const entryModule = () => {
  if (entry) return entry
  if (
    //@ts-ignore
    typeof repl !== 'undefined' ||
    proc._forceRepl
  ) {
    return (entry = resolve('<repl>'))
  }
  const mod = proc.argv[1]
  if ('_eval' in proc || !mod) return (entry = resolve('<eval>'))
  if (mod.startsWith('file://')) return (entry = fileURLToPath(mod))
  return resolve(mod)
}
