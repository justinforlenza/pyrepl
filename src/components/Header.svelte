<script lang="ts">
import Button from './ui/Button.svelte'
import Switcher from './header/Switcher.svelte'
import Name from './header/Name.svelte'
import { editor } from '$lib/state'
import { page } from '$app/state'

let sharedName = $derived(page.url.searchParams.get('name'))
</script>

<header class="grid-area-[header] flex items-center px-2 justify-between overflow-hidden">
  <div class="flex items-center gap-2 md:gap-5 overflow-hidden">
    <div class="flex flex-col">
      <h1 class="text-lg md:text-2xl font-bold font-sans leading-tight">
        PyREPL
      </h1>
      <p class="text-xs font-mono text-slate-6 text-center">v{PKG.version}</p>
    </div>
    {#if !editor.readOnly}
      <div class="text-slate-4 scale-150 md:scale-200">
        /
      </div>
      <Name />
      <Switcher />
    {:else if sharedName}
      <div class="text-slate-4 scale-150 md:scale-200">
        /
      </div>
      <span class="text-lg font-sans px-2 py-1">
        {sharedName}
      </span>
    {/if}
  </div>
  <Button
    href="https://github.com/justinforlenza/pyrepl"
    target="_blank"
    aria-label="view source code"
    title="View Source Code"
    class="ml-3"
  >
    <div class="i-teenyicons:github-outline size-5.75"></div>
  </Button>
</header>

