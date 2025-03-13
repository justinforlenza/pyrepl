import Worker from '$lib/worker?worker'
import { eventType, type WorkerEvent, type ReadyEvent } from '$lib/worker/events' 

class WorkerState {
  _worker: Worker

  running = $state(false)
  ready = $state(false)

  onStdin: (() => void) | undefined
  onStdout: ((charCode: number) => void) | undefined
  onReady: ((buffers: ReadyEvent['buffers']) => void) | undefined
  onStderr: ((message: string) => void) | undefined

  run(code: string) {
    if (this.running || !this.ready) return

    this.running = true
    this._worker.postMessage({ type: eventType.run, code })
  }
  

  constructor() {
    this._worker = new Worker()

    this._worker.onmessage = (e: MessageEvent<WorkerEvent>) => {
      switch(e.data.type) {
        case eventType.complete:
          this.running = false
          break
        
        case eventType.stdout:
          this.onStdout?.(e.data.charCode)
          break
        
        case eventType.stdin:
          this.onStdin?.()
          break
        
        case eventType.ready:
          this.ready = true
          this.onReady?.(e.data.buffers)
          break
        
        case eventType.stderr:
          this.onStderr?.(e.data.message)
          break
        
        default:
          break
      }
    }
  }
}

const worker = new WorkerState()

export { worker }
