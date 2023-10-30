// This is used to reduce the performance penalty of Error construction
// when we are throwing away a caught error anyway.
export function catcher<R>(fn: () => R): R | undefined
export function catcher<R, E>(fn: () => R, caughtValue: E): R | E
export function catcher<R, E = undefined>(
  fn: () => R,
  caughtValue?: E
) {
  const originalStackTraceLimit = Error.stackTraceLimit
  Error.stackTraceLimit = 0
  try {
    return fn()
  } catch {
    return caughtValue
  } finally {
    Error.stackTraceLimit = originalStackTraceLimit
  }
}

const wrapped = new Map<(...a:any)=>any, (...a:any)=>any>()
export function catchWrap<A extends unknown[], R>(
  fn: (...a: A) => R
): (...a: A) => R | undefined
export function catchWrap<A extends unknown[], R, E>(
  fn: (...a: A) => R,
  caughtValue: E
): (...a: A) => R | E
export function catchWrap<A extends unknown[], R, E>(
  fn: (...a: A) => R,
  caughtValue?: E
) {
  const c = wrapped.get(fn)
  if (c) return c
  const n = (...a: A) => catcher(() => fn(...a), caughtValue)
  wrapped.set(fn, n)
  return n
}
