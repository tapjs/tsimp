/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("./file.js");
require("./foo.js");
require("./esm.mjs");
require("./commonjs.cjs");
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=false > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("./file.js");
require("./foo.js");
require("./esm.mjs");
require("./commonjs.cjs");
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > typeCheck=true > mixed.ts > diagnostics 1`] = `
Array [
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"chalk\\")' call instead.",
  ],
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"./esm.mjs\\")' call instead.",
  ],
]
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > mixed.ts > compiled 1`] = `
import 'chalk';
import './file.js';
import './foo.js';
import './esm.mjs';
import './commonjs.cjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=false > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > mixed.ts > compiled 1`] = `
import 'chalk';
import './file.js';
import './foo.js';
import './esm.mjs';
import './commonjs.cjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=commonjs > package.json type=module > typeCheck=true > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("./file.js");
require("./foo.js");
require("./esm.mjs");
require("./commonjs.cjs");
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=false > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("./file.js");
require("./foo.js");
require("./esm.mjs");
require("./commonjs.cjs");
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=commonjs > typeCheck=true > mixed.ts > diagnostics 1`] = `
Array [
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"chalk\\")' call instead.",
  ],
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"./esm.mjs\\")' call instead.",
  ],
]
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > mixed.ts > compiled 1`] = `
import 'chalk';
import './file.js';
import './foo.js';
import './esm.mjs';
import './commonjs.cjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=false > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > mixed.ts > compiled 1`] = `
import 'chalk';
import './file.js';
import './foo.js';
import './esm.mjs';
import './commonjs.cjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=esnext > package.json type=module > typeCheck=true > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("./file.js");
require("./foo.js");
require("./esm.mjs");
require("./commonjs.cjs");
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=false > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("./file.js");
require("./foo.js");
require("./esm.mjs");
require("./commonjs.cjs");
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > typeCheck=true > mixed.ts > diagnostics 1`] = `
Array [
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"chalk\\")' call instead.",
  ],
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"./esm.mjs\\")' call instead.",
  ],
]
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > mixed.ts > compiled 1`] = `
import 'chalk';
import './file.js';
import './foo.js';
import './esm.mjs';
import './commonjs.cjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=false > mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > mixed.ts > compiled 1`] = `
import 'chalk';
import './file.js';
import './foo.js';
import './esm.mjs';
import './commonjs.cjs';
//# sourceMappingURL=
`

exports[`test/service/compile.ts > TAP > tsconfig module=nodenext > package.json type=module > typeCheck=true > mixed.ts > diagnostics 1`] = `
Array []
`
