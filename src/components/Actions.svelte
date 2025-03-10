<script lang="ts">
import { app } from '$lib/state'
import { eventType } from '$lib/worker/events'

import spinner from '../svg/spinner.svg?raw'

const runPython = async () => {
  if (app.running || !app.ready) return
  app.running = true

  app.terminal?.reset()
  app.worker.postMessage({
    type: eventType.run,
    code: app.value,
  })
}
</script>

<div class="grid-area-[actions] flex items-center justify-center lg:justify-between px-2">
  <button 
    class="hidden lg:block font-sans px-5 py-2 rounded text-lg bg-slate-50 border-slate-4 border-1 hover:bg-slate-1 text-slate-8"
    title={`${app.expanded ? 'Shrink' : 'Expand'} Output`}
    aria-label={`${app.expanded ? 'shrink' : 'expand'} code output`}
    aria-details="toggle expanded code output"
    aria-pressed={app.expanded}
    on:click={() => {
      app.expanded = !app.expanded
      setTimeout(()=> {
        app.resize()
      }, 250)
    }}
  >
    {#if app.expanded}
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M5 14l7-6.5L5 1" stroke="currentColor" stroke-linecap="square"></path></svg>
    {:else}
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5"><path d="M10 14L3 7.5 10 1" stroke="currentColor" stroke-linecap="square"></path></svg>
    {/if}
  </button>
  <div class="flex gap-4">
    <button 
      class="font-sans px-6 py-1 rounded text-lg bg-green-50 border-green-4 border-1 hover:bg-green-1 text-green-8 relative"
      class:text-transparent={app.running}
      aria-details="run code"
      on:click={runPython}
    >
      {#if app.running}
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