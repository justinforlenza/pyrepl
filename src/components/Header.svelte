<script lang="ts">
import { editor } from '$lib/state'
import { page } from '$app/state'

import Switcher from './header/Switcher.svelte'
import Name from './header/Name.svelte'

import GithubOutline from '~icons/teenyicons/github-outline'

let sharedName = $derived(page.url.searchParams.get('name'))
</script>

<header>
  <div class="flex">
    <div class="app-name">
      <h5>
        PyREPL
      </h5>
      <small>v{PKG.version}</small>
    </div>
    {#if !editor.readOnly}
      <div class="seperator">
        /
      </div>
      <Name />
      <Switcher />
    {:else if sharedName}
      <div class="seperator">
        /
      </div>
      <span>
        {sharedName}
      </span>
    {/if}
  </div>
  <a
    href="https://github.com/justinforlenza/pyrepl"
    target="_blank"
    aria-label="view source code"
    title="View Source Code"
    class="btn"
  >
    <GithubOutline />
</a>
</header>

<style>
  header {
    grid-area: header;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: var(--pad-s);
    overflow: hidden;
    gap: var(--pad-s);

    > div:first-child {
      align-items: center;
      overflow: hidden;
    }

    .app-name {
      display: flex;
      flex-direction: column;
      align-items: center;
      h5 {
        line-height: var(--lh-s);
      }
      small {
        font-family: monospace;
        color: var(--slate-6);
      }
    }

    .seperator {
      color: var(--slate-5);
      scale: 1.5;
    }
  }
</style>