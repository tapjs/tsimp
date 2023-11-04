import { realpathSync } from 'fs'
import { relative, resolve } from 'path'
import { enable, perfalize } from 'perfalize'
import ts from 'typescript'
import { error, info, trace, warn } from './debug.js'
import { report } from './service/diagnostic.js'
import { tsconfig } from './service/tsconfig.js'

realpathSync
relative
resolve
enable
perfalize
ts
error
info
trace
warn
report
tsconfig
