// Runs after `vite build` and `vite build --ssr`. Renders <App/> to HTML and
// writes it into dist/index.html, so search engines get the full page
// (name, projects, experience) without executing JavaScript. Also adds a
// JSON-LD ItemList of the projects and an image sitemap of the screenshots.
// For answer and AI engines (AEO/GEO) it also emits FAQPage JSON-LD and /llms.txt.
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { projectPage } from './project-pages.mjs'
import { servicePage } from './service-pages.mjs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://arveeavena.site'
const ssrDir = resolve(root, 'dist-ssr')

const { render, PROJECTS, FAQ, SERVICES, STACK } = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)

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
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE}/#faq`,
  about: { '@id': `${SITE}/#person` },
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}
// Same @id as the Person in index.html, so search engines merge the two:
// this ties the person to each service page they offer.
const offers = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  makesOffer: SERVICES.map(s => ({
    '@type': 'Offer',
    itemOffered: { '@id': `${SITE}/services/${s.slug}#service`, '@type': 'Service', name: s.title, url: `${SITE}/services/${s.slug}` },
    areaServed: { '@type': 'Country', name: 'Philippines' },
  })),
}
const today = new Date().toISOString().slice(0, 10)
html = html.replace('__BUILD_DATE__', today)
html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(itemList)}</script>
  <script type="application/ld+json">${JSON.stringify(faqPage)}</script>
  <script type="application/ld+json">${JSON.stringify(offers)}</script>
</head>`)
writeFileSync(indexPath, html)

// /llms.txt (llmstxt.org): a plain Markdown brief that AI assistants and
// answer engines can read in one fetch, linking every project page.
// /llms-full.txt is the long version: every service, FAQ, project and skill.
const intro = `# Prince Arvee Avena

> Prince Arvee Avena (full name Prince Arvee Flores Avena, also known as Arvee Avena) is a full-stack developer based in Balayan, Batangas, Philippines, working at ServiceCo. He builds POS and inventory systems, Philippine payroll and HR systems, school systems and LGU records systems, plus web and mobile apps, with TypeScript, React, Next.js, React Native, Laravel, PostgreSQL, Supabase and AWS. He also handles technical SEO, AEO and GEO. BS Computer Science, Magna Cum Laude.

Last updated: ${today}

- Website: ${SITE}/
- Email: princearveeavena@gmail.com
- Phone: +63 916 892 7345
- Location: Balayan, Batangas, Philippines (clients in Batangas, Cavite and across the Philippines)
- GitHub: https://github.com/arveeavena
- LinkedIn: https://www.linkedin.com/in/princearveeavena/
- Resume (PDF): ${SITE}/RESUME.pdf
`
writeFileSync(resolve(root, 'dist/llms-full.txt'), `${intro}
## Services
${SERVICES.map(s => `
### ${s.title}

URL: ${SITE}/services/${s.slug}

${s.lead}

For: ${s.audience}.

What's included:
${s.features.map(f => `- ${f}`).join('\n')}

Proof: ${s.projects.map(slug => PROJECTS.find(p => p.slug === slug)).filter(Boolean).map(p => `${p.name} (${SITE}/work/${p.slug})`).join(', ')}

${s.faq.map(({ q, a }) => `**${q}**\n${a}`).join('\n\n')}`).join('\n')}

## Frequently asked questions

${FAQ.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}

## Projects
${PROJECTS.map(p => `
### ${p.name}: ${p.label}

URL: ${SITE}/work/${p.slug}
Type: ${p.category}${p.live ? `\nLive: ${p.live}` : ''}${p.repo ? `\nSource: ${p.repo}` : ''}
Built with: ${p.tags.join(', ')}

${p.desc}`).join('\n')}

## Skills
${STACK.map(g => `\n### ${g.cat}\n\n${g.tags.join(', ')}`).join('\n')}
`)

writeFileSync(resolve(root, 'dist/llms.txt'), `${intro}- Full details for AI assistants: ${SITE}/llms-full.txt

## Skills

${STACK.map(g => `- ${g.cat}: ${g.tags.join(', ')}`).join('\n')}

## Services

${SERVICES.map(s => `- [${s.title}](${SITE}/services/${s.slug}): ${s.lead}`).join('\n')}

## FAQ

${FAQ.map(({ q, a }) => `### ${q}\n\n${a}`).join('\n\n')}

## Projects

${PROJECTS.map(p => `- [${p.name}](${SITE}/work/${p.slug}): ${p.label}. ${p.desc} Built with ${p.tags.join(', ')}.${p.live ? ` Live at ${p.live}.` : ''}`).join('\n')}
`)

// One static page per project at /work/<slug> (rewritten to /work/<slug>.html).
mkdirSync(resolve(root, 'dist/work'), { recursive: true })
for (const p of PROJECTS) writeFileSync(resolve(root, `dist/work/${p.slug}.html`), projectPage(p, PROJECTS, SITE, SERVICES))

// One page per service at /services/<slug>, answering "who can build X for me?".
mkdirSync(resolve(root, 'dist/services'), { recursive: true })
for (const s of SERVICES) writeFileSync(resolve(root, `dist/services/${s.slug}.html`), servicePage(s, PROJECTS, SERVICES, SITE))

// Sitemap with today's lastmod and the screenshots as image entries.
// The profile photo comes first so Google can show it for name searches.
const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const profilePhoto = `    <image:image>
      <image:loc>${SITE}/prince-arvee-avena.jpg</image:loc>
      <image:title>Prince Arvee Avena, full-stack developer from Balayan, Batangas, Philippines</image:title>
    </image:image>`
const images = [profilePhoto, ...PROJECTS.flatMap(p =>
  Array.from({ length: p.shots }, (_, i) => `    <image:image>
      <image:loc>${SITE}/shots/${p.slug}-${i + 1}.webp</image:loc>
      <image:title>${xml(`${p.name}: ${p.label} by Prince Arvee Avena`)}</image:title>
    </image:image>`)
)].join('\n')
writeFileSync(resolve(root, 'dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE}/</loc>
    <lastmod>${today}</lastmod>
${images}
  </url>
${SERVICES.map(s => `  <url>
    <loc>${SITE}/services/${s.slug}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')}
${PROJECTS.map(p => `  <url>
    <loc>${SITE}/work/${p.slug}</loc>
    <lastmod>${today}</lastmod>${Array.from({ length: p.shots }, (_, i) => `
    <image:image><image:loc>${SITE}/shots/${p.slug}-${i + 1}.webp</image:loc></image:image>`).join('')}
  </url>`).join('\n')}
</urlset>
`)

rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${appHtml.length} chars of HTML, ${PROJECTS.length} projects in JSON-LD, ${FAQ.length} FAQs, ${PROJECTS.length} project pages, ${SERVICES.length} service pages, llms.txt`)
