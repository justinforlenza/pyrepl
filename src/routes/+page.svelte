<script lang="ts">
import { goto, replaceState } from '$app/navigation'
import { page } from '$app/stores'

import { atou, utoa } from '$lib'
import Worker from '$lib/worker?worker'
import { eventType, type WorkerEvent } from '$lib/worker/events'

import CodeMirror from 'svelte-codemirror-editor'
import { python } from '@codemirror/lang-python'

import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte'
import type { Terminal } from '@battlefieldduck/xterm-svelte'

import spinner from '../svg/spinner.svg?raw'
import { onMount } from 'svelte'

let worker: Worker

let inputArray: Uint8Array
let syncArray: Int32Array

let currentLine = ''

let windowResize: () => void;

let value = ''

try {
  value = atou($page.url.searchParams.get('code') ?? '')
} catch (e) {
  // @ts-expect-error error type unknown
  if (e.name === 'InvalidCharacterError') {
    let [url, hash] = window.location.toString().split('?code=')
    if (hash !== undefined) {
      window.location.assign(
        `${url}?code=${encodeURIComponent(hash)}`
      )
    }
  }
}

let terminal: Terminal

let expanded = false

let running = false
let ready = false

let waitingForInput = false

const runPython = async () => {
  if (running || !ready) return
  running = true

  terminal.reset()
  worker.postMessage({
    type: eventType.run,
    code: value,
  })
}

const terminalReady = async () => {
  const fitAddon = new (await XtermAddon.FitAddon()).FitAddon()
  terminal.loadAddon(fitAddon)
  fitAddon.fit()

  windowResize = () => fitAddon.fit()

  terminal.writeln('Initializing Python Environment ....')

  worker = new Worker()

  worker.onmessage = (e: MessageEvent<WorkerEvent>) => {
    switch (e.data.type) {
      case eventType.stdin:
        waitingForInput = true
        terminal.focus()
        break
      case eventType.stderr:
        terminal.write(`\x1b[31m ${e.data.message}`)
        break
      case eventType.stdout:
        terminal.write(String.fromCharCode(e.data.charCode))
        break

      case eventType.ready:
        syncArray = new Int32Array(e.data.buffers.syncBuffer)
        inputArray = new Uint8Array(e.data.buffers.inputBuffer)

        terminal.writeln('Python Ready ')
        ready = true
        break

      case eventType.complete:
        running = false
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
  if (!waitingForInput) return
  const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

  if (domEvent.key === 'Enter') {
    terminal.write('\r\n')
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
      terminal.write('\b \b')
    }
  } else if (printable) {
    currentLine += key
    terminal.write(key)
  }
}

const encodeCode = (code: string) => {
  if (typeof window === 'undefined' || code === '') return

  const hash = utoa(code)

  if ($page.url.searchParams.get('code') !== hash) {
    replaceState(`?code=${encodeURIComponent(hash)}`, {})
  }
}

$: encodeCode(value)

</script>

<svelte:window onresize={windowResize} on:error={() => console.log('aaaa')} />

<svelte:head>
  <title>PyREPL - Web Based Python Environment</title>
</svelte:head>

<main 
  class="gap-2 p-2 bg-slate-2 overflow-hidden transition-all"
  class:biggerTerminal={expanded}
>
  <header class="grid-area-[header] flex items-center px-2 justify-between">
    <div class="flex items-center gap-5">
      <h1 class="text-2xl font-bold font-sans">
        PyREPL
      </h1>
      <p class="text-sm font-mono text-slate-6">v{PKG.version}</p>
    </div>

    <a 
      href="https://github.com/justinforlenza/pyrepl" 
      target="_blank" 
      aria-label="view source code"
      class="rounded bg-slate-50 border-slate-4 border-1 hover:bg-slate-1 text-slate-8 px-4 py-2"
      title="View Source Code"
    >
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M5.65 12.477a.5.5 0 10-.3-.954l.3.954zm-3.648-2.96l-.484-.128-.254.968.484.127.254-.968zM9 14.5v.5h1v-.5H9zm.063-4.813l-.054-.497a.5.5 0 00-.299.852l.352-.354zM12.5 5.913h.5V5.91l-.5.002zm-.833-2.007l-.466-.18a.5.5 0 00.112.533l.354-.353zm-.05-2.017l.456-.204a.5.5 0 00-.319-.276l-.137.48zm-2.173.792l-.126.484a.5.5 0 00.398-.064l-.272-.42zm-3.888 0l-.272.42a.5.5 0 00.398.064l-.126-.484zM3.383 1.89l-.137-.48a.5.5 0 00-.32.276l.457.204zm-.05 2.017l.354.353a.5.5 0 00.112-.534l-.466.181zM2.5 5.93H3v-.002l-.5.002zm3.438 3.758l.352.355a.5.5 0 00-.293-.851l-.06.496zM5.5 11H6l-.001-.037L5.5 11zM5 14.5v.5h1v-.5H5zm.35-2.977c-.603.19-.986.169-1.24.085-.251-.083-.444-.25-.629-.49a4.8 4.8 0 01-.27-.402c-.085-.139-.182-.302-.28-.447-.191-.281-.473-.633-.929-.753l-.254.968c.08.02.184.095.355.346.082.122.16.252.258.412.094.152.202.32.327.484.253.33.598.663 1.11.832.51.168 1.116.15 1.852-.081l-.3-.954zm4.65-.585c0-.318-.014-.608-.104-.878-.096-.288-.262-.51-.481-.727l-.705.71c.155.153.208.245.237.333.035.105.053.254.053.562h1zm-.884-.753c.903-.097 1.888-.325 2.647-.982.78-.675 1.237-1.729 1.237-3.29h-1c0 1.359-.39 2.1-.892 2.534-.524.454-1.258.653-2.099.743l.107.995zM13 5.91a3.354 3.354 0 00-.98-2.358l-.707.706c.438.44.685 1.034.687 1.655l1-.003zm-.867-1.824c.15-.384.22-.794.21-1.207l-1 .025a2.12 2.12 0 01-.142.82l.932.362zm.21-1.207a3.119 3.119 0 00-.27-1.195l-.913.408c.115.256.177.532.184.812l1-.025zm-.726-.99c.137-.481.137-.482.136-.482h-.003l-.004-.002a.462.462 0 00-.03-.007 1.261 1.261 0 00-.212-.024 2.172 2.172 0 00-.51.054c-.425.091-1.024.317-1.82.832l.542.84c.719-.464 1.206-.634 1.488-.694a1.2 1.2 0 01.306-.03l-.008-.001a.278.278 0 01-.01-.002l-.006-.002h-.003l-.002-.001c-.001 0-.002 0 .136-.482zm-2.047.307a8.209 8.209 0 00-4.14 0l.252.968a7.209 7.209 0 013.636 0l.252-.968zm-3.743.064c-.797-.514-1.397-.74-1.822-.83a2.17 2.17 0 00-.51-.053 1.259 1.259 0 00-.241.03l-.004.002h-.003l.136.481.137.481h-.001l-.002.001-.003.001a.327.327 0 01-.016.004l-.008.001h.008a1.19 1.19 0 01.298.03c.282.06.769.23 1.488.694l.543-.84zm-2.9-.576a3.12 3.12 0 00-.27 1.195l1 .025a2.09 2.09 0 01.183-.812l-.913-.408zm-.27 1.195c-.01.413.06.823.21 1.207l.932-.362a2.12 2.12 0 01-.143-.82l-1-.025zm.322.673a3.354 3.354 0 00-.726 1.091l.924.38c.118-.285.292-.545.51-.765l-.708-.706zm-.726 1.091A3.354 3.354 0 002 5.93l1-.003c0-.31.06-.616.177-.902l-.924-.38zM2 5.93c0 1.553.458 2.597 1.239 3.268.757.65 1.74.88 2.64.987l.118-.993C5.15 9.09 4.416 8.89 3.89 8.438 3.388 8.007 3 7.276 3 5.928H2zm3.585 3.404c-.5.498-.629 1.09-.584 1.704L6 10.963c-.03-.408.052-.683.291-.921l-.705-.709zM5 11v3.5h1V11H5zm5 3.5V13H9v1.5h1zm0-1.5v-2.063H9V13h1z" fill="currentColor"></path></svg>
    </a>
  </header>

  <div class="grid-area-[actions] flex items-center justify-center lg:justify-between px-2">
    <button 
      class="hidden lg:block font-sans px-5 py-2 rounded text-lg bg-slate-50 border-slate-4 border-1 hover:bg-slate-1 text-slate-8"
      title={`${expanded ? 'Shrink' : 'Expand'} Output`}
      aria-label={`${expanded ? 'shrink' : 'expand'} code output`}
      aria-details="toggle expanded code output"
      aria-pressed={expanded}
      on:click={() => {
        expanded = !expanded
        setTimeout(()=> {
          windowResize()
        }, 250)
      }}
    >
      {#if expanded}
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M5 14l7-6.5L5 1" stroke="currentColor" stroke-linecap="square"></path></svg>
      {:else}
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M10 14L3 7.5 10 1" stroke="currentColor" stroke-linecap="square"></path></svg>
      {/if}
    </button>
    <div class="flex gap-4">
      <button 
        class="font-sans px-6 py-1 rounded text-lg bg-green-50 border-green-4 border-1 hover:bg-green-1 text-green-8 relative"
        class:text-transparent={running}
        aria-details="run code"
        on:click={runPython}
      >
        {#if running}
          <span class="hidden" aria-live="polite" aria-busy="true">Working ... </span>
          <div class="absolute fill-green-9 h-full w-full flex justify-center items-center top-0 left-0">{@html spinner}</div>
        {/if}
        Run
      </button>

      <button 
        class="font-sans px-6 py-1 rounded text-lg bg-blue-50 border-blue-4 border-1 hover:bg-blue-1 text-blue-8"
        aria-details="copy share link to code repl"
        on:click={() => {navigator.clipboard.writeText(window.location.toString()); alert('Link Copied')}}
      >
        Share
      </button>
    </div>

  </div>

  <CodeMirror
    bind:value
    lang={python()}
    class="rounded-xl overflow-hidden bg-white transition-all"
    styles={{
      '&': {
        height: '100%',
        fontSize: '18px'
      }
    }}
  />

  <Xterm 
    bind:terminal 
    onLoad={terminalReady}
    onKey={terminalKey}
    options={{
      fontSize: 18,
      convertEol: true
    }}
    class='rounded-xl overflow-auto grid-area-[output] bg-black transition-all'
  />
</main>

<style>
main {
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(2, 48px 1fr);
  grid-template-columns: 1fr;
  grid-template-areas: 
    "header"
    "editor"
    "actions"
    "output"
}
@media (min-width: theme('breakpoints.lg')) {
  main {
    grid-template-columns: 1.2fr minmax(384px, 0.8fr); 
    grid-template-rows: 48px 1fr; 
    grid-template-areas: 
      "header actions"
      "editor output"; 
  }

  main.biggerTerminal {
    grid-template-columns: minmax(384px, 0.8fr) 1.2fr; 
  }
}

:global(.xterm-screen) {
  padding: 1rem
}
</style>
