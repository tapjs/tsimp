import ts from 'typescript'
import { compileCache } from './caches.js'
import {start} from './timing.js'
import { tsconfig } from './tsconfig.js'

let host: ts.CompilerHost

export const compilerHost = () => {
  if (host) return host
  const done = start('compilerHost')
  const config = tsconfig()
  host = ts.createCompilerHost(config.options, true)
  // we just write to the cache when we emit files
  host.writeFile = (fileName: string, contents: string) => {
    if (!config.options.forceConsistentCasingInFileNames) {
      fileName = fileName.toLowerCase()
    }
    compileCache.set(fileName, contents)
  }
  done()
  return host
}
