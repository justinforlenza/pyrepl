import { REPLCollection } from '$lib/db.svelte'

class REPLState {
  data: REPLCollection = new REPLCollection()

  ready: boolean = $state(false)

  currentRepl: string | null = $state(localStorage.getItem('currentRepl'))

  setCurrentRepl(id: string) {
    this.currentRepl = id
    localStorage.setItem('currentRepl', id)
  }

  constructor() {
    this.data.isReady().then(async () => {
      const count = this.data.find().count()

      if (count === 0) {
        const id = await this.data.create()

        this.setCurrentRepl(id)
      } else {
        const repl = this.data.findOne({ id: { $eq: this.currentRepl ?? '' } })
        if (repl === undefined) {
          const repl = this.data.findOne({})

          // biome-ignore lint/style/noNonNullAssertion: based on the original if, repl is not undefined
          this.setCurrentRepl(repl!.id)
        }
      }

      this.ready = true
    })
  }
}


const repls = new REPLState()

export { repls }