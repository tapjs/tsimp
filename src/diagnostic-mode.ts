export type DiagMode = 'ignore' | 'warn' | 'error'
export const isDiagMode = (d?: string): d is DiagMode =>
  d === 'ignore' || d === 'warn' || d === 'error'
export const getDiagMode = (): DiagMode => {
  const d = process.env.TSIMP_DIAG ?? 'warn'
  if (!isDiagMode(d))
    throw new Error(
      `Invalid TSIMP_DIAG environment variable: ${d}. Must be one of: ` +
        `'ignore', 'warn', or 'error'`
    )
  return d
}
