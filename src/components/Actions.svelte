<script lang="ts">
import { utoa } from '$lib'
import { terminal, worker, editor, repls } from '$lib/state'

import RightOutline from '~icons/teenyicons/right-outline'
import LeftOutline from '~icons/teenyicons/left-outline'
import MinimiseOutline from '~icons/teenyicons/minimise-outline'
import ExpandOutline from '~icons/teenyicons/expand-outline'

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

<div class="actions">
  <div>
    <button
      title={`${terminal.expanded ? 'Shrink' : 'Expand'} Output`}
      aria-label={`${terminal.expanded ? 'shrink' : 'expand'} code output`}
      aria-details="toggle expanded code output"
      aria-pressed={terminal.expanded}
      onclick={() => {
        terminal.expanded = !terminal.expanded
        setTimeout(()=> {
          console.debug('[pyrepl:actions] resizing terminal after expand toggle')
          terminal.resize()
        }, 250)
      }}
    >
      {#if terminal.expanded}
        <RightOutline  />
      {:else}
        <LeftOutline />
      {/if}
    </button>
    <button
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
        <MinimiseOutline />
      {:else}
        <ExpandOutline />
      {/if}
    </button>
  </div>
  <div>
    {#if worker.running}
      <button
        class="error"
        aria-details="stop running code in code repl"
        onclick={stopPython}
      >
        Stop
      </button>
    {:else}
      <button
        class="success"
        aria-details="run code in code repl"
        onclick={runPython}
      >
        Run
      </button>
    {/if}

    <button
      class="primary"
      aria-details="copy share link to code repl"
      onclick={shareCode}
    >
      Share
    </button>
  </div>

</div>

<style>
  .actions {
    grid-area: actions;
    display: flex;
    justify-content: space-between;

    div {
      display: flex;
      align-items: center;
    }
    
    :first-child {
      gap: var(--pad-m);
    }

    :last-child {
      gap: var(--pad-l)
    }
  }
</style>