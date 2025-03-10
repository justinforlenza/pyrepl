import { sveltekit } from '@sveltejs/kit/vite'
import UnoCSS from '@unocss/svelte-scoped/vite'
import { defineConfig } from 'vite'

import { copyFile, mkdir } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const file = fileURLToPath(new URL('package.json', import.meta.url))
const json = readFileSync(file, 'utf8')
const pkg = JSON.parse(json)

console.log(typeof pkg.version)

export default defineConfig({
  plugins: [
    sveltekit(),
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css',
    }),
    {
      name: 'vite-plugin-pyodide',
      buildStart: async () => {
        const assetsDir = 'static/_app/immutable/workers/'
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
      'pyodide',
      '@battlefieldduck/xterm-svelte'
    ],
  },
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  worker: {
    format: 'es',
  },
  define: {
    PKG: pkg
  }
})
