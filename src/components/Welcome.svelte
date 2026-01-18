<script lang="ts">
let dialog: HTMLDialogElement | undefined

$effect(() => {
  if (typeof window !== 'undefined' && dialog !== undefined) {
    const dismissed = JSON.parse(
      localStorage.getItem('welcomeDismissed') ?? 'false',
    )
    if (!dismissed) {
      dialog.showModal()
    }
  }
})

$effect(() => {
  // if (!open) {
  //   localStorage.setItem('welcomeDismissed', 'true')
  // }
})
</script>

<dialog bind:this={dialog} onclose={() => localStorage.setItem('welcomeDismissed', 'true')} closedby="any">
  <div class="stack">
    <h5>Welcome to PyREPL</h5>

    <p>
      PyREPL is a web-based Python REPL environment that runs entirely in your browser using WebAssembly.
    </p>

    <div class="stack">
      <h6>Key Features:</h6>
      <ul>
        <li>Write and execute Python code instantly</li>
        <li>Multiple REPL sessions with persistent storage</li>
        <li>Share code snippets via URL</li>
        <li><strong>No server, no login</strong> - Your code stays on your device</li>
      </ul>
    </div>

    <div class="flex">
      <button class="primary" onclick={() => dialog?.close()}>
        Get Started
      </button>
    </div>
  </div>
</dialog>

<style>
  dialog {
    color: var(--slate-9);

    h5 {
      text-align: center;
    }

    .flex:last-child {
      justify-content: end;
    }
  }
</style>