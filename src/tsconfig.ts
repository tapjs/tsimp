// load the appropriate tsconfig.json file, and apply the tsimp
// section overrides to it, if found.
import { dirname, resolve } from 'path'
import ts from 'typescript'
import { walkUp } from 'walk-up-path'
import { entryModule } from './entry-module.js'
import fail from './fail.js'

const filename = process.env.TSIMP_PROJECT || 'tsconfig.json'

let loadedConfig: ts.ParsedCommandLine
export const tsconfig = () => {
  if (loadedConfig) return loadedConfig
  for (const dir of walkUp(dirname(entryModule()))) {
    const configPath = resolve(dir, filename)
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
    if (tsimp) applyOverrides(config, tsimp)
    const res = applyOverrides(
      // default rootDir to the folder containing tsconfig, if not
      // set explicitly to something else, so we always have one.
      { compilerOptions: { rootDir: dir } },
      applyOverrides(tsimp ? applyOverrides(config, tsimp) : config, {
        compilerOptions: {
          // virtual folder, nothing actually written to disk ever
          outDir: resolve('.tsimp-compiled'),
          sourceMap: true,
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
