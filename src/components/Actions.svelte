<script lang="ts">
import { utoa } from '$lib'
import { terminal, worker, editor, repls } from '$lib/state'

import Button from './ui/Button.svelte'

function runPython() {
  terminal.reset()
  worker.run(editor.value)
}

function shareCode() {
  const hash = utoa(editor.value)
  const url = new URL(window.location.toString())
  url.searchParams.set('code', hash)
  if (repls.ready)
    url.searchParams.set('name', repls.getCurrentRepl()?.name ?? 'untitled')

  navigator.clipboard.writeText(url.toString())
  alert('Link Copied')
}
</script>
<svelte:options runes={true} />

<div class="grid-area-[actions] flex items-center justify-center lg:justify-between px-2">
  <div class="hidden lg:flex gap-2">
    <Button
      title={`${terminal.expanded ? 'Shrink' : 'Expand'} Output`}
      aria-label={`${terminal.expanded ? 'shrink' : 'expand'} code output`}
      aria-details="toggle expanded code output"
      aria-pressed={terminal.expanded}
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
    <Button
      title={`${terminal.fullWidth ? 'Exit' : 'Enter'} Full Width Mode`}
      aria-label={`${terminal.fullWidth ? 'exit' : 'enter'} full width terminal mode`}
      aria-details="toggle full width terminal"
      aria-pressed={terminal.fullWidth}
      onclick={() => {
        terminal.fullWidth = !terminal.fullWidth
        setTimeout(()=> {
          terminal.resize()
        }, 250)
      }}
    >
      {#if terminal.fullWidth}
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5.75" viewBox="0 0 15 15"><!-- Icon from Teenyicons by smhmd - https://github.com/teenyicons/teenyicons/blob/master/LICENSE --><path fill="none" stroke="currentColor" d="M9.5 9.5H13m-3.5 0V13m0-3.5l4 4m-.5-8H9.5m0 0V2m0 3.5l4-4M2 5.5h3.5m0 0V2m0 3.5l-4-4m4 11.5V9.5m0 0H2m3.5 0l-4 4"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5.75" viewBox="0 0 15 15"><!-- Icon from Teenyicons by smhmd - https://github.com/teenyicons/teenyicons/blob/master/LICENSE --><path fill="none" stroke="currentColor" d="M13.5 13.5H10m3.5 0V10m0 3.5l-4-4m.5-8h3.5m0 0V5m0-3.5l-4 4M5 1.5H1.5m0 0V5m0-3.5l4 4m-4 4.5v3.5m0 0H5m-3.5 0l4-4"/></svg>      
      {/if}
    </Button>
  </div>
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