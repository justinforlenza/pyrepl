<script lang="ts">
import { utoa } from '$lib'
import { terminal, worker, editor, repls } from '$lib/state'

import Button from './ui/Button.svelte'

function runPython() {
  if (worker.running || !worker.ready) return
  terminal.reset()
  setTimeout(() => {
    worker.run(editor.value)
  }, 100)
}

function stopPython() {
  worker.interupt()
  terminal.waitingForInput = false
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
          console.debug('[pyrepl][actions] resizing terminal after expand toggle')
          terminal.resize()
        }, 250)
      }}
    >
      {#if terminal.expanded}
        <div class="i-teenyicons:right-outline size-5.75"></div>
      {:else}
        <div class="i-teenyicons:left-outline size-5.75"></div>
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
        <div class="i-teenyicons:minimise-outline size-5.75"></div>
      {:else}
        <div class="i-teenyicons:expand-outline size-5.75"></div>
      {/if}
    </Button>
  </div>
  <div class="flex gap-4 items-center">
    {#if worker.running}
      <Button
        variant="red"
        aria-details="stop running code in code repl"
        onclick={stopPython}
      >
        Stop
      </Button>
    {:else}
      <Button
        variant="green"
        aria-details="run code in code repl"
        onclick={runPython}
      >
        Run
      </Button>
    {/if}

    <Button
      variant="blue"
      aria-details="copy share link to code repl"
      onclick={shareCode}
    >
      Share
    </Button>
  </div>

</div>
