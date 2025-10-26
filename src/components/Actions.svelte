<script lang="ts">
import { utoa } from '$lib'
import { terminal, worker, editor } from '$lib/state'

import Button from './ui/Button.svelte'

function runPython() {
  terminal.reset()
  worker.run(editor.value)
}

function shareCode() {
  const hash = utoa(editor.value)
  const url = new URL(window.location.toString())
  url.searchParams.set('code', hash)
  navigator.clipboard.writeText(url.toString())
  alert('Link Copied')
}
</script>
<svelte:options runes={true} />

<div class="grid-area-[actions] flex items-center justify-center lg:justify-between px-2">
  <Button
    title={`${terminal.expanded ? 'Shrink' : 'Expand'} Output`}
    aria-label={`${terminal.expanded ? 'shrink' : 'expand'} code output`}
    aria-details="toggle expanded code output"
    aria-pressed={terminal.expanded}
    class="hidden lg:block"
    onclick={() => {
      terminal.expanded = !terminal.expanded
      setTimeout(()=> {
        terminal.resize()
      }, 250)
    }}
  >
    {#if terminal.expanded}
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
      loading={worker.running}
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