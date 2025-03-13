import type { Terminal } from '@battlefieldduck/xterm-svelte'

class TerminalState {
  el: Terminal | undefined = $state()
  resize: () => void = $state(() => {})
  expanded  = $state(false)
  currentLine = $state('')
  waitingForInput = $state(false)

  reset () {
    this.el?.reset()
  }
}

const terminal = new TerminalState()

export { terminal }
