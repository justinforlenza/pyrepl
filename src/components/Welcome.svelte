<script lang="ts">
import Dialog from './ui/Dialog.svelte'
import Button from './ui/Button.svelte'

let open = $state(false)

$effect(() => {
  if (typeof window !== 'undefined') {
    const dismissed = JSON.parse(
      localStorage.getItem('welcomeDismissed') ?? 'false',
    )
    if (!dismissed) {
      open = true
    }
  }
})

$effect(() => {
  if (!open) {
    localStorage.setItem('welcomeDismissed', 'true')
  }
})
</script>

<Dialog bind:open>
  <div class="flex flex-col gap-4">
    <h1 class="text-center text-2xl font-sans text-slate-8">Welcome to PyREPL</h1>

    <p class="text-slate-7 text-base leading-relaxed">
      PyREPL is a web-based Python REPL environment that runs entirely in your browser using WebAssembly.
    </p>

    <div class="flex flex-col gap-3">
      <h2 class="text-lg font-sans text-slate-8">Key Features:</h2>
      <ul class="text-slate-7 text-base leading-relaxed list-disc pl-5 space-y-2">
        <li>Write and execute Python code instantly</li>
        <li>Multiple REPL sessions with persistent storage</li>
        <li>Share code snippets via URL</li>
        <li>No server, no login - Your code stays on your device</li>
      </ul>
    </div>

    <div class="flex justify-end mt-2">
      <Button variant="blue" onclick={() => open = false}>
        Get Started
      </Button>
    </div>
  </div>
</Dialog>