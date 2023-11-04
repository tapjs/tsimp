import { MessageBase } from 'sock-daemon'
import { DiagMode } from './diagnostic-mode.js'

export type ReadyState = 'ALREADY RUNNING' | 'READY'

export type Action = 'resolve' | 'compile' | 'preload'

export type PreloadRequest = {}
export type PreloadResult = {}

export type ServicePreloadRequest = MessageBase &
  PreloadRequest & {
    action: 'preload'
  }

export type CompileRequest = {
  fileName: string
  diagMode: DiagMode
  pretty?: boolean
}

export type ServiceCompileRequest = MessageBase &
  CompileRequest & {
    action: 'compile'
  }

export type CompileResult = {
  fileName?: string
  diagnostics: string[]
}
export type ServiceCompileResult = MessageBase &
  CompileResult & {
    action: 'compile'
  }

export type ResolveRequest = {
  url: string
  parentURL?: string
}
export type ServiceResolveRequest = MessageBase &
  ResolveRequest & {
    action: 'resolve'
  }

export type ResolveResult = {
  fileName?: string
}
export type ServiceResolveResult = MessageBase &
  ResolveResult & {
    action: 'resolve'
  }

export type ServiceRequest =
  | ServiceCompileRequest
  | ServiceResolveRequest

export type ServiceResult =
  | ServiceCompileRequest
  | ServiceResolveRequest
