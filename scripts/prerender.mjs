// Runs after `vite build` and `vite build --ssr`. Renders <App/> to HTML and
// writes it into dist/index.html, so search engines get the full page
// (name, projects, experience) without executing JavaScript. Also adds a
// JSON-LD ItemList of the projects and an image sitemap of the screenshots.
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { projectPage } from './project-pages.mjs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://arveeavena.site'
const ssrDir = resolve(root, 'dist-ssr')

const { render, PROJECTS } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)

const indexPath = resolve(root, 'dist/index.html')
let html = readFileSync(indexPath, 'utf8')

const appHtml = render()
if (!html.includes('<div id="root"></div>')) throw new Error('prerender: empty #root not found in dist/index.html')
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Projects by Prince Arvee Avena',
  itemListElement: PROJECTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: p.name,
      description: `${p.label}. ${p.desc}`,
      applicationCategory: p.category === 'Desktop' ? 'UtilitiesApplication' : 'BusinessApplication',
      operatingSystem: p.category === 'Desktop' ? 'Windows' : 'Web',
      ...(p.live ? { url: p.live } : {}),
      ...(p.repo ? { codeRepository: p.repo } : {}),
      ...(p.shots > 0 ? { image: `${SITE}/shots/${p.slug}-1.webp` } : {}),
      author: { '@id': `${SITE}/#person` },
    },
  })),
}
html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(itemList)}</script>\n</head>`)
writeFileSync(indexPath, html)

// One static page per project at /work/<slug> (rewritten to /work/<slug>.html).
mkdirSync(resolve(root, 'dist/work'), { recursive: true })
for (const p of PROJECTS) writeFileSync(resolve(root, `dist/work/${p.slug}.html`), projectPage(p, PROJECTS, SITE))

// Sitemap with today's lastmod and the screenshots as image entries.
const today = new Date().toISOString().slice(0, 10)
const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const images = PROJECTS.flatMap(p =>
  Array.from({ length: p.shots }, (_, i) => `    <image:image>
      <image:loc>${SITE}/shots/${p.slug}-${i + 1}.webp</image:loc>
      <image:title>${xml(`${p.name}: ${p.label} by Prince Arvee Avena`)}</image:title>
    </image:image>`)
).join('\n')
writeFileSync(resolve(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
${images}
  </url>
${PROJECTS.map(p => `  <url>
    <loc>${SITE}/work/${p.slug}</loc>
    <lastmod>${today}</lastmod>${Array.from({ length: p.shots }, (_, i) => `
    <image:image><image:loc>${SITE}/shots/${p.slug}-${i + 1}.webp</image:loc></image:image>`).join('')}
  </url>`).join('\n')}
</urlset>
`)

rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${appHtml.length} chars of HTML, ${PROJECTS.length} projects in JSON-LD, ${PROJECTS.length} project pages`)
