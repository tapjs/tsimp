import ts from 'typescript'

export function createModeAwareCacheKey(
  specifier: string,
  mode: ts.ResolutionMode
) {
  return mode === undefined ? specifier : `${mode}|${specifier}`
}
