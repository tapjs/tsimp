# tsimp

A TypeScript Import loader for Node.js

## What It Is

This is an importer that runs Node.js programs written in
TypeScript, using the official TypeScript implementation from
Microsoft.

## Why Is It

There are quite a few TypeScript compilers available! Which one
should you choose, and why did I need to create this one?

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
- Type checking is disabled by default for performance reasons,
  but can be turned on, so no need to run an extra `tsc --noEmit`
  step after running tests.
- It's just a module loader, not a bunch of other things. So
  there's no repl, no bundler, etc. It's not a lot of code
  (unless you count TypeScript itself, which to be fair, is kind
  of a lot of code, but you're probably already biting that
  bullet).

## USAGE

Install `tsimp` with npm:

```
npm install tsimp
```

Run TypeScript programs like this in node v20.6 and higher:

```
node --import=tsimp my-typescript-program.ts
```

Or like this in Node versions prior to v20.6:

```
node --loader=tsimp/loader my-typescript-program.ts
```

Or you can use `tsimp` as the executable to run your program:

```
tsimp my-typescript-program.ts
```

In Node v20.6 and higher, you can also load `tsimp` in your
program, and from that point forward, TypeScript modules will
Just Work.

```js
import 'tsimp'
// has to be done as an async import() so that it occurs
// after the tsimp import is finished. But any imports that the
// typescript program does can be "normal" top level imports.
const { SomeThing } = await import('./some-thing.ts')
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
will override anything else in the file.  For example:

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

## Using with `"module": "bundler"`

The ultimate resulting module style for tsimp _must_ be something
intelligible by Node, without any additional bundling or
transpiling. So, unless it's going to be made Node-compatible by
some other loader/import script in the stack, you'll need to set
your `module` tsconfig for `tsimp` to something like `Node16` or
`NodeNext`, even if you are actually compiling with tsc in
`"module": "bundler"` mode.

```json
{
  "compilerOptions": {
    "...": "..etc..",
    "module": "bundler"
  },
  "tsimp": {
    "compilerOptions": {
      "module": "NodeNext",
      "moduleResolution": "NodeNext"
    }
  }
}
```
