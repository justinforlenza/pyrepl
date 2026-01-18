<script lang="ts">
import { repls, editor } from '$lib/state'
import { goto } from '$app/navigation'
import Button from './ui/Button.svelte'
import { page } from '$app/state'

let sharedName = $derived(page.url.searchParams.get('name'))

async function saveAsNew() {
  if (!repls.ready) return

  const id = await repls.create({
    name: sharedName ?? 'Untitled',
    code: editor.value,
  })
  repls.setCurrentId(id)
  editor.readOnly = false
  goto('/')
}
</script>

{#if editor.readOnly}
  <div class="primary alert split">
    <div>
      <h5>Read Only Mode</h5>
      <p class="fs-xs">You are viewing a shared REPL, save a copy to make changes</p>
    </div>
    <button onclick={saveAsNew}>
      Save
    </button>
  </div>
{/if}

<style>
  .alert {
    grid-area: banner;
  }
</style>
