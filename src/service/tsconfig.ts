// load the appropriate tsconfig.json file, and apply the tsimp
// section overrides to it, if found.
// This is designed to be called on demand. It will automatically reload
// the config if the mtime of the located config file changes, and always
// return the same object if it parses to the same values.
import { catcher } from '@isaacs/catcher'
import { statSync } from 'fs'
import { resolve } from 'path'
import ts from 'typescript'
import { walkUp } from 'walk-up-path'
import { error, warn } from '../debug.js'
import { report } from './diagnostic.js'
import { readFile } from '../ts-sys-cached.js'

const cwd = process.cwd()
const filename = process.env.TSIMP_PROJECT || 'tsconfig.json'

let loadedConfig: ts.ParsedCommandLine
let loadedConfigJSON: string

// ms between checks to make sure the config hasn't changed.
// overridable just so we can test it without waiting 100ms per test
// in practice, this is more than fast enough for most cases.
/* c8 ignore start */
const STAT_FREQ = Number(process.env.TSIMP_CONFIG_DEBOUNCE ?? 100) || 100
/* c8 ignore stop */
let lastStat: number = -1 * STAT_FREQ
let mtime: number = -1
let configPath: string

export const tsconfig = () => {
  // reload the config when the file mtime changes.
  if (loadedConfig && configPath) {
    if (performance.now() - lastStat > STAT_FREQ) {
      // if the stat fails, that's a change to the file.
      const m = catcher(() => Number(statSync(configPath).mtime))
      if (m === mtime) {
        lastStat = performance.now()
        return loadedConfig
      }
    } else {
      return loadedConfig
    }
  }

  for (const dir of walkUp(cwd)) {
    configPath = resolve(dir, filename)
    const readResult = ts.readConfigFile(configPath, readFile)
    const {
      error,
      config: { tsimp, ...config },
    } = readResult
    if (error) {
      // cannot read file, keep looking
      /* c8 ignore start */
      if (error.code !== 5083) {
        warn('could not load config file', configPath, report(error))
      }
      /* c8 ignore stop */
      continue
    }

    // will definitely have it, because we got a result
    mtime = Number(readFile.mtimeCache.get(configPath)?.[0])
    lastStat = performance.now()

    const res = applyOverrides(
      // default rootDir to the folder containing tsconfig, if not
      // set explicitly to something else, so we always have one.
      // also default to recommended setting for node programs
      {
        compilerOptions: {
          rootDir: dir,
          module: 'nodenext',
          moduleResolution: 'nodenext',
          skipLibCheck: true,
          isolatedModules: true,
          esModuleInterop: true,
          lib: ['es2023'],
          target: 'es2022',
          strict: true,
          forceConsistentCasingInFileNames: true,
          // defaults that ts uses when transpiling
          jsx: ts.JsxEmit.Preserve,
        },
      },
      applyOverrides(tsimp ? applyOverrides(config, tsimp) : config, {
        compilerOptions: {
          // settings that tsimp depends on, cannot be overridden
          // virtual folder, nothing actually written to disk ever
          outDir: resolve('.tsimp-compiled'),
          sourceMap: undefined,
          inlineSourceMap: true,
          inlineSources: false,
          declarationMap: false,
          declaration: false,
          noEmit: false,
        },
      })
    )
    const newConfig = ts.parseJsonConfigFileContent(res, ts.sys, dir)
    const newConfigJSON = JSON.stringify(newConfig)
    if (loadedConfig && newConfigJSON === loadedConfigJSON) {
      // no changes, keep the old one
      return loadedConfig
    }
    newConfig.options.configFilePath = configPath
    loadedConfigJSON = newConfigJSON
    return (loadedConfig = newConfig)
  }
  error(
    `could not find config file named "${filename}", searching from "${cwd}"`
  )
  process.exit(1)
}

const applyOverrides = (config: any, overrides?: any): any => {
  if (
    !overrides ||
    typeof overrides !== 'object' ||
    Array.isArray(overrides) ||
    !config ||
    typeof config !== 'object' ||
    Array.isArray(config)
  ) {
    return overrides
  }
  return {
    ...overrides,
    ...Object.fromEntries(
      Object.entries(config)
        .map(([k, v]) => [
          k,
          k in overrides ? applyOverrides(v, overrides[k]) : v,
        ])
        .filter(([_, v]) => v !== undefined)
    ),
  }
}
