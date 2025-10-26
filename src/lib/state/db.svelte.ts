import { REPLCollection } from '$lib/db.svelte'
import { nanoid } from 'nanoid'

class DBState {
  repls: REPLCollection = new REPLCollection()

  ready: boolean = $state(false)

  currentReplId: string | null = $state(localStorage.getItem('currentRepl'))

  setCurrentId(id: string) {
    this.currentReplId = id
    localStorage.setItem('currentRepl', id)
  }

  getCurrentRepl() {
    return this.repls.findOne({ id: { $eq: this.currentReplId ?? '' } })
  }

  updateCurrentRepl(code: string) {
    if (this.currentReplId === null || !this.ready) return
    this.repls.updateOne(
      { id: { $eq: this.currentReplId } },
      { $set: { code, updated: new Date().toISOString() } },
    )
  }

  updateCurrentReplName(name: string) {
    if (this.currentReplId === null || !this.ready) return
    const trimmedName = name.trim()
    if (trimmedName === '') return
    this.repls.updateOne(
      { id: { $eq: this.currentReplId } },
      { $set: { name: trimmedName, updated: new Date().toISOString() } },
    )
  }

  async create(name?: string): Promise<string> {
    if (!this.ready) throw new Error('Database not ready')

    let finalName = name ?? 'Untitled'

    // If no custom name provided, check for existing "Untitled" names
    if (!name) {
      const existingNames = this.repls.find().fetch().map(repl => repl.name)

      if (existingNames.includes('Untitled')) {
        let counter = 2
        while (existingNames.includes(`Untitled (${counter})`)) {
          counter++
        }
        finalName = `Untitled (${counter})`
      }
    }

    return await this.repls.insert({
      id: nanoid(),
      name: finalName,
      code: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    })
  }

  findId(): string | undefined {
    if (!this.ready) throw new Error('Database not ready')

    const repl = this.repls.findOne({})

    return repl?.id
  }

  async delete(id: string) {
    if (!this.ready) throw new Error('Database not ready')

    this.repls.removeOne({ id: { $eq: id } })

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
    this.repls.isReady().then(async () => {
      this.ready = true
      
      const count = this.repls.find().count()

      if (count === 0) {
        const id = await this.create()

        this.setCurrentId(id)
      } else {
        const repl = this.repls.findOne({ id: { $eq: this.currentReplId ?? '' } })
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

const db = new DBState()

export { db }
