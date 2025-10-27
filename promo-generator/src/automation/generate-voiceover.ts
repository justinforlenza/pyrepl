import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { SCENES } from '../config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '../../public/audio')

async function generateVoiceover() {
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    console.error('❌ ELEVENLABS_API_KEY not found in environment variables')
    console.log('💡 Create a .env file with: ELEVENLABS_API_KEY=your_key_here')
    process.exit(1)
  }

  console.log('🎙️  Generating AI voiceovers with ElevenLabs...\n')

  const client = new ElevenLabsClient({ apiKey })

  for (const scene of SCENES) {
    if (!scene.voiceover) continue

    console.log(`📝 Generating: ${scene.name}`)
    console.log(`   Text: "${scene.voiceover}"`)

    try {
      const audio = await client.textToSpeech.convert('21m00Tcm4TlvDq8ikWAM', {
        text: scene.voiceover,
        modelId: 'eleven_multilingual_v2',
      })

      const outputPath = path.join(OUTPUT_DIR, `${scene.name}-voiceover.mp3`)

      // Convert ReadableStream to Buffer
      const chunks: Uint8Array[] = []
      for await (const chunk of audio as any) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)

      fs.writeFileSync(outputPath, buffer)
      console.log(`   ✅ Saved: ${outputPath}\n`)
    } catch (error) {
      console.error(`   ❌ Failed: ${error}\n`)
    }
  }

  console.log('🎉 Voiceover generation complete!')
  console.log(`📁 Files saved to: ${OUTPUT_DIR}`)
}

generateVoiceover()
