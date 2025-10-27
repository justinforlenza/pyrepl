import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '../../../')

const OUTPUT_DIR = path.join(__dirname, '../../public/footage')
const APP_URL = 'http://localhost:5173'

// Python code examples to demonstrate
const PYTHON_EXAMPLES = {
  hello: `print("Hello, PyREPL!")
for i in range(5):
    print(f"Number {i}")`,

  dataAnalysis: `# Data Analysis Example
import statistics
data = [23, 45, 12, 78, 34, 56, 89, 23]
print(f"Mean: {statistics.mean(data)}")
print(f"Median: {statistics.median(data)}")`,
}

async function startDevServer() {
  console.log('🚀 Starting dev server...')
  const server = spawn('bun', ['run', 'dev'], {
    cwd: projectRoot,
    shell: true,
  })

  // Wait for server to be ready
  await new Promise((resolve) => {
    server.stdout?.on('data', (data) => {
      const output = data.toString()
      console.log(output)
      if (output.includes('Local:') || output.includes('localhost')) {
        setTimeout(resolve, 2000) // Extra time for full initialization
      }
    })
  })

  return server
}

async function captureScene1(page: any) {
  console.log('🎬 Capturing Scene 1: Hook')

  await page.goto(APP_URL)
  await page.waitForTimeout(2000)

  // Just show the clean interface
  await page.waitForTimeout(3000)
}

async function captureScene2(page: any, context: any) {
  console.log('🎬 Capturing Scene 2: Running Python Code')

  await page.goto(APP_URL)
  await page.waitForTimeout(2000)

  // Start recording
  await context.startVideo(page)

  // Type Python code
  const editor = page.locator('.cm-content')
  await editor.click()
  await editor.fill(PYTHON_EXAMPLES.hello)
  await page.waitForTimeout(1000)

  // Click Run button
  const runButton = page.getByRole('button', { name: /run/i })
  await runButton.click()

  // Wait for output to appear
  await page.waitForTimeout(3000)

  // Stop recording
  const video = await context.stopVideo()
  await video.saveAs(path.join(OUTPUT_DIR, 'run-code.mp4'))
}

async function captureScene3(page: any, context: any) {
  console.log('🎬 Capturing Scene 3: Sharing Code')

  // Start recording
  await context.startVideo(page)

  // Click Share button
  const shareButton = page.getByRole('button', { name: /share/i })
  await shareButton.click()

  // Wait for share dialog/action
  await page.waitForTimeout(2000)

  // Show URL being copied (if there's a visual indicator)
  await page.waitForTimeout(2000)

  // Stop recording
  const video = await context.stopVideo()
  await video.saveAs(path.join(OUTPUT_DIR, 'share-code.mp4'))
}

async function captureScene4(page: any, context: any) {
  console.log('🎬 Capturing Scene 4: Multiple REPLs')

  // Create a few REPLs first
  for (let i = 1; i <= 3; i++) {
    const newButton = page.getByRole('button', { name: /new/i }).first()
    await newButton.click()
    await page.waitForTimeout(500)
  }

  // Start recording
  await context.startVideo(page)

  // Show REPL selector/list
  const replSelector = page.locator('[role="combobox"]').first()
  if (await replSelector.isVisible()) {
    await replSelector.click()
    await page.waitForTimeout(1500)

    // Click through a couple REPLs
    const replOptions = page.locator('[role="option"]')
    if ((await replOptions.count()) > 0) {
      await replOptions.nth(1).click()
      await page.waitForTimeout(1000)
    }
  }

  await page.waitForTimeout(2000)

  // Stop recording
  const video = await context.stopVideo()
  await video.saveAs(path.join(OUTPUT_DIR, 'manage-repls.mp4'))
}

async function main() {
  console.log('🎥 PyREPL Promo Video Capture Script\n')

  // Start dev server
  const server = await startDevServer()

  try {
    // Launch browser with video recording
    const browser = await chromium.launch({
      headless: false, // Set to true for automated runs
    })

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: OUTPUT_DIR,
        size: { width: 1920, height: 1080 },
      },
    })

    const page = await context.newPage()

    // Capture all scenes
    await captureScene1(page)
    await captureScene2(page, context)
    await captureScene3(page, context)
    await captureScene4(page, context)

    await context.close()
    await browser.close()

    console.log('\n✅ All scenes captured successfully!')
    console.log(`📁 Videos saved to: ${OUTPUT_DIR}`)
  } catch (error) {
    console.error('❌ Error capturing scenes:', error)
  } finally {
    // Kill dev server
    server.kill()
    process.exit(0)
  }
}

main()
