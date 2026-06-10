import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, 'temporary screenshots')

const pages = [
  { route: '/dashboard', label: 'dash-hero-top' },
  { route: '/help', label: 'help-hero-top' },
  { route: '/game', label: 'game-hero-top' },
  { route: '/analytics', label: 'analytics-hero-top' },
]

const browser = await puppeteer.launch()
let idx = 12
for (const { route, label } of pages) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 700, deviceScaleFactor: 1 })
  await page.goto(`http://localhost:5177${route}`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: path.join(outDir, `screenshot-${idx}-${label}.png`), clip: { x: 0, y: 0, width: 1440, height: 500 } })
  await page.close()
  idx++
}
await browser.close()
console.log('done')
