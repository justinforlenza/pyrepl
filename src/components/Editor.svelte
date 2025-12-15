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
  class="rounded-lg overflow-hidden bg-white transition-all border-1 border-slate-4"
  styles={{
    '&': {
      height: '100%',
      fontSize: '18px'
    }
  }}
/>