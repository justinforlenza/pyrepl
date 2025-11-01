import { defineConfig } from 'unocss'

import presetWind from '@unocss/preset-wind3'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind(),
    presetIcons(),
    presetWebFonts({
      provider: 'none',
      fonts: {
        sans: 'Space Grotesk',
      },
    }),
  ],
})
