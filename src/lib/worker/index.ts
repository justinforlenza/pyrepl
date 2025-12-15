import { loadPyodide, type PyodideInterface } from 'pyodide'

import { eventType, type WorkerEvent } from './events'

declare const self: DedicatedWorkerGlobalScope

declare global {
  interface DedicatedWorkerGlobalScope {
    pyodide: PyodideInterface
  }
}

const BUFFER_SIZE = 1024 // Size for input text
const syncBuffer = new SharedArrayBuffer(8) // For synchronization
const inputBuffer = new SharedArrayBuffer(BUFFER_SIZE) // For actual input data
const syncArray = new Int32Array(syncBuffer)
const inputArray = new Uint8Array(inputBuffer)

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    args: ['-u'],
    stdin: () => {
      self.postMessage({ type: eventType.stdin })

      while (true) {
        const wait = Atomics.wait(syncArray, 0, 0, 100)

        self.pyodide.checkInterrupt()

        if (wait === 'ok') {
          break
        }
      }

      const length = syncArray[1]

      const bytes = inputArray.slice(0, length)
      const input = new TextDecoder().decode(bytes)


      Atomics.store(syncArray, 0, 0)

      return input
    },
    stderr: (e) => {
      console.debug(e)
      console.debug('uh-oh')
    },
  })

  self.pyodide.setStdout({
    // raw: (charCode) => self.postMessage({ type: eventType.stdout, charCode }),
    write: (buffer) => {
      console.debug('[pyrepl][worker] stdout write called')
      // console.debug('[pyrepl][worker] buffer:', buffer)
      self.postMessage({
        type: eventType.stdout,
        buffer,
      })

      return buffer.length
    },
  })

  self.postMessage({
    type: eventType.ready,
    buffers: { syncBuffer, inputBuffer },
  })
}

const pyodideReadyPromise = loadPyodideAndPackages()

self.onmessage = async (e: MessageEvent<WorkerEvent>) => {
  switch (e.data.type) {
    case eventType.run:
      await pyodideReadyPromise
      try {
        await self.pyodide.runPythonAsync(e.data.code)
      } catch (err) {
        // @ts-expect-error unknown error types
        self.postMessage({ type: eventType.stderr, message: err.message })
      }
      self.postMessage({ type: eventType.complete })
      break
    case eventType.setInterupt:
      await pyodideReadyPromise
      console.debug('[pyrepl][worker] setting interrupt buffer')
      self.pyodide.setInterruptBuffer(e.data.buffer)
      break
    default:
      break
  }
}
