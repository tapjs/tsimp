# tsimp 😈

A TypeScript IMPort loader for Node.js

## What It Is

This is an importer that runs Node.js programs written in
TypeScript, using the official TypeScript implementation from
Microsoft.

It is designed to support full typechecking support, with
acceptable performance when used repeatedly (for example, in a
test suite which spawns many TS processes).

## Why Is It

There are quite a few TypeScript loaders and compilers available!
Which one should you choose, and why did I need to create this
one?

- [swc](https://swc.rs) is a TypeScript compiler implementation
  in Rust
- [tsx](https://npmjs.com/package/tsx) is a zero-config
  TypeScript executer that aims to be a drop-in replacement for
  node, powered by esbuild.
- [ts-node](https://npmjs.com/package/ts-node) is probably the
  most established of these, with a huge feature set and support
  for every version of node and TypeScript you could possibly
  want.

How this differs:

- It uses the TypeScript implementation from Microsoft as its
  compiler. No shade towards swc and esbuild, they're fast and
  can do a lot, but the goal of `tsimp` is strict consistency
  with the "official" `tsc` program, and just using it is the
  simplest way to do that.
- It supports the `--import` and `Module.register()` behavior
  added in node v20.6, only falling back to warning-laden
  experimental APIs when that's not available.
- Type checking is enabled by default, so no need to run an extra
  `tsc --noEmit` step after running tests, using a persistent
  [sock daemon](https://isaacs.github.io/sock-daemon) and a
  generous amount of caching to make it performant.
- It's just a module loader, not a bunch of other things. So
  there's no repl, no bundler, etc. Pretty much all it does is
  make TypeScript modules in Node work.

## USAGE

Install `tsimp` with npm:

```
npm install tsimp
```

Run TypeScript programs like this in node v20.6 and higher:

```
node --import=tsimp/import my-typescript-program.ts
```

Or like this in Node versions prior to v20.6:

```
node --loader=tsimp/loader my-typescript-program.ts
```

Or you can use `tsimp` as the executable to run your program (but
the import/loader is ~100ms faster because it doesn't incur an
extra `spawn` call):

```
tsimp my-typescript-program.ts
```

Note that while `tsimp` run without any arguments will start the
Node repl, and in that context it will be able to import/require
typescript modules, it does _not_ include a repl that can run
TypeScript directly. This is just an import loader.

In Node v20.6 and higher, you can also load `tsimp` in your
program, and from that point forward, TypeScript modules will
Just Work.

Note that `import` declarations happen in parallel *before* the
code is executed, so you'll need to split it up like this:

```js
import 'tsimp'
// has to be done as an async import() so that it occurs
// after the tsimp import is finished. But any imports that the
// typescript program does can be "normal" top level imports.
const { SomeThing } = await import('./some-thing.ts')
```

By comparison, this won't work, because the imports happen in
parallel.

```
import 'tsimp'
import { SomeThing } from './some-thing.ts'
```

CommonJS `require()` is patched as well. To use `tsimp` in
CommonJS programs, you can run it as described above, or
`require()` it in your program.

```js
//commonjs
require('tsimp')
// now typescript can be loaded
require('./blah.ts')
```

In Node version 20.6 and higher, this will also attach the
required loaders for ESM import support. In earlier Node
versions, you _must_ use `--loader=tsimp/loader` for ESM support.

### File Extensions, Module Resolution, etc.

The same rules for file extensions, module resolution, and
everything else apply when using `tsimp` as when using `tsc`.

That is, if you're running in ESM mode, you may need to write
your imports ending in `.js` even though the actual file on disk
is `.ts`, because that's how TS does it.

## Configuration

Most configuration is done by looking to the nearest
`tsconfig.json` file at or above the module entry point in the
folder tree.

You can use a different filename by setting
`TSIMP_PROJECT=<filename>` in the environment.

If there is a `tsimp` field in the tsconfig json file, then that
will override anything else in the file. For example:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "declaration": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": true,
    "jsx": "react",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "noUncheckedIndexedAccess": true,
    "resolveJsonModule": true,
    "skipLibCheck": false,
    "sourceMap": false,
    "strict": true,
    "target": "es2022"
  }
  "tsimp": {
    "compilerOptions": {
      "sourceMap": true,
      "skipLibCheck": true
    }
  }
}
```

Sourcemaps are always enabled when using `tsimp`, so that errors
reference the approriate call sites within TypeScript code.

## `"module"` and `"moduleResolution"`

The ultimate resulting module style for tsimp _must_ be something
intelligible by Node, without any additional bundling or
transpiling.

Towards that end, the `module` and `moduleResolution` settings
are both hard-coded to `NodeNext` in tsimp, regardless of what is
in `tsconfig.json`.

## Compilation Diagnostics

Set the `TSIMP_DIAG` environment variable to control what happens
when there are compilation diagnostics.

- `TSIMP_DIAG=warn` (default) Print diagnostics to `stderr`, but
  still transpile the code if possible.
- `TSIMP_DIAG=error` Print diagnostics to `stderr`, and fail if
  there are any diagnostics.
- `TSIMP_DIAG=ignore` Just transpile the code, ignoring all
  diagnostics. (Similar to ts-node's `TS_NODE_TRANSPILE_ONLY=1`
  option.)
