// load the transpiled code for a module
import { readFileSync, Stats, statSync } from 'fs'
import { fileURLToPath } from 'url'
import { compileCache, mtimeCache, sourceCache } from './caches.js'
import { info } from './debug.js'
import { report } from './diagnostic.js'
import fail from './fail.js'
import { getSourceFileName } from './get-source-filename.js'
import { program } from './program.js'
import { start } from './timing.js'
import { tsconfig } from './tsconfig.js'

const statCache = new Map<string, Stats>()
const config = tsconfig()

const key = (fileName: string): string =>
  config.options.forceConsistentCasingInFileNames
    ? fileName
    : fileName.toLowerCase()

export const load = (outFile: string | URL) => {
  const done = start('load')
  if (typeof outFile === 'object' || outFile.startsWith('file://')) {
    info('load url', outFile)
    outFile = fileURLToPath(outFile)
  }

  const fileName = getSourceFileName(outFile)
  info('load fileName', { outFile, fileName })

  const st = statCache.get(fileName) || statSync(fileName)
  statCache.set(fileName, st)
  const mtime = Number(st.mtime)
  const fromCache = compileCache.get(key(outFile))
  const actualSource = readFileSync(fileName, 'utf8')

  // mtime matches, just accept what we did last time
  if (fromCache) {
    if (mtime === mtimeCache.get(fileName)) {
      done()
      return fromCache
    }

    // file touched, but might not be modified
    if (actualSource === sourceCache.get(fileName)) {
      // mtime will match next time
      mtimeCache.set(fileName, mtime)
      done()
      return fromCache
    }
  }

  // need to parse the file
  compileCache.delete(key(outFile))
  const prog = program()
  const sf = prog.getSourceFile(fileName)
  if (!sf) {
    sourceCache.delete(fileName)
    mtimeCache.delete(fileName)
    done()
    throw new Error('failed to load source file: ' + fileName)
  }

  const emitResult = prog.emit(sf)
  for (const d of emitResult.diagnostics) report(d)
  const result = compileCache.get(key(outFile))
  if (!result) {
    done()
    throw fail('failed to transpile: ' + fileName)
  }

  // these will match next time.
  sourceCache.set(fileName, actualSource)
  mtimeCache.set(fileName, mtime)
  done()
  return result
}
