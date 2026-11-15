// IndexNow: tells Bing (which powers ChatGPT search and Copilot) and Yandex
// that every URL in dist/sitemap.xml changed, so they recrawl right away
// instead of waiting to rediscover the site.
//
// Runs at the end of `npm run build` on Vercel production deploys only.
// Run by hand after a deploy with: node scripts/indexnow.mjs --now
// It never fails the build: errors are logged and the script exits 0.
//
// The key is public by design; it is served at /<KEY>.txt (public/<KEY>.txt).
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const KEY = '5f7665c3667a2e6f6d6fcaca0951becf'
const HOST = 'arveeavena.site'

const isProd = process.env.VERCEL_ENV === 'production'
if (!isProd && !process.argv.includes('--now')) {
  console.log('indexnow: skipped (not a production deploy; pass --now to force)')
  process.exit(0)
}

const sitemap = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/sitemap.xml')
if (!existsSync(sitemap)) {
  console.log('indexnow: skipped (dist/sitemap.xml not found, run the build first)')
  process.exit(0)
}

const urlList = [...readFileSync(sitemap, 'utf8').matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)]
  .map(m => m[1])
  .filter(u => !u.includes('/shots/'))
urlList.push(`https://${HOST}/llms.txt`, `https://${HOST}/llms-full.txt`)

try {
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
    signal: AbortSignal.timeout(15000),
  })
  // 200 = accepted, 202 = accepted, key validation pending.
  console.log(`indexnow: ${res.status} ${res.statusText} for ${urlList.length} URLs`)
} catch (err) {
  console.log(`indexnow: request failed (${err.message}); build continues`)
}
