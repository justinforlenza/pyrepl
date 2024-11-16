<script lang="ts">
import CodeMirror from 'svelte-codemirror-editor'
import { type EditorView } from '@codemirror/view'
import { EditorState } from "@codemirror/state"
import { python } from '@codemirror/lang-python'

import { loadPyodide } from 'pyodide'

import spinner from '../../svg/spinner.svg?raw'
import { atou, utoa } from '$lib'
import { replaceState } from '$app/navigation'
import { page } from '$app/stores'

let value = atou($page.params.hash)
let output = ''

let error = false
let running = false

const runPython = async () => {
  if (running) return
  running = true
  output = ''
  error = false
  const pyodide = await loadPyodide()

  pyodide.runPython(`
    import sys
    import io
    sys.stdout = io.StringIO()
  `)
  try {
    await pyodide.runPythonAsync(value)
    output = pyodide.runPython('sys.stdout.getvalue()')
    running = false
  } catch (err) {
    error = true
    // @ts-expect-error unknown types
    output = err.message
    running = false
  }
}

const encodeCode = (code: string) => {
  if (typeof window === 'undefined' || code === '') return

  const hash = utoa(code)

  if ($page.params.hash !== hash) replaceState(`/${hash}`, {})
}

$: encodeCode(value)
</script>

<svelte:head>
  <title>PyREPL - A simple Web Based Python Environment</title>
</svelte:head>

<main 
  class="gap-2 p-2 bg-slate-2 overflow-hidden"
>
  <header class="grid-area-[header] flex items-center px-2">
    <h1 class="text-2xl font-bold font-sans">
      PyREPL
    </h1>
  </header>
  <div class="grid-area-[actions] flex items-center justify-between px-2">
    <button 
      class="font-sans px-6 py-1 rounded text-lg bg-green-50 border-green-4 border-1 hover:bg-green-1 text-green-8 relative"
      class:text-transparent={running}
      on:click={runPython}
    >
      {#if running}
        <span class="hidden" aria-live="polite" aria-busy="true">Working ... </span>
        <div class="absolute fill-green-9 h-full w-full flex justify-center items-center top-0 left-0">{@html spinner}</div>
      {/if}
      Run Code
    </button>
    <button 
      class="font-sans px-6 py-1 rounded text-lg flex bg-blue-50 border-blue-4 border-1 hover:bg-blue-1 text-blue-8 gap-2 items-center"
      aria-details="copy share link to code repl"
      on:click={() => {navigator.clipboard.writeText(window.location.toString()); alert('Link Copied')}}
    >
      Share
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M10 2.499a2.5 2.5 0 015 0 2.5 2.5 0 01-3.566 2.26L9.131 7.52l2.038 2.858A2.5 2.5 0 0115 12.493a2.5 2.5 0 11-4.559-1.417L8.246 8H4.949A2.501 2.501 0 010 7.495 2.5 2.5 0 014.95 7h3.312l2.37-2.84A2.488 2.488 0 0110 2.499z" fill="currentColor"></path></svg>
    </button>
  </div>
  <CodeMirror
    bind:value
    lang={python()}
    class="rounded-xl overflow-hidden bg-white"
    styles={{
      '&': {
        height: '100%',
        fontSize: '1.125rem'
      }
    }}
  />
  <pre
    class="grid-area-[output] bg-black rounded-xl p-2 px-4 overflow-auto text-lg {error ? 'text-red-5' : 'text-white'}"
    role="log"
    aria-label="code output"
    aria-details="displays output of code after running"
  >{output}</pre>
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
}
</style>