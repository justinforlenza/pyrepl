<script lang="ts">
import { eventType, type WorkerEvent } from '$lib/worker/events'

import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte'
import { app } from '$lib/state'

let inputArray: Uint8Array
let syncArray: Int32Array

let currentLine = $state('')

let waitingForInput = $state(false)

const terminalReady = async () => {
  if (app.terminal === undefined) return
  const fitAddon = new (await XtermAddon.FitAddon()).FitAddon()
  app.terminal.loadAddon(fitAddon)
  fitAddon.fit()

  app.resize = () => fitAddon.fit()

  app.terminal.writeln('Initializing Python Environment ....')

  app.worker.onmessage = (e: MessageEvent<WorkerEvent>) => {
    if (app.terminal === undefined) return

    switch (e.data.type) {
      case eventType.stdin:
        waitingForInput = true
        app.terminal.focus()
        break
      case eventType.stderr:
        app.terminal.write(`\x1b[31m ${e.data.message}`)
        break
      case eventType.stdout:
        app.terminal.write(String.fromCharCode(e.data.charCode))
        break

      case eventType.ready:
        syncArray = new Int32Array(e.data.buffers.syncBuffer)
        inputArray = new Uint8Array(e.data.buffers.inputBuffer)

        app.terminal.writeln('Python Ready ')
        app.ready = true
        break

      case eventType.complete:
        app.running = false
        break

      default:
        break
    }
  }
}

const terminalKey = async ({
  key,
  domEvent,
}: { key: string; domEvent: KeyboardEvent }) => {
  if (!waitingForInput || app.terminal === undefined) return
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

  if (domEvent.key === 'Enter') {
    app.terminal.write('\r\n')
    const bytes = new TextEncoder().encode(currentLine)

    inputArray.set(bytes)

    Atomics.store(syncArray, 1, bytes.length)

    Atomics.store(syncArray, 0, 1)
    Atomics.notify(syncArray, 0, 1)
    waitingForInput = false
    currentLine = ''
  } else if (domEvent.key === 'Backspace') {
    // Backspace
    if (currentLine.length > 0) {
      currentLine = currentLine.slice(0, -1)
      app.terminal.write('\b \b')
    }
  } else if (printable) {
    currentLine += key
    app.terminal.write(key)
  }
}
</script>

<Xterm 
  bind:terminal={app.terminal}
  onLoad={terminalReady}
  onKey={terminalKey}
  options={{
    fontSize: 18,
    convertEol: true
  }}
  class='rounded-lg overflow-auto grid-area-[output] bg-black transition-all'
/>