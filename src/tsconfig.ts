// load the appropriate tsconfig.json file, and apply the tsimp
// section overrides to it, if found.
import { statSync } from 'fs'
import { dirname, resolve } from 'path'
import ts from 'typescript'
import { walkUp } from 'walk-up-path'
import { entryModule } from './entry-module.js'
import fail from './fail.js'

const filename = process.env.TSIMP_PROJECT || 'tsconfig.json'

let loadedConfig: ts.ParsedCommandLine

// ms between checks to make sure the config hasn't changed.
const STAT_FREQ = 100
let lastStat: number
let mtime: number = -1
let configPath: string

// XXX it's a bit weird to make tsconfig walk up from the entryModule
// if this is a long-lived service, then that will certainly change?
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
  for (const dir of walkUp(dirname(entryModule()))) {
    configPath = resolve(dir, filename)
    const readResult = ts.readConfigFile(configPath, ts.sys.readFile)
    const {
      error,
      config: { tsimp, ...config },
    } = readResult
    if (error) {
      // cannot read file, keep looking
      if (error.code === 5083) continue
      fail('could not load config file', error)
    }

    mtime = Number(statSync(configPath).mtime)
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
          jsx: ts.JsxEmit.Preserve,
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
    return (loadedConfig = ts.parseJsonConfigFileContent(
      res,
      ts.sys,
      dir
    ))
  }
  throw fail(
    `could not find config file named "${filename}", searching from "${entryModule()}"`
  )
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
