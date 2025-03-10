import { defineConfig } from 'unocss'

import presetWind from '@unocss/preset-wind3'
import presetWebFonts from '@unocss/preset-web-fonts'

export default defineConfig({
  presets: [
    presetWind(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'Space Grotesk',
      },
    }),
  ],
})
