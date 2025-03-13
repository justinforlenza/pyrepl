<script lang="ts">
import { Xterm, XtermAddon, type Terminal } from '@battlefieldduck/xterm-svelte'
import { worker, terminal } from '$lib/state'

let inputArray: Uint8Array
let syncArray: Int32Array

worker.onStdout = (charCode) => {
  if (terminal.el === undefined) return
  terminal.el.write(String.fromCharCode(charCode))
}

worker.onStdin = () => {
  if (terminal.el === undefined) return
  terminal.waitingForInput = true
  terminal.el.focus()
}

worker.onReady = (buffers) => {
  if (terminal.el === undefined) return

  syncArray = new Int32Array(buffers.syncBuffer)
  inputArray = new Uint8Array(buffers.inputBuffer)

  terminal.el.writeln('Python Ready ')
}

worker.onStderr = (message) => {
  if (terminal.el === undefined) return
  terminal.el.write(`\x1b[31m ${message}`)
}

const onLoad = async (terminal: Terminal) => {
  const fitAddon = new (await XtermAddon.FitAddon()).FitAddon()
  terminal.loadAddon(fitAddon)
  fitAddon.fit()

  terminal.resize = () => fitAddon.fit()

  terminal.writeln('Initializing Python Environment ....')
}

const onKey = async ({
  key,
  domEvent,
}: { key: string; domEvent: KeyboardEvent }) => {
  if (!terminal.waitingForInput || terminal.el === undefined) return
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

  if (domEvent.key === 'Enter') {
    terminal.el.write('\r\n')
    const bytes = new TextEncoder().encode(terminal.currentLine)

    inputArray.set(bytes)

    Atomics.store(syncArray, 1, bytes.length)

    Atomics.store(syncArray, 0, 1)
    Atomics.notify(syncArray, 0, 1)
    terminal.waitingForInput = false
    terminal.currentLine = ''
  } else if (domEvent.key === 'Backspace') {
    if (terminal.currentLine.length > 0) {
      terminal.currentLine = terminal.currentLine.slice(0, -1)
      terminal.el.write('\b \b')
    }
  } else if (printable) {
    terminal.currentLine += key
    terminal.el.write(key)
  }
}
</script>

<Xterm 
  bind:terminal={terminal.el}
  {onLoad}
  {onKey}
  options={{
    fontSize: 18,
    convertEol: true
  }}
  class='rounded-lg overflow-auto grid-area-[output] bg-black transition-all'
/>