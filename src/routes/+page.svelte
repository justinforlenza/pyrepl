<script lang="ts">
import CodeMirror from 'svelte-codemirror-editor'
import { python } from '@codemirror/lang-python'

import { loadPyodide } from 'pyodide'

type PyError = {message: string}

let value = ''
let output = ''
let error = false

const runPython = async () => {
  output = ''
  error = false
  const pyodide = await loadPyodide()

  pyodide.runPython(`
    import sys
    import io
    sys.stdout = io.StringIO()
  `)
  try{
    await pyodide.runPythonAsync(value)
    output = pyodide.runPython('sys.stdout.getvalue()')
  } catch (err) {
    error = true
    // @ts-expect-error unknown types
    output = err.message
    console.log(typeof output)
  }
}
</script>

<main class="h-100vh grid gap-2 p-2 bg-slate-200">
  <header class="grid-area-[header] flex items-center justify-between px-2">
    <h1 class="text-2xl font-bold font-sans">
      PyREPL
    </h1>
    <button 
      class=" font-sans px-6 py-1 rounded text-lg bg-slate-50 border-slate-400 border-1 hover:bg-slate-100"
      on:click={runPython}
    >
      Run Code
    </button>
  </header>
  <CodeMirror
    bind:value 
    lang={python()}
    class="rounded-xl overflow-hidden bg-white"
    styles={{
      '&': {
        height: '100%'
      }
    }}
  />
  <pre 
    class="grid-area-[output] bg-black rounded-xl p-2 px-4 overflow-scroll {error ? 'text-red-500' : 'text-white'}"
  >{output}</pre>
</main>

<style>
main {
  grid-template-columns: 1.2fr minmax(400px, 0.8fr); 
  grid-template-rows: 48px 1fr; 
  grid-template-areas: 
    "header header"
    "editor output"; 
}
</style>