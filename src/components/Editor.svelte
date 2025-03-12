<script lang="ts">
import { replaceState } from '$app/navigation'
import { page } from '$app/state'

import CodeMirror from 'svelte-codemirror-editor'
import { python } from '@codemirror/lang-python'

import { app } from '$lib/state'
import { atou, utoa } from '$lib'


// try {
//   app.value = atou(page.url.searchParams.get('code') ?? '')
// } catch (e) {
//   // @ts-expect-error error type unknown
//   if (e.name === 'InvalidCharacterError') {
//     let [url, hash] = window.location.toString().split('?code=')
//     if (hash !== undefined) {
//       window.location.assign(`${url}?code=${encodeURIComponent(hash)}`)
//     }
//   }
// }

// const encodeCode = (code: string) => {
//   if (typeof window === 'undefined' || code === '') return

//   const hash = utoa(code)

//   if (page.url.searchParams.get('code') !== hash) {
//     replaceState(`?code=${encodeURIComponent(hash)}`, {})
//   }
// }

// $: encodeCode(app.value)
</script>


<CodeMirror
  bind:value={app.value}
  lang={python()}
  class="rounded-xl overflow-hidden bg-white transition-all"
  styles={{
    '&': {
      height: '100%',
      fontSize: '18px'
    }
  }}
/>