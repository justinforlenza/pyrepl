<script lang="ts">
import { onMount } from 'svelte'

import Terminal from '../components/Terminal.svelte'
import Actions from '../components/Actions.svelte'
import Editor from '../components/Editor.svelte'
import Header from '../components/Header.svelte'
// import Welcome from '../components/Welcome.svelte'

import { repls, app } from '$lib/state'

$effect(() => {
  if (repls.ready) {
    
  }
})
</script>

<svelte:window onresize={app.resize} />

<svelte:head>
  <title>PyREPL - Web Based Python Environment</title>
</svelte:head>
<!-- <Welcome /> -->
<main 
  class="gap-2 p-2 bg-slate-2 overflow-hidden transition-all"
  class:biggerTerminal={app.expanded}
>
  <Header />

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
@media (min-width: theme('breakpoints.lg')) {
  main {
    grid-template-columns: 1.2fr minmax(384px, 0.8fr); 
    grid-template-rows: 48px 1fr; 
    grid-template-areas: 
      "header actions"
      "editor output"; 
  }

  main.biggerTerminal {
    grid-template-columns: minmax(384px, 0.8fr) 1.2fr; 
  }
}

:global(.xterm-screen) {
  padding: 1rem
}
</style>
