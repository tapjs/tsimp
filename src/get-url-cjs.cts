// this has to return the ESM urls, because --loader is always
// loaded in type=module mode.
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const inDist =
  __filename === resolve(__dirname, '../commonjs/get-url.js')

export const getUrl = (f: string) =>
  // polyfill sometimes confuses v8 coverage API
  /* c8 ignore start */
  String(pathToFileURL(resolve(__dirname, inDist ? '../esm' : '', f)))
/* c8 ignore stop */
