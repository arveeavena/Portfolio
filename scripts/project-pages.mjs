// Builds one static, indexable page per project at /work/<slug>.
// Each page has its own title, description, canonical, OG image and
// JSON-LD (SoftwareApplication + BreadcrumbList), and links back home.

import { esc, host, trimDesc, shell } from './page-shell.mjs';

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

export function projectPage(p, all, SITE, services = []) {
  const url = `${SITE}/work/${p.slug}`;
  const title = `${p.name}: ${p.label} | Prince Arvee Avena`;
  const desc = `${p.name} is ${aOrAn(kind(p.label))} ${kind(p.label)} built by Prince Arvee Avena, full-stack developer in the Philippines. ${p.desc}`;
  const metaDesc = trimDesc(desc);
  const image = p.shots > 0 ? `${SITE}/shots/${p.slug}-1.webp` : `${SITE}/og-image.jpg`;
  const others = all.filter(o => o.slug !== p.slug).slice(0, 6);
  const service = services.find(sv => sv.projects.includes(p.slug));

  // Answer-first Q&A (AEO/GEO): short, quotable answers that search answer
  // boxes and AI assistants can lift verbatim. Shown on the page and in JSON-LD.
  const faq = [
    {
      q: `What is ${p.name}?`,
      a: `${p.name} is ${aOrAn(kind(p.label))} ${kind(p.label)} built by Prince Arvee Avena, a full-stack developer in the Philippines. ${p.desc}`,
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

  const body = `    <nav class="crumbs" aria-label="Breadcrumb">
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
      <a class="btn" href="${service ? `/services/${service.slug}` : '/#contact'}">Hire me for a project like this</a>
    </div>
${shots}
    <h2>Quick facts about ${esc(p.name)}</h2>
    <div class="facts">${faq.map(({ q, a }) => `
      <div><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}
    </div>

    <h2>More projects by Prince Arvee Avena</h2>
    <ul class="more">${others.map(o => `
      <li><a href="/work/${o.slug}">${esc(o.name)}<span>${esc(o.label)}</span></a></li>`).join('')}
    </ul>`;

  return shell({ title, desc: metaDesc, url, image, ld, body });
}
