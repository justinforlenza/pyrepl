export const eventType = {
  run: 'RUN',
  stdin: 'STDIN',
  stdout: 'STDOUT',
  stderr: 'STDERR',
  ready: 'READY',
  complete: 'COMPLETE',
} as const

export type EventType = (typeof eventType)[keyof typeof eventType]

interface RunEvent {
  type: (typeof eventType)['run']
  code: string
}

interface StdInEvent {
  type: (typeof eventType)['stdin']
}

export interface ReadyEvent {
  type: (typeof eventType)['ready']
  buffers: {
    syncBuffer: SharedArrayBuffer
    inputBuffer: SharedArrayBuffer
  }
}

interface StdOutEvent {
  type: (typeof eventType)['stdout']
  charCode: number
}

interface StdErrorEvent {
  type: (typeof eventType)['stderr']
  message: string
}

interface CompleteEvent {
  type: (typeof eventType)['complete']
}

export type WorkerEvent =
  | RunEvent
  | StdInEvent
  | ReadyEvent
  | StdOutEvent
  | StdErrorEvent
  | CompleteEvent
