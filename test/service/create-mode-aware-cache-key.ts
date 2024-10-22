import t from 'tap'
import ts from 'typescript'
import { createModeAwareCacheKey } from '../../src/service/create-mode-aware-cache-key.js'

t.equal(createModeAwareCacheKey('asdf'), 'asdf')
t.equal(
  createModeAwareCacheKey('asdf', ts.ModuleKind.CommonJS),
  `${ts.ModuleKind.CommonJS}|asdf`,
)
