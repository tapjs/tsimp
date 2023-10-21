import type { Diagnostic } from 'typescript'

export type ReadyState = 'ALREADY RUNNING' | 'READY'

export type Request = [
  id: string,
  fileName: string,
  typeCheck: boolean
]

export type Response = [
  id: string,
  outputText: string,
  diagnostics: Diagnostic[]
]

export type CompileResult = {
  outputText: string
  diagnostics: Diagnostic[]
}
