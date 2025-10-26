<script lang="ts">
import Dialog from '../ui/Dialog.svelte'
import Button from '../ui/Button.svelte'
import { db } from '$lib/state'

let open = $state(false)

let repls = $derived(db.ready ? db.repls.find().fetch() : [])

function switchToRepl(id: string) {
  db.setCurrentId(id)
  open = false
}

async function createNewRepl() {
  const id = await db.create()
  db.setCurrentId(id)
  open = false
}

async function deleteRepl(id: string) {
  await db.delete(id)
}

const sortedRepls = $derived(
  [...repls].sort(
    (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
  ),
)
</script>


<Button
  onclick={() => (open = true)}
  aria-label="Open REPL Management"
  title="Manage Your REPLs"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="size-5.75" viewBox="0 0 15 15"><path fill="currentColor" d="m10.5.5l.277-.416L10.651 0H10.5zm3 2h.5v-.268l-.223-.148zm-1 9.5h-8v1h8zM4 11.5v-10H3v10zM4.5 1h6V0h-6zM13 2.5v9h1v-9zM10.223.916l3 2l.554-.832l-3-2zM4.5 12a.5.5 0 0 1-.5-.5H3A1.5 1.5 0 0 0 4.5 13zm8 1a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5zM4 1.5a.5.5 0 0 1 .5-.5V0A1.5 1.5 0 0 0 3 1.5zm-3 2v10h1v-10zM2.5 15h8v-1h-8zm0-12h1V2h-1zM12 13.5v-1h-1v1zM10.5 15a1.5 1.5 0 0 0 1.5-1.5h-1a.5.5 0 0 1-.5.5zM1 13.5A1.5 1.5 0 0 0 2.5 15v-1a.5.5 0 0 1-.5-.5zm1-10a.5.5 0 0 1 .5-.5V2A1.5 1.5 0 0 0 1 3.5z"/></svg>
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
          {@const isCurrent = repl.id === db.currentReplId}
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

            {#if repls.length > 1}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15">
                  <path fill="none" stroke="currentColor" d="M4.5 3V1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V3M0 3.5h15m-13.5 0v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-10M7.5 7v5m-3-3v3m6-3v3" stroke-width="1"/>
                </svg>
              </Button>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>
</Dialog>
