<script lang="ts">
import CodeMirror from 'svelte-codemirror-editor'
import { python } from '@codemirror/lang-python'

import { loadPyodide } from 'pyodide'

let value = ''
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
    console.log(typeof output)
    running = false
  }
}
</script>

<svelte:head>
  <title>PyREPL - A simple Web Based Python Environment</title>
</svelte:head>

<main 
  class="
    h-screen grid gap-2 p-2 bg-slate-200 overflow-hidden
    grid-cols-[1.2fr_minmax(400px,0.8fr)] grid-rows-[48px_1fr] grid-area-['header_header''editor_output']
  "
>
  <header class="grid-area-[header] flex items-center px-2">
    <h1 class="text-2xl font-bold font-sans">
      PyREPL
    </h1>
  </header>
  <div class="grid-area-[actions] flex items-center justify-between px-2">
    <button 
      class="font-sans px-6 py-1 rounded text-lg bg-slate-50 border-slate-400 border-1 hover:bg-slate-100"
      on:click={runPython}
    >
      Run Code
    </button>
  </div>
  <CodeMirror
    bind:value 
    lang={python()}
    class="rounded-xl overflow-hidden bg-white"
    styles={{
      '&': {
        height: '100%',
        fontSize: '14pt'
      }
    }}
  />
  <pre 
    class="grid-area-[output] bg-black rounded-xl p-2 px-4 overflow-auto {error ? 'text-red-500' : 'text-white'}"
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