<script lang="ts">
import { db, editor } from '$lib/state'
import { goto } from '$app/navigation'
import Button from './ui/Button.svelte'

async function saveAsNew() {
  if (!db.ready) return

  const id = await db.create()
  db.setCurrentId(id)
  db.updateCurrentRepl(editor.value)
  editor.readOnly = false
  goto('/')
}
</script>

{#if editor.readOnly}
  <div class="grid-area-[banner] bg-gray-50 border-1 border-gray-4 px-2 py-1.5 flex items-center justify-between gap-2 rounded">
    <p class="text-md text-gray-8 font-sans font-bold">
      You're viewing a shared REPL (read-only)
    </p>
    <Button variant="blue" onclick={saveAsNew}>
      Save
    </Button>
  </div>
{/if}
