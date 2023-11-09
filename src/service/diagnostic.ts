import ts, { type Diagnostic } from 'typescript'
import { getCanonicalFileName } from './get-canonical-filename.js'

const cwd = process.cwd()

export const reportAll = (
  diagnostics: Diagnostic[],
  pretty?: boolean
) => diagnostics.map(d => report(d, pretty))

const host = {
  getCurrentDirectory: () => cwd,
  getNewLine: () => '\n',
  getCanonicalFileName,
}

export const report = (
  diagnostic: Diagnostic,
  pretty = !!process.stderr.isTTY
): string =>
  pretty
    ? ts.formatDiagnosticsWithColorAndContext([diagnostic], host)
    : ts.formatDiagnostic(diagnostic, host)
