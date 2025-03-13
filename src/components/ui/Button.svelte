<script lang="ts">
import type { WithElementRef } from "bits-ui";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

import spinner from '../../svg/spinner.svg?raw'

export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: 'default' | 'blue' | 'green' | 'red'
      loading?: boolean
		};


let { variant = 'default', children, class: classes, loading = false, ...restProps }: ButtonProps = $props()
</script>



<svelte:element
  this="{restProps.href ? 'a' : 'button'}" 
  class="lg:block font-sans px-5 py-2 rounded text-lg border-1 relative {variant} {classes} {loading ? '!text-transparent' : ''}"
  {...restProps}
>
  {#if loading}
    <span class="hidden" aria-live="polite" aria-busy="true">Working ... </span>
    <div class="absolute fill-green-9 h-full w-full flex justify-center items-center top-0 left-0">{@html spinner}</div>
  {/if}
  {@render children?.()}
</svelte:element>

<style>
.default {
  --at-apply: bg-slate-50 border-slate-4 text-slate-8 hover:bg-slate-1;  /**/
}

.blue {
  --at-apply: bg-blue-50 border-blue-4 text-blue-8 hover:bg-blue-1; /**/
}


.green {
  --at-apply: bg-green-50 border-green-4 text-green-8 hover:bg-green-1; /**/
}

.red {
  --at-apply: bg-red-50 border-red-4 text-red-8 hover:bg-red-1; /**/
}
</style>