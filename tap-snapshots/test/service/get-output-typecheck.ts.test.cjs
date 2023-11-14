/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuY2pzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vY29tbW9uanMuY3RzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNnQixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2IsUUFBQSxPQUFPLEdBQUcsVUFBVSxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2VzbS5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ2dCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFZ0IsTUFBTSxDQUFDLEdBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vZm9vLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > mix/mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("../file.js");
require("../foo.js");
require("../esm.mjs");
require("../commonjs.cjs");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9taXgvbWl4ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDa0IsaUJBQWM7QUFDZCxzQkFBbUI7QUFDbkIscUJBQWtCO0FBQ2xCLHNCQUFtQjtBQUNuQiwyQkFBd0IifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=commonjs > mix/mixed.ts > diagnostics 1`] = `
Array [
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"chalk\\")' call instead.",
  ],
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"../esm.mjs\\")' call instead.",
  ],
]
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuY2pzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vY29tbW9uanMuY3RzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNnQixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2IsUUFBQSxPQUFPLEdBQUcsVUFBVSxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2VzbS5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ2dCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRWdCLE1BQU0sQ0FBQyxHQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFBO0FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUEifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vZm9vLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > mix/mixed.ts > compiled 1`] = `
import 'chalk';
import '../file.js';
import '../foo.js';
import '../esm.mjs';
import '../commonjs.cjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9taXgvbWl4ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ2tCLE9BQU8sT0FBTyxDQUFBO0FBQ2QsT0FBTyxZQUFZLENBQUE7QUFDbkIsT0FBTyxXQUFXLENBQUE7QUFDbEIsT0FBTyxZQUFZLENBQUE7QUFDbkIsT0FBTyxpQkFBaUIsQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=commonjs > package.json type=module > mix/mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuY2pzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1lc25leHQtcGFja2FnZS5qc29uLXR5cGUtY29tbW9uanMvY29tbW9uanMuY3RzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNnQixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2IsUUFBQSxPQUFPLEdBQUcsVUFBVSxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtZXNuZXh0LXBhY2thZ2UuanNvbi10eXBlLWNvbW1vbmpzL2VzbS5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ2dCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtZXNuZXh0LXBhY2thZ2UuanNvbi10eXBlLWNvbW1vbmpzL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFZ0IsTUFBTSxDQUFDLEdBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1lc25leHQtcGFja2FnZS5qc29uLXR5cGUtY29tbW9uanMvZm9vLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > mix/mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("../file.js");
require("../foo.js");
require("../esm.mjs");
require("../commonjs.cjs");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0LXNlcnZpY2UtZ2V0LW91dHB1dC10eXBlY2hlY2sudHMtdHNjb25maWctbW9kdWxlLWVzbmV4dC1wYWNrYWdlLmpzb24tdHlwZS1jb21tb25qcy9taXgvbWl4ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDa0IsaUJBQWM7QUFDZCxzQkFBbUI7QUFDbkIscUJBQWtCO0FBQ2xCLHNCQUFtQjtBQUNuQiwyQkFBd0IifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=commonjs > mix/mixed.ts > diagnostics 1`] = `
Array [
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"chalk\\")' call instead.",
  ],
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"../esm.mjs\\")' call instead.",
  ],
]
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuY2pzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1lc25leHQtcGFja2FnZS5qc29uLXR5cGUtbW9kdWxlL2NvbW1vbmpzLmN0cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDZ0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUNiLFFBQUEsT0FBTyxHQUFHLFVBQVUsQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtZXNuZXh0LXBhY2thZ2UuanNvbi10eXBlLW1vZHVsZS9lc20ubXRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNnQixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3JCLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUEifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtZXNuZXh0LXBhY2thZ2UuanNvbi10eXBlLW1vZHVsZS9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVnQixNQUFNLENBQUMsR0FBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQTtBQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1lc25leHQtcGFja2FnZS5qc29uLXR5cGUtbW9kdWxlL2Zvby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > mix/mixed.ts > compiled 1`] = `
import 'chalk';
import '../file.js';
import '../foo.js';
import '../esm.mjs';
import '../commonjs.cjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0LXNlcnZpY2UtZ2V0LW91dHB1dC10eXBlY2hlY2sudHMtdHNjb25maWctbW9kdWxlLWVzbmV4dC1wYWNrYWdlLmpzb24tdHlwZS1tb2R1bGUvbWl4L21peGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNrQixPQUFPLE9BQU8sQ0FBQTtBQUNkLE9BQU8sWUFBWSxDQUFBO0FBQ25CLE9BQU8sV0FBVyxDQUFBO0FBQ2xCLE9BQU8sWUFBWSxDQUFBO0FBQ25CLE9BQU8saUJBQWlCLENBQUEifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=esnext > package.json type=module > mix/mixed.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuY2pzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1ub2RlbmV4dC1wYWNrYWdlLmpzb24tdHlwZS1jb21tb25qcy9jb21tb25qcy5jdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ2dCLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDYixRQUFBLE9BQU8sR0FBRyxVQUFVLENBQUEifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtbm9kZW5leHQtcGFja2FnZS5qc29uLXR5cGUtY29tbW9uanMvZXNtLm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDZ0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNyQixNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > file.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const f = { bar: 'bar' };
console.error(f);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtbm9kZW5leHQtcGFja2FnZS5qc29uLXR5cGUtY29tbW9uanMvZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVnQixNQUFNLENBQUMsR0FBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQTtBQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > foo.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1ub2RlbmV4dC1wYWNrYWdlLmpzb24tdHlwZS1jb21tb25qcy9mb28udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > mix/mixed.ts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
require("../file.js");
require("../foo.js");
require("../esm.mjs");
require("../commonjs.cjs");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0LXNlcnZpY2UtZ2V0LW91dHB1dC10eXBlY2hlY2sudHMtdHNjb25maWctbW9kdWxlLW5vZGVuZXh0LXBhY2thZ2UuanNvbi10eXBlLWNvbW1vbmpzL21peC9taXhlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNrQixpQkFBYztBQUNkLHNCQUFtQjtBQUNuQixxQkFBa0I7QUFDbEIsc0JBQW1CO0FBQ25CLDJCQUF3QiJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=commonjs > mix/mixed.ts > diagnostics 1`] = `
Array [
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"chalk\\")' call instead.",
  ],
  Array [
    "mixed.ts",
    1479,
    "The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import(\\"../esm.mjs\\")' call instead.",
  ],
]
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > commonjs.cts > compiled 1`] = `
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
console.error('commonjs!');
exports.dialect = 'commonjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uanMuY2pzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1ub2RlbmV4dC1wYWNrYWdlLmpzb24tdHlwZS1tb2R1bGUvY29tbW9uanMuY3RzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNnQixPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ2IsUUFBQSxPQUFPLEdBQUcsVUFBVSxDQUFBIn0=
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > commonjs.cts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > esm.mts > compiled 1`] = `
console.error('esm!');
export const dialect = 'esm';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNtLm1qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtbm9kZW5leHQtcGFja2FnZS5qc29uLXR5cGUtbW9kdWxlL2VzbS5tdHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ2dCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDckIsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > esm.mts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > file.ts > compiled 1`] = `
const f = { bar: 'bar' };
console.error(f);
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Rlc3Qtc2VydmljZS1nZXQtb3V0cHV0LXR5cGVjaGVjay50cy10c2NvbmZpZy1tb2R1bGUtbm9kZW5leHQtcGFja2FnZS5qc29uLXR5cGUtbW9kdWxlL2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRWdCLE1BQU0sQ0FBQyxHQUFRLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFBO0FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUEifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > file.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > foo.ts > compiled 1`] = `
export {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vdGVzdC1zZXJ2aWNlLWdldC1vdXRwdXQtdHlwZWNoZWNrLnRzLXRzY29uZmlnLW1vZHVsZS1ub2RlbmV4dC1wYWNrYWdlLmpzb24tdHlwZS1tb2R1bGUvZm9vLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIifQ==
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > foo.ts > diagnostics 1`] = `
Array []
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > mix/mixed.ts > compiled 1`] = `
import 'chalk';
import '../file.js';
import '../foo.js';
import '../esm.mjs';
import '../commonjs.cjs';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZXN0LXNlcnZpY2UtZ2V0LW91dHB1dC10eXBlY2hlY2sudHMtdHNjb25maWctbW9kdWxlLW5vZGVuZXh0LXBhY2thZ2UuanNvbi10eXBlLW1vZHVsZS9taXgvbWl4ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ2tCLE9BQU8sT0FBTyxDQUFBO0FBQ2QsT0FBTyxZQUFZLENBQUE7QUFDbkIsT0FBTyxXQUFXLENBQUE7QUFDbEIsT0FBTyxZQUFZLENBQUE7QUFDbkIsT0FBTyxpQkFBaUIsQ0FBQSJ9
`

exports[`test/service/get-output-typecheck.ts > TAP > tsconfig module=nodenext > package.json type=module > mix/mixed.ts > diagnostics 1`] = `
Array []
`
