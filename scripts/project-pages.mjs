// Builds one static, indexable page per project at /work/<slug>.
// Each page has its own title, description, canonical, OG image and
// JSON-LD (SoftwareApplication + BreadcrumbList), and links back home.

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// "LGU Records Management" -> "LGU records management": lowercase for mid-sentence
// use, but keep acronyms (LGU, HR, POS) and proper nouns intact.
const PROPER = new Set(['Windows']);
const noun = label => label.split(' ')
  .map(w => /^[A-Z0-9&+,-]{2,}$/.test(w) || PROPER.has(w) ? w : w.toLowerCase()).join(' ');
// "a" or "an" by sound: "an HR platform", "an alumni network", "a POS".
const aOrAn = phrase => /^[aeiou]/.test(phrase) || /^[AEFHILMNORSX][A-Z]/.test(phrase) ? 'an' : 'a';
// "School Clinic Management" reads as a thing only with a head noun in it.
const kind = label => {
  const n = noun(label);
  return /\b(platform|network|builder|website|analyzer|system|app|POS)\b/.test(n) ? n : `${n} system`;
};
const host = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

export function projectPage(p, all, SITE) {
  const url = `${SITE}/work/${p.slug}`;
  const title = `${p.name}: ${p.label} | Prince Arvee Avena`;
  const desc = `${p.name} is ${aOrAn(kind(p.label))} ${kind(p.label)} built by Prince Arvee Avena (Arvee Avena), full-stack developer in the Philippines. ${p.desc}`;
  const metaDesc = desc.length > 158 ? `${desc.slice(0, 155).replace(/\s+\S*$/, '')}…` : desc;
  const image = p.shots > 0 ? `${SITE}/shots/${p.slug}-1.webp` : `${SITE}/og-image.jpg`;
  const others = all.filter(o => o.slug !== p.slug).slice(0, 6);

  // Answer-first Q&A (AEO/GEO): short, quotable answers that search answer
  // boxes and AI assistants can lift verbatim. Shown on the page and in JSON-LD.
  const faq = [
    {
      q: `What is ${p.name}?`,
      a: `${p.name} is ${aOrAn(kind(p.label))} ${kind(p.label)} built by Prince Arvee Avena (Arvee Avena), a full-stack developer in the Philippines. ${p.desc}`,
    },
    {
      q: `What is ${p.name} built with?`,
      a: `${p.name} is built with ${p.tags.slice(0, -1).join(', ')}${p.tags.length > 1 ? ' and ' : ''}${p.tags[p.tags.length - 1]}.`,
    },
    {
      q: `Who built ${p.name}?`,
      a: `${p.name} was designed and built by Prince Arvee Avena, a full-stack developer from Balayan, Batangas, Philippines. He is available for similar projects at ${host(SITE)}.`,
    },
    {
      q: `Is ${p.name} live?`,
      a: p.live
        ? `Yes. ${p.name} is live at ${host(p.live)}.`
        : `${p.name} is not publicly hosted.${p.repo ? ' Its source code is on GitHub.' : (p.category === 'Desktop' ? ' It is a Windows desktop app with private source code.' : ' It is a private client system.')}`,
    },
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${url}#app`,
        name: p.name,
        description: `${p.label}. ${p.desc}`,
        applicationCategory: p.category === 'Desktop' ? 'UtilitiesApplication' : 'BusinessApplication',
        operatingSystem: p.category === 'Desktop' ? 'Windows' : 'Web',
        image,
        keywords: p.tags.join(', '),
        ...(p.live ? { url: p.live } : {}),
        ...(p.repo ? { codeRepository: p.repo } : {}),
        author: { '@type': 'Person', '@id': `${SITE}/#person`, name: 'Prince Arvee Avena', url: `${SITE}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Prince Arvee Avena', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/#work` },
          { '@type': 'ListItem', position: 3, name: p.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        about: { '@id': `${url}#app` },
        mainEntity: faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };

  const shots = Array.from({ length: p.shots }, (_, i) => `
      <figure class="shot">
        <img src="/shots/${p.slug}-${i + 1}.webp" srcset="/shots/${p.slug}-${i + 1}-720.webp 720w, /shots/${p.slug}-${i + 1}.webp 1440w"
          sizes="(max-width: 900px) 100vw, 860px" width="1440" height="900" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"
          alt="${esc(`${p.name} ${noun(p.label)} screenshot ${i + 1}, built by Prince Arvee Avena`)}" />
      </figure>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>try{document.documentElement.setAttribute('data-theme',localStorage.getItem('portfolio-theme')||'light')}catch(e){}</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <meta name="author" content="Prince Arvee Avena" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Prince Arvee Avena" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <meta name="twitter:image" content="${image}" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root { --bg:#fafafa; --card:#ffffff; --text:#0a0a0a; --muted:#4a4a4a; --border:#e2e2e6; --accent:#2563eb; --accent-soft:rgba(37,99,235,.09); }
    @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#0e0e10; --card:#17171a; --text:#fafafa; --muted:#b4b4be; --border:#2d2d30; --accent:#7aa5f7; --accent-soft:rgba(122,165,247,.12); } }
    :root[data-theme="dark"] { --bg:#0e0e10; --card:#17171a; --text:#fafafa; --muted:#b4b4be; --border:#2d2d30; --accent:#7aa5f7; --accent-soft:rgba(122,165,247,.12); }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family:'Archivo',system-ui,sans-serif; line-height:1.6; }
    a { color: var(--accent); }
    .wrap { max-width: 900px; margin: 0 auto; padding: 28px 16px 64px; }
    .crumbs { font-size: 13px; color: var(--muted); margin-bottom: 28px; }
    .crumbs a { color: var(--muted); text-decoration: none; }
    .crumbs a:hover { color: var(--accent); }
    .kicker { display:inline-block; font-size:12px; font-weight:600; color:var(--accent); background:var(--accent-soft); padding:3px 10px; border-radius:999px; }
    h1 { font-size: clamp(30px, 6vw, 46px); line-height: 1.1; letter-spacing: -.02em; margin: 14px 0 6px; }
    .label { font-size: 18px; color: var(--muted); margin: 0 0 18px; }
    .desc { font-size: 16px; max-width: 70ch; }
    .by { font-size: 14px; color: var(--muted); }
    .tags { display:flex; flex-wrap:wrap; gap:6px; margin: 18px 0; padding:0; list-style:none; }
    .tags li { font-size:12.5px; border:1px solid var(--border); border-radius:6px; padding:3px 9px; background:var(--card); }
    .links { display:flex; flex-wrap:wrap; gap:8px; margin: 8px 0 32px; }
    .btn { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; font-size:13.5px; font-weight:600; text-decoration:none; border:1px solid var(--border); color:var(--text); background:var(--card); }
    .btn.primary { background: var(--text); color: var(--bg); border-color: var(--text); }
    .shot { margin: 0 0 18px; border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--card); }
    .shot img { display:block; width:100%; height:auto; }
    h2 { font-size: 20px; margin: 44px 0 14px; }
    .more { display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; padding:0; list-style:none; }
    .more a { display:block; padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:var(--card); text-decoration:none; color:var(--text); }
    .more span { display:block; font-size:13px; color:var(--muted); }
    .facts { display:grid; gap:10px; margin:0; }
    .facts div { padding:14px 16px; border:1px solid var(--border); border-radius:10px; background:var(--card); }
    .facts h3 { font-size:15px; margin:0 0 4px; }
    .facts p { margin:0; font-size:14.5px; color:var(--muted); }
    footer { margin-top: 48px; padding-top: 20px; border-top:1px solid var(--border); font-size:13.5px; color:var(--muted); }
  </style>
</head>
<body>
  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Prince Arvee Avena</a> / <a href="/#work">Projects</a> / <span>${esc(p.name)}</span>
    </nav>

    <span class="kicker">${esc(p.category)}${p.live ? ' · Live' : ''}</span>
    <h1>${esc(p.name)}</h1>
    <p class="label">${esc(p.label)}</p>
    <p class="desc">${esc(p.desc)}</p>
    <p class="by">Designed and built by <a href="/">Prince Arvee Avena</a>, full-stack developer from Balayan, Batangas, Philippines.</p>

    <ul class="tags" aria-label="Tech stack">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>

    <div class="links">
      ${p.live ? `<a class="btn primary" href="${esc(p.live)}" target="_blank" rel="noopener">Visit ${esc(host(p.live))} ↗</a>` : ''}
      ${p.repo ? `<a class="btn" href="${esc(p.repo)}" target="_blank" rel="noopener">Source code on GitHub</a>` : '<span class="btn" title="Client project">Private client repo</span>'}
      <a class="btn" href="/#contact">Hire me for a project like this</a>
    </div>
${shots}
    <h2>Quick facts about ${esc(p.name)}</h2>
    <div class="facts">${faq.map(({ q, a }) => `
      <div><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}
    </div>

    <h2>More projects by Prince Arvee Avena</h2>
    <ul class="more">${others.map(o => `
      <li><a href="/work/${o.slug}">${esc(o.name)}<span>${esc(o.label)}</span></a></li>`).join('')}
    </ul>

    <footer>
      <a href="/">← Back to arveeavena.site</a> · © ${new Date().getFullYear()} Prince Arvee Avena
    </footer>
  </main>
</body>
</html>
`;
}
