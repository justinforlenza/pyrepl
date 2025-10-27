<script lang="ts">
import Terminal from '../components/Terminal.svelte'
import Actions from '../components/Actions.svelte'
import Editor from '../components/Editor.svelte'
import Header from '../components/Header.svelte'
import ReadOnlyBanner from '../components/ReadOnlyBanner.svelte'
import Welcome from '../components/Welcome.svelte'

import { db, terminal, editor } from '$lib/state'
import { page } from '$app/state'
import { atou } from '$lib'

let lastLoadedId = $state('')

let sharedCode = $derived(page.url.searchParams.get('code'))

$effect(() => {
  if (sharedCode !== null) {
    try {
      const code = atou(sharedCode)
      if (code !== editor.value) {
        console.debug('[pyrepl] loading shared code from url')
        setTimeout(() => {
          editor.value = code
          editor.readOnly = true
        }, 0)
      }
    } catch (e) {
      // @ts-expect-error error type unknown
      if (e.name === 'InvalidCharacterError') {
        console.warn('[pyrepl] invalid shared code in url')
      }
    }
  } else if (db.ready && lastLoadedId !== db.currentReplId) {
    lastLoadedId = db.currentReplId ?? ''
    console.debug('[pyrepl] loading code from indexedb')
    editor.value = db.getCurrentRepl()?.code ?? ''
  }
})

$effect(() => {
  if (db.ready && !editor.readOnly) {
    const currentRepl = db.getCurrentRepl()
    if (currentRepl === undefined) {
      console.warn('[pyrepl] unable to find current repl')
    } else if (editor.value !== currentRepl.code) {
      console.debug('[pyrepl] updating code in indexedb')
      db.updateCurrentRepl(editor.value)
    }
  }
})
</script>

<svelte:window onresize={terminal.resize} />

<svelte:head>
  <title>PyREPL - Web Based Python Environment</title>
</svelte:head>
<Welcome />
<main
  class="gap-2 p-2 bg-slate-2 overflow-hidden transition-all"
  class:biggerTerminal={terminal.expanded}
  class:readOnly={editor.readOnly}
>
  <Header />

  <ReadOnlyBanner />

  <Actions />

  <Editor />

  <Terminal />
</main>

<style>
main {
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(2, 48px 1fr);
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "editor"
    "actions"
    "output"
}

main.readOnly {
  grid-template-rows: 48px 64px 1fr 48px 1fr;
  grid-template-areas:
    "header"
    "banner"
    "editor"
    "actions"
    "output"
}

@media (min-width: theme('breakpoints.lg')) {
  main {
    grid-template-columns: 1.2fr minmax(384px, 0.8fr);
    grid-template-rows: 48px 1fr;
    grid-template-areas:
      "header actions"
      "editor output";
  }

  main.readOnly {
    grid-template-rows: 48px auto 1fr;
    grid-template-areas:
      "header actions"
      "banner output"
      "editor output";
  }

  main.biggerTerminal {
    grid-template-columns: minmax(384px, 0.8fr) 1.2fr;
  }
}

:global(.xterm) {
  padding: 1rem 1rem 4px;
}
</style>
