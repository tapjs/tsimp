import ts, { type Diagnostic } from 'typescript'
import { getCanonicalFileName } from './get-canonical-filename.js'

const cwd = process.cwd()

// Ignore the rootDir warning. Just means we're running something outside of
// cwd, which happens a lot in tests where we're spinning up the daemon and
// stuff repeatedly in test dirs, but almost never irl, and isn't a problem
// anyway.
export const reportAll = (
  diagnostics: Diagnostic[],
  pretty?: boolean,
) =>
  diagnostics.filter(d => d.code !== 6059).map(d => report(d, pretty))

const host = {
  getCurrentDirectory: () => cwd,
  getNewLine: () => '\n',
  getCanonicalFileName,
}

export const report = (
  diagnostic: Diagnostic,
  pretty = !!process.stderr.isTTY,
): string =>
  pretty ?
    ts.formatDiagnosticsWithColorAndContext([diagnostic], host)
  : ts.formatDiagnostic(diagnostic, host)
