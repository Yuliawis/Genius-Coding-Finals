import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, 'temporary screenshots')

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
await page.goto('http://localhost:5177/dashboard', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1500))
await page.evaluate(() => window.scrollTo(0, 750))
await new Promise((r) => setTimeout(r, 300))
await page.screenshot({ path: path.join(outDir, 'screenshot-25-globe-colors.png') })
await browser.close()
console.log('done')
