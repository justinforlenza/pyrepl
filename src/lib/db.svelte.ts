import { Collection, createIndex } from '@signaldb/core'
import createIndexedDBAdapter from '@signaldb/indexeddb'

import { nanoid } from 'nanoid'

export interface REPL {
  id: string
  name: string
  code: string
  created: string
  updated: string
}

export class REPLCollection extends Collection<REPL> {
  constructor() {
    super({
      name: 'repls',
      persistence: createIndexedDBAdapter('repls'),
      indices: [createIndex('id'), createIndex('name')],
      reactivity: {
        create() {
          let dep = $state(0)
          return {
            depend() {
              dep
            },
            notify() {
              dep += 1
            },
          }
        },
        isInScope: () => !!$effect.tracking(),
      },
    })
  }

  async create(name?: string): Promise<string> {
    return await this.insert({
      id: nanoid(),
      name: name ?? 'Untitled',
      code: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    })
  }
}

