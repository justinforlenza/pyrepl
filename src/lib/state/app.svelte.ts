import type { Terminal } from '@battlefieldduck/xterm-svelte'

import Worker from '$lib/worker?worker'

class AppState {
  terminal: Terminal | undefined = $state()
  ready: boolean = $state(false)
  running: boolean = $state(false)
  worker: Worker
  resize: () => void = $state(() => {})
  expanded: boolean = $state(false)
  value: string = $state('')

  constructor() {
    this.worker = new Worker()
  }
}

const app = new AppState()

export { app }
