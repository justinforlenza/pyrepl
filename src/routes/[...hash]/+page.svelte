<script lang="ts">
// redirect to /?code={hash} for the old slug based URL


import { goto } from '$app/navigation'
import { page } from '$app/state'
import { onMount } from 'svelte'

onMount(() => {
  goto(`/?code=${encodeURIComponent(page.params.hash)}`)
})
</script>
