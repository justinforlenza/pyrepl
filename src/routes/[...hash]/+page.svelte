<script lang="ts">
// redirect to /?code={hash} for the old slug based URL


import { goto } from '$app/navigation'
import { page } from '$app/state'
import { onMount } from 'svelte'

onMount(() => {
  if (page.params.hash === undefined) return
  goto(`/?code=${encodeURIComponent(page.params.hash)}`)
})
</script>
