<script lang="ts">
import { page } from '$app/state'
import { repls } from '$lib/state'

const MIN_INPUT_WIDTH = 200

let newName = $state('')
let isEditing = $state(false)
let inputWidth = $state(100)

let inputElement: HTMLInputElement | undefined = $state()
let measureElement: HTMLSpanElement | undefined = $state()

$effect(() => {
  if (measureElement && newName) {
    const newWidth = measureElement.offsetWidth + 4
    if (newWidth < MIN_INPUT_WIDTH) {
      inputWidth = MIN_INPUT_WIDTH
    } else {
      inputWidth = newWidth
    }
  } else {
    inputWidth = MIN_INPUT_WIDTH
  }
})

$effect(() => {
  if (!repls.ready) return
  const currentRepl = repls.getCurrentRepl()
  newName = currentRepl?.name ?? 'Untitled'
})

function startEdit() {
  isEditing = true

  // Focus input after it's rendered
  setTimeout(() => {
    if (inputElement) {
      inputElement.focus()
      inputElement.select()
    }
  }, 0)
}

function saveEdit() {
  if (newName.trim() !== '') {
    repls.updateCurrentReplName(newName)
  }
  isEditing = false
}

function cancelEdit() {
  isEditing = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    saveEdit()
  } else if (e.key === 'Escape') {
    cancelEdit()
  }
}
</script>


 <div class="relative md:max-w-96 flex items-center gap-2 overflow-hidden">
  <span
    bind:this={measureElement}
    class="text-lg font-sans px-2 py-1 absolute invisible whitespace-pre"
    aria-hidden="true"
  >
    {newName}
  </span>
  
  {#if isEditing}
    <input
      bind:this={inputElement}
      bind:value={newName}
      onkeydown={handleKeydown}
      onblur={saveEdit}
      style="width: {inputWidth}px; max-width: 100%;"
      class="text-lg font-sans bg-white border-1 border-slate-4 rounded px-2 py-1 text-slate-8 outline-none transition-all"
      type="text"
      aria-label="New REPL Name"
      placeholder="REPL name"
    />
  {:else}
    <button
      onclick={startEdit}
      style="width: {inputWidth}px"
      class="text-left text-lg font-sans min-w-50 text-slate-8 hover:text-slate-6 transition-all cursor-text px-2 py-1 rounded hover:bg-slate-1 w-full truncate"
      aria-label="Edit REPL name"
    >
      {repls.ready ? (repls.getCurrentRepl()?.name ?? 'Untitled') : 'Loading...'}
    </button>
  {/if}
</div>