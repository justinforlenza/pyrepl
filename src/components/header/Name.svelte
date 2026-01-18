<script lang="ts">
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


 <div>
  <span
    bind:this={measureElement}
    aria-hidden="true"
    class="fluid"
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
      type="text"
      aria-label="New REPL Name"
      placeholder="REPL name"
    />
  {:else}
    <button
      onclick={startEdit}
      style="width: {inputWidth}px"
      class="unstyled text-left text-lg font-sans min-w-50 text-slate-8 hover:text-slate-6 transition-all cursor-text px-2 py-1 rounded hover:bg-slate-1 w-full truncate"
      aria-label="Edit REPL name"
    >
      {repls.ready ? (repls.getCurrentRepl()?.name ?? 'Untitled') : 'Loading...'}
    </button>
  {/if}
</div>

<style>
  div {
    position: relative;
    overflow: hidden;
    display: flex;
    border-radius: var(--br-s);

    &:has(input:focus-visible) {
      outline: 1px solid var(--blue-5);
    }

    span {
      position: absolute;
      visibility: hidden;
      padding-inline: var(--pad-s);
      line-height: var(--lh-xl);
    }

    button {
      text-align: left;
      background-color: transparent;
      border: 0;
      color: var(--slate-9);
      padding-inline: var(--pad-s);
      line-height: var(--lh-xl);
      cursor: text;

      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        color: var(--slate-6);
        background-color: var(--slate-0);
      }
    }

    input:focus-visible {
      outline: none;
    }

    input {
      margin-block-end: 0;
    }
  }


  @media (width >= 1024px) {
    div {
      max-width: 350px;
    }
  }
</style>