<script lang="ts">
import type { Snippet } from 'svelte'

import { Dialog, type WithoutChild } from 'bits-ui'

type DialogProps = Dialog.RootProps & {
  buttonText?: string
  title?: Snippet
  description?: Snippet
  contentProps?: WithoutChild<Dialog.ContentProps>
}

let {
  open = $bindable(false),
  children,
  buttonText,
  contentProps,
  title,
  description,
  ...restProps
}: DialogProps = $props()
</script>

<Dialog.Root bind:open {...restProps}>
  <Dialog.Portal>
    <Dialog.Overlay class="bg-slate-8/80 fixed inset-0 z-50" />
    <Dialog.Content 
        {...contentProps}
        class="bg-slate-1 rounded fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg md:w-full focus:outline-none font-sans"
      >
      {#if title}
        <Dialog.Title>
          {@render title?.()}
        </Dialog.Title>
      {/if}
      {#if description}
        <Dialog.Description>
          {@render description?.()}
        </Dialog.Description>
      {/if}
      {@render children?.()}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>