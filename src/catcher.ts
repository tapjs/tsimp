// This is used to reduce the performance penalty of Error construction
// when we are throwing away a caught error anyway.
export function catcher<R>(fn: () => R): R | undefined
export function catcher<R, E>(fn: () => R, caughtValue: E): R | E
export function catcher<R, E = undefined>(fn: () => R, caughtValue?: E) {
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
