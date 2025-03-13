<script lang="ts">
import { app } from '$lib/state'
import { eventType } from '$lib/worker/events'

import Button from './ui/Button.svelte'

function runPython() {
  if (app.running || !app.ready) return
  app.running = true

  app.terminal?.reset()
  app.worker.postMessage({
    type: eventType.run,
    code: app.value,
  })
}

function shareCode() {
  navigator.clipboard.writeText(window.location.toString())
  alert('Link Copied')
}
</script>
<svelte:options runes={true} />

<div class="grid-area-[actions] flex items-center justify-center lg:justify-between px-2">
  <Button
    title={`${app.expanded ? 'Shrink' : 'Expand'} Output`}
    aria-label={`${app.expanded ? 'shrink' : 'expand'} code output`}
    aria-details="toggle expanded code output"
    aria-pressed={app.expanded}
    class="hidden lg:block"
    onclick={() => {
      app.expanded = !app.expanded
      setTimeout(()=> {
        app.resize()
      }, 250)
    }}
  >
    {#if app.expanded}
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5.75"><path d="M5 14l7-6.5L5 1" stroke="currentColor" stroke-linecap="square"></path></svg>
    {:else}
      <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-5.75"><path d="M10 14L3 7.5 10 1" stroke="currentColor" stroke-linecap="square"></path></svg>
    {/if}
  </Button>
  <div class="flex gap-4 items-center">
    <Button
      variant="green"
      aria-details="run code"
      onclick={runPython}
      loading={app.running}
    >
      Run
    </Button>

    <Button 
      variant="blue"
      aria-details="copy share link to code repl"
      onclick={shareCode}
    >
      Share
    </Button>
  </div>

</div>