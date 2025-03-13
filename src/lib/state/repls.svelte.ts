import { REPLCollection } from '$lib/db.svelte'

class REPLState {
  data: REPLCollection = new REPLCollection()

  ready: boolean = $state(false)

  current: string | null = $state(localStorage.getItem('currentRepl'))

  setCurrent(id: string) {
    this.current = id
    localStorage.setItem('currentRepl', id)
  }

  getCurrentRepl() {
    return this.data.findOne({ id: { $eq: this.current ?? '' } })
  }

  updateCurrentRepl(code: string) {
    if (this.current === null || !this.ready) return
    this.data.updateOne({ id: { $eq: this.current } }, { $set: { code, updated: new Date().toISOString() } })
  }

  constructor() {
    this.data.isReady().then(async () => {
      const count = this.data.find().count()

      if (count === 0) {
        const id = await this.data.create()

        this.setCurrent(id)
      } else {
        const repl = this.data.findOne({ id: { $eq: this.current ?? '' } })
        if (repl === undefined) {
          const repl = this.data.findOne({})

          // biome-ignore lint/style/noNonNullAssertion: based on the original if, repl is not undefined
          this.setCurrent(repl!.id)
        }
      }

      this.ready = true
    })
  }
}


const repls = new REPLState()

export { repls }