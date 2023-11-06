// polyfilled in commonjs build
import { createRequire } from 'module'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

//@ts-ignore
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const inDist = __dirname === resolve(__dirname, '../../dist/esm')
//@ts-ignore
const req = createRequire(import.meta.url)

export const requireCommonJSLoad = () =>
  req(
    inDist
      ? resolve(__dirname, '../commonjs/service/load.js')
      : resolve(__dirname, '../dist/commonjs/service/load.js')
  ) as typeof import('./service/load.js')
