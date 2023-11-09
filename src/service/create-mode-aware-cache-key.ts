import type { ResolutionMode } from 'typescript'

export function createModeAwareCacheKey(
  specifier: string,
  mode?: ResolutionMode
) {
  return mode === undefined ? specifier : `${mode}|${specifier}`
}
