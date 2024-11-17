import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from '@unocss/svelte-scoped/vite'
import { defineConfig } from 'vite'

import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    sveltekit(),
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css',
    }),
    {
      name: 'vite-plugin-pyodide',
      buildStart: async () => {
        const assetsDir = 'static/_app/immutable/nodes/'
        await mkdir(assetsDir, { recursive: true })
        const files = [
          'pyodide-lock.json',
          'pyodide.asm.js',
          'pyodide.asm.wasm',
          'python_stdlib.zip',
        ]
        const modulePath = fileURLToPath(import.meta.resolve('pyodide'))
        for (const file of files) {
          await copyFile(join(dirname(modulePath), file), join(assetsDir, file))
        }
      },
    },
  ],
  optimizeDeps: {
    exclude: [
      'svelte-codemirror-editor',
      'codemirror',
      '@codemirror/language-javascript',
      'pyodide',
    ],
  },
})
