export const eventType = {
  run: 'RUN',
  stdin: 'STDIN',
  stdin_request: 'STDIN_REQ',
  stdout: 'STDOUT',
  stderr: 'STDERR'
} as const


export type EventType = typeof eventType[keyof typeof eventType]

interface RunWorkerEvent {
  type: typeof eventType['run']
  code: string
}

interface StdInWorkerEvent {
  type: typeof eventType['stdin']
  input: string
}

interface STDWorkerEvent {
  type: Exclude<EventType, 'RUN' | 'STDIN'>
  message: string
}

export type WorkerEvent = RunWorkerEvent | StdInWorkerEvent | STDWorkerEvent