import ts from 'typescript'

export const report = (
  ts as typeof ts & {
    createDiagnosticReporter: (
      system: ts.System,
      pretty?: boolean
    ) => ts.DiagnosticReporter
  }
).createDiagnosticReporter(ts.sys, process.stderr.isTTY)
