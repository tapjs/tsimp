// cache an arbitrary function of arity 0 or 1
export function cached<R>(
  fn: () => R
): (() => R) & { cache: Map<undefined, R> }
export function cached<A, R>(
  fn: (arg: A) => R
): ((arg: A) => R) & { cache: Map<A, R> }
export function cached<A, R>(
  fn: (arg?: A) => R
): ((arg?: A) => R) & { cache: Map<A | undefined, R> } {
  const cache = new Map<A | undefined, R>()
  return Object.assign(
    (arg?: A) => {
      const has = cache.has(arg)
      if (has) {
        return cache.get(arg) as R
      }
      const r = fn(arg)
      cache.set(arg, r)
      return r
    },
    { cache }
  )
}
