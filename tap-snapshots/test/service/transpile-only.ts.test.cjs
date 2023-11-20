/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=false > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=false > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=false > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=false > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=false > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=true > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=true > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=true > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=true > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > vms=true > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=false > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=false > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=false > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=false > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=false > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=true > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=true > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=true > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const foo_js_1 = require("./foo.js");
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import { Foo } from './foo.js';
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "noForce": String(
    import { Foo } from './foo.js';
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=true > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=commonjs > package.json type=module > vms=true > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=false > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=false > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=false > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=false > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=false > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=true > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=true > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=true > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=true > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=commonjs > vms=true > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=false > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=false > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=false > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=false > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=false > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=true > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=true > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=true > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=true > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=esnext > package.json type=module > vms=true > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=false > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=false > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=false > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=false > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=false > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=true > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=true > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=true > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=true > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > vms=true > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=false > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=false > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=false > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=false > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=false > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=true > commonjs.cts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dialect = void 0;
    console.error('commonjs!');
    exports.dialect = 'commonjs';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=true > esm.mts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "forceESM": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
  "noForce": String(
    console.error('esm!');
    export const dialect = 'esm';
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=true > file.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const f = { bar: 'bar' };
    console.error(f);
    //# sourceMappingURL=
  ),
  "forceESM": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    const f = { bar: 'bar' };
    console.error(f);
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=true > foo.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //# sourceMappingURL=
  ),
  "forceESM": String(
    export {};
    //# sourceMappingURL=
  ),
  "noForce": String(
    export {};
    //# sourceMappingURL=
  ),
}
`

exports[`test/service/transpile-only.ts > TAP > tsconfig module=nodenext > package.json type=module > vms=true > mix/mixed.ts > outputs 1`] = `
Object {
  "forceCommonJS": String(
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("chalk");
    require("../file.js");
    require("../foo.js");
    require("../esm.mjs");
    require("../commonjs.cjs");
    //# sourceMappingURL=
  ),
  "forceESM": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
  "noForce": String(
    import 'chalk';
    import '../file.js';
    import '../foo.js';
    import '../esm.mjs';
    import '../commonjs.cjs';
    //# sourceMappingURL=
  ),
}
`
