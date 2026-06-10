import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, 'temporary screenshots')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const baseUrl = process.env.SCREENSHOT_BASE_URL || 'http://localhost:5177'
const route = process.argv[2] || '/'
const label = process.argv[3] || ''
const fullPage = process.env.FULL_PAGE !== '0'

function nextIndex() {
  const files = fs.readdirSync(outDir).filter((f) => f.startsWith('screenshot-'))
  const nums = files.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0', 10))
  return (nums.length ? Math.max(...nums) : 0) + 1
}

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 800))

const idx = nextIndex()
const filename = label ? `screenshot-${idx}-${label}.png` : `screenshot-${idx}.png`
await page.screenshot({ path: path.join(outDir, filename), fullPage })

await browser.close()
console.log(`Saved ${filename}`)
