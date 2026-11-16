// Prints resume/resume.html to public/RESUME.pdf with headless Chrome or Edge.
// Usage: npm run resume   (set CHROME_PATH to use a different browser binary)
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'resume/resume.html')
const out = resolve(root, 'public/RESUME.pdf')

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const browser = candidates.find(p => existsSync(p))
if (!browser) throw new Error('resume: no Chrome or Edge found; set CHROME_PATH')

execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${out}`,
  pathToFileURL(src).href,
], { stdio: 'inherit' })
console.log(`resume: wrote ${out}`)
