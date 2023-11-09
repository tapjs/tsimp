// load the appropriate tsconfig.json file, and apply the tsimp
// section overrides to it, if found.
// This is designed to be called on demand. It will automatically reload
// the config if the mtime of the located config file changes, and always
// return the same object if it parses to the same values.
import { statSync } from 'fs'
import { resolve } from 'path'
import ts from 'typescript'
import { walkUp } from 'walk-up-path'
import { error, warn } from '../debug.js'
import { report } from './diagnostic.js'
import { getCurrentDirectory, readFile } from './ts-sys-cached.js'

const filename = process.env.TSIMP_PROJECT || 'tsconfig.json'

let loadedConfig: ts.ParsedCommandLine
let loadedConfigJSON: string

// ms between checks to make sure the config hasn't changed.
const STAT_FREQ = 100
let lastStat: number
let mtime: number = -1
let configPath: string

export const tsconfig = () => {
  // reload the config when the file mtime changes.
  if (loadedConfig && configPath) {
    if (performance.now() - lastStat > STAT_FREQ) {
      // if the stat fails, that's a change to the file.
      try {
        const m = Number(statSync(configPath).mtime)
        if (m === mtime) {
          lastStat = performance.now()
          return loadedConfig
        }
      } catch {}
    } else {
      return loadedConfig
    }
  }

  for (const dir of walkUp(getCurrentDirectory())) {
    configPath = resolve(dir, filename)
    const readResult = ts.readConfigFile(configPath, readFile)
    const {
      error,
      config: { tsimp, ...config },
    } = readResult
    if (error) {
      // cannot read file, keep looking
      if (error.code !== 5083) {
        warn('could not load config file', configPath, report(error))
      }
      continue
    }

    // will definitely have it, because we got a result
    mtime = Number(readFile.mtimeCache.get(configPath))
    lastStat = performance.now()

    if (tsimp) applyOverrides(config, tsimp)
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
          jsx: 1, // ts.JsxEmit.Preserve
        },
      },
      applyOverrides(tsimp ? applyOverrides(config, tsimp) : config, {
        compilerOptions: {
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
    `could not find config file named "${filename}", searching from "${getCurrentDirectory()}"`
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
