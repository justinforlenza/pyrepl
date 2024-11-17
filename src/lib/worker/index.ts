import { loadPyodide, type PyodideInterface } from 'pyodide'

import { eventType, type WorkerEvent } from './events'

declare const self: DedicatedWorkerGlobalScope

declare global {
  interface DedicatedWorkerGlobalScope {
    pyodide: PyodideInterface
  }
}

const stdinBuffer: string[] = [];
let waitingForInput = false;

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    stdout: (message) => {
      self.postMessage({ type: eventType.stdout, message })
    }
  })

  self.pyodide.setStdin({
    stdin: () => {
      
      console.debug('received stdin from pyodide')

      self.postMessage({ type: eventType.stdin_request });
      console.debug('sent stdin request to ui')
      waitingForInput = true
      console.debug('waiting for input')
      // Busy-wait until we receive input
      console.log({
        stdinBuffer,
        waitingForInput
      })
      while (waitingForInput && stdinBuffer.length === 0) {
        console.debug('waiting for input')
        console.log({
          stdinBuffer,
          waitingForInput
        })
        // Small delay to prevent 100% CPU usage
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
      }
      
      return stdinBuffer.shift() || '';
    }
  })
}

const pyodideReadyPromise = loadPyodideAndPackages()

self.onmessage = async (e: MessageEvent<WorkerEvent>) => {
  switch (e.data.type) {
    case eventType.run:
      await pyodideReadyPromise
      await self.pyodide.runPython(e.data.code)
      break
    case eventType.stdin:
      stdinBuffer.push(e.data.input);
      waitingForInput = false;
      break
    default:
      break
  }
}
