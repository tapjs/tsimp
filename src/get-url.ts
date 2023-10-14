import { info } from './debug.js'

// polyfilled in commonjs build
export const getUrl = (f: string) => {
  info('getUrl', f)
  //@ts-ignore
  return String(new URL(`./${f}`, import.meta.url))
}
