import { Collection, createIndex } from '@signaldb/core'
import createIndexedDBAdapter from '@signaldb/indexeddb'
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
}

