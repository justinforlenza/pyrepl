<script lang="ts">
import Dialog from '../ui/Dialog.svelte'
import Button from '../ui/Button.svelte'
import { repls } from '$lib/state'

let open = $state(false)

let userRepls = $derived(repls.ready ? repls.store.find().fetch() : [])

function switchToRepl(id: string) {
  repls.setCurrentId(id)
  open = false
}

async function createNewRepl() {
  const id = await repls.create()
  repls.setCurrentId(id)
  open = false
}

async function deleteRepl(id: string) {
  await repls.delete(id)
}

const sortedRepls = $derived(
  [...userRepls].sort(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
  ),
)
</script>


<Button
  onclick={() => (open = true)}
  aria-label="Open REPL Management"
  title="Manage Your REPLs"
>
  <div class="i-teenyicons-documents-outline size-5.75"></div>
</Button>

<Dialog bind:open>
  {#snippet title()}
    <h2 class="text-2xl font-bold text-slate-8">Your REPLs</h2>
  {/snippet}

  <div class="flex flex-col gap-3 overflow-hidden">
    <Button
      variant="green"
      onclick={createNewRepl}
      class="w-full"
      aria-label="Create new REPL"
      title="Create New REPL"
    >
      New REPL
    </Button>

    <div class="border-t-1 border-slate-4 pt-3">
      <div class="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {#each sortedRepls as repl (repl.id)}
          {@const isCurrent = repl.id === repls.currentReplId}
          <div
            class="flex items-center gap-2 p-3 rounded border-1 transition-all {isCurrent ? 'bg-blue-50 border-blue-4' : 'bg-white border-slate-4 hover:bg-slate-1'}"
          >
            <button
              onclick={() => switchToRepl(repl.id)}
              class="flex-1 text-left min-w-0"
              aria-label="Switch to {repl.name}"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="font-sans text-lg text-slate-8 truncate">
                  {repl.name}
                </span>
                {#if isCurrent}
                  <span class="text-xs font-mono text-blue-8 bg-blue-1 px-2 py-1 rounded whitespace-nowrap">
                    Current
                  </span>
                {/if}
              </div>
              <span class="text-sm text-slate-6 font-mono">
                Updated {repl.updated}
              </span>
            </button>

            {#if userRepls.length > 1}
              <Button
                onclick={(e) => {
                  e.stopPropagation()
                  deleteRepl(repl.id)
                }}
                aria-label="Delete {repl.name}"
                title="Delete REPL"
                variant="red"
                size="sm"
              >
                <div class="i-teenyicons:bin-outline"></div>
              </Button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</Dialog>
