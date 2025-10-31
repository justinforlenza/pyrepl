import { REPLCollection, type REPL } from '$lib/db.svelte'
import { nanoid } from 'nanoid'

class REPLState {
  store: REPLCollection = new REPLCollection()

  ready: boolean = $state(false)

  currentReplId: string | null = $state(localStorage.getItem('currentRepl'))

  setCurrentId(id: string) {
    this.currentReplId = id
    localStorage.setItem('currentRepl', id)
  }

  getCurrentRepl() {
    return this.store.findOne({ id: { $eq: this.currentReplId ?? '' } })
  }

  updateCurrentRepl(code: string) {
    if (this.currentReplId === null || !this.ready) return
    this.store.updateOne(
      { id: { $eq: this.currentReplId } },
      { $set: { code, updated: new Date().toISOString() } },
    )
  }

  updateCurrentReplName(name: string) {
    if (this.currentReplId === null || !this.ready) return
    const trimmedName = name.trim()
    if (trimmedName === '') return
    this.store.updateOne(
      { id: { $eq: this.currentReplId } },
      { $set: { name: trimmedName, updated: new Date().toISOString() } },
    )
  }

  async create(value: Partial<REPL> = {}): Promise<string> {
    if (!this.ready) throw new Error('Database not ready')

    let finalName = value.name ?? 'Untitled'

    // If no custom name provided, check for existing "Untitled" names
    if (value.name === undefined) {
      const existingNames = this.store
        .find()
        .fetch()
        .map((repl) => repl.name)

      if (existingNames.includes('Untitled')) {
        let counter = 2
        while (existingNames.includes(`Untitled (${counter})`)) {
          counter++
        }
        finalName = `Untitled (${counter})`
      }
    }

    return await this.store.insert({
      id: nanoid(),
      name: finalName,
      code: value.code ?? '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    })
  }

  findId(): string | undefined {
    if (!this.ready) throw new Error('Database not ready')

    const repl = this.store.findOne({})

    return repl?.id
  }

  async delete(id: string) {
    if (!this.ready) throw new Error('Database not ready')

    this.store.removeOne({ id: { $eq: id } })

    if (this.currentReplId === id) {
      const nextId = this.findId()

      if (nextId === undefined) {
        const id = await this.create()

        this.setCurrentId(id)
      } else {
        this.setCurrentId(nextId)
      }
    }
  }

  constructor() {
    this.store.isReady().then(async () => {
      this.ready = true

      const count = this.store.find().count()

      if (count === 0) {
        const id = await this.create()

        this.setCurrentId(id)
      } else {
        const repl = this.store.findOne({
          id: { $eq: this.currentReplId ?? '' },
        })
        if (repl === undefined) {
          const id = this.findId()

          if (id === undefined) {
            throw new Error('Somehow no REPL found?!')
          }

          this.setCurrentId(id)
        }
      }
    })
  }
}

const repls = new REPLState()

export { repls }
