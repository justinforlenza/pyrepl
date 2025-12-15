export const eventType = {
  run: 'RUN',
  stdin: 'STDIN',
  stdout: 'STDOUT',
  stderr: 'STDERR',
  ready: 'READY',
  complete: 'COMPLETE',
  setInterupt: 'SET_INTERRUPT',
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
  buffer: Uint8Array<ArrayBufferLike>
}

interface StdErrorEvent {
  type: (typeof eventType)['stderr']
  message: string
}

interface CompleteEvent {
  type: (typeof eventType)['complete']
}

interface SetInterruptEvent {
  type: (typeof eventType)['setInterupt']
  buffer: Uint8Array<SharedArrayBuffer>
}

export type WorkerEvent =
  | RunEvent
  | StdInEvent
  | ReadyEvent
  | StdOutEvent
  | StdErrorEvent
  | CompleteEvent
  | SetInterruptEvent
