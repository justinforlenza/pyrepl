import { Collection, createIndex } from '@signaldb/core'
import createIndexedDBAdapter from '@signaldb/indexeddb'
import svelteReactivityAdapter from "@signaldb/svelte"

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
      reactivity: svelteReactivityAdapter,
    })
  }
}

