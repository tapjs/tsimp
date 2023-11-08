/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/classify-module.ts > TAP > classify some modules > noType > must match snapshot 1`] = `
Object {
  "index.cjs": "commonjs",
  "index.cts": "commonjs",
  "index.js": "commonjs",
  "index.jsx": "commonjs",
  "index.mjs": "module",
  "index.mts": "module",
  "index.ts": "commonjs",
  "index.tsx": "commonjs",
}
`

exports[`test/classify-module.ts > TAP > classify some modules > responds to changes in package.json file > noType > must match snapshot 1`] = `
Object {
  "index.cjs": "commonjs",
  "index.cts": "commonjs",
  "index.js": "commonjs",
  "index.jsx": "commonjs",
  "index.mjs": "module",
  "index.mts": "module",
  "index.ts": "commonjs",
  "index.tsx": "commonjs",
}
`

exports[`test/classify-module.ts > TAP > classify some modules > responds to changes in package.json file > typeCommonjs > must match snapshot 1`] = `
Object {
  "index.cjs": "commonjs",
  "index.cts": "commonjs",
  "index.js": "module",
  "index.jsx": "module",
  "index.mjs": "module",
  "index.mts": "module",
  "index.ts": "module",
  "index.tsx": "module",
}
`

exports[`test/classify-module.ts > TAP > classify some modules > responds to changes in package.json file > typeModule > must match snapshot 1`] = `
Object {
  "index.cjs": "commonjs",
  "index.cts": "commonjs",
  "index.js": "module",
  "index.jsx": "module",
  "index.mjs": "module",
  "index.mts": "module",
  "index.ts": "module",
  "index.tsx": "module",
}
`

exports[`test/classify-module.ts > TAP > classify some modules > typeCommonjs > must match snapshot 1`] = `
Object {
  "index.cjs": "commonjs",
  "index.cts": "commonjs",
  "index.js": "commonjs",
  "index.jsx": "commonjs",
  "index.mjs": "module",
  "index.mts": "module",
  "index.ts": "commonjs",
  "index.tsx": "commonjs",
}
`

exports[`test/classify-module.ts > TAP > classify some modules > typeModule > must match snapshot 1`] = `
Object {
  "index.cjs": "commonjs",
  "index.cts": "commonjs",
  "index.js": "module",
  "index.jsx": "module",
  "index.mjs": "module",
  "index.mts": "module",
  "index.ts": "module",
  "index.tsx": "module",
}
`
