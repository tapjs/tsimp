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

Note that `import` declarations happen in parallel _before_ the
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
      "skipLibCheck": true,
      "strict": false
    }
  }
}
```

Sourcemaps are always enabled when using `tsimp`, so that errors
reference the approriate call sites within TypeScript code.

### Config File Changes and `extends` Options

If the `tsconfig.json` file used by tsimp changes, then it will
automatically expire its memory and disk caches, because new
options can result in very different results.

However, while `extends` is fully supported (if `tsc` can load
it, so can `tsimp`, because that's how it loads config), any
extended config files will _not_ be tracked for changes or cause
the cache to expire.

When in doubt, `tsimp --restart` will reload everything as
needed.

### `"module"`, `"moduleResolution"`, and other must-haves

The ultimate resulting module style for tsimp _must_ be something
intelligible by Node, without any additional bundling or
transpiling.

Towards that end, the `module` and `moduleResolution` settings
are both hard-coded to `NodeNext` in tsimp, regardless of what is
in `tsconfig.json`.

Also, the following fields are always hard-coded by tsimp:

- `outDir` Because tsimp isn't a build tool, but rather a module
  importer, it doesn't actually write the emitted JavaScript to
  disk. (Ok, technically it does, but only as a cache.) So, the
  `outDir` is hard-coded to `.tsimp-compiled`, but this is never
  used.
- `sourceMap` This is always set to `undefined`, because:
- `inlineSourceMap` is always set to `true`. It's just much
  simpler and faster to have the sourcemap inline with the
  generated JavaScript output.
- `inlineSources` is always set to `false`. There is no need to
  bloat the output, when the input is definitely present on disk.
- `declarationMap` and `declaration` are always set to `false`,
  because type declarations are not relevant.
- `noEmit` is always set `false`, because the entire point is to
  get the JavaScript code for Node to run. That said, the "emit"
  is fully virtual, and nothing is written to disk (except to
  avoid compiling the same code multiple times).

### File Extensions, Module Resolution, etc.

The same rules for file extensions, module resolution, and
everything else apply when using `tsimp` as when using `tsc`.

That means: if you're running in ESM mode, you need to write your
imports ending in `.js` even though the actual file on disk is
`.ts`, because that's how TS does it when `module` is set to
`"NodeNext"` and the target dialect is ESM.

### Compilation Diagnostics

Set the `TSIMP_DIAG` environment variable to control what happens
when there are compilation diagnostics.

- `TSIMP_DIAG=warn` (default) Print diagnostics to `stderr`, but
  still transpile the code if possible.
- `TSIMP_DIAG=error` Print diagnostics to `stderr`, and fail if
  there are any diagnostics.
- `TSIMP_DIAG=ignore` Just transpile the code, ignoring all
  diagnostics. (Similar to ts-node's `TS_NODE_TRANSPILE_ONLY=1`
  option.)

## How fast is it?

If the daemon is running, it's very fast, even if type checking
is enabled. If the daemon is running and its previously compiled
the file you're running, it's _zomg extremely_ fast, like "so fast
you'll think it's broken" fast, outperforming TypeScript
compilers written in Rust and Go, since it literally doesn't have
to do anything except check some file stats and then hand the
cached results to Node. (In fact, since it caches in memory as
well as to disk, it might even be _faster_ in many cases than
running plain old JavaScript, if the program is large.)

And, this is with full type checking, which is sort of the point
of using TypeScript. No matter how fast your compiler is, if
you're then running `tsc --noEmit` to check your types, then it's
not actually gaining much.

If the daemon is _not_ running, and it's a cold start with no
cache, it's pretty slow, comparable with ts-node, especially if
type checking is enabled.

An exceptionally not scientific example comparison:

<pre style="color:#eeeeee;background:#222222;position:relative" title="tapjs/tsimp main - tapjs/tsimp">
$ time node --loader @swc-node/register/esm hello.ts
(node:89220) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from &quot;node:module&quot;; import { pathToFileURL } from &quot;node:url&quot;; register(&quot;%40swc-node/register/esm&quot;, pathToFileURL(&quot;./&quot;));'
(Use `node --trace-warnings ...` to show where the warning was created)
hello, world

real	0m0.268s
user	0m0.255s
sys	0m0.033s

$ time node --import=tsx hello.ts
hello, world

real	0m0.135s
user	0m0.126s
sys	0m0.020s

$ time node --import=./dist/esm/hooks/import.mjs hello.ts
<span style="color:#00ffff">hello.ts</span>:<span style="color:#ffff00">2</span>:<span style="color:#ffff00">18</span> - <span style="color:#ff3030">error</span><span style="color:#404040"> TS2322: </span>Type 'string' is not assignable to type 'boolean'.

<span style="color:#222222;background:#eeeeee">2</span> const f: Foo = { bar: 'hello' }
<span style="color:#222222;background:#eeeeee"> </span> <span style="color:#ff3030">                 ~~~

</span>  <span style="color:#00ffff">hello.ts</span>:<span style="color:#ffff00">1</span>:<span style="color:#ffff00">14
</span>    <span style="color:#222222;background:#eeeeee">1</span> type Foo = { bar: boolean }
    <span style="color:#222222;background:#eeeeee"> </span> <span style="color:#00ffff">             ~~~
</span>    The expected type comes from property 'bar' which is declared here on type 'Foo'

hello, world

real	0m0.126s
user	0m0.110s
sys	0m0.022s
</pre>

## How is it so fast?

![meme comic "We need this to run faster" "rewrite it in rust" "rewrite it in zig" "use basic caching and work skipping" guy gets thrown out window](https://github.com/tapjs/tsimp/raw/main/faster.jpg)

Basic caching and work skipping.
