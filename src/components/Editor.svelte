<script lang="ts">
import CodeMirror from 'svelte-codemirror-editor'
import { python } from '@codemirror/lang-python'

import { editor } from '$lib/state'
</script>

<CodeMirror
  bind:value={editor.value}
  readonly={editor.readOnly}
  lang={python()}
  tabSize={4}
  class="editor"
  styles={{
    '&': {
      height: '100%',
      fontSize: '18px'
    }
  }}
/>

<style>
  :global(.editor) {
    grid-area: editor;
    background-color: white;
    border-radius: var(--br-m);
    overflow: hidden;
    border: 1px solid var(--slate-3);
  }
</style>