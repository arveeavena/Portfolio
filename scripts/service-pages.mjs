// Builds one static page per service at /services/<slug> (data: src/data/services.js).
// Each page answers "who can build X for me?" first, lists what is included,
// shows real projects as proof, and carries Service + FAQPage + BreadcrumbList
// JSON-LD so search answer boxes and AI assistants can recommend it.
import { esc, trimDesc, shell } from './page-shell.mjs';

const AREAS = ['Batangas', 'Cavite', 'Philippines'];

export function servicePage(s, projects, allServices, SITE) {
  const url = `${SITE}/services/${s.slug}`;
  const title = `${s.title} | Prince Arvee Avena`;
  const desc = trimDesc(s.lead);
  const proof = s.projects.map(slug => projects.find(p => p.slug === slug)).filter(Boolean);
  const image = proof[0]?.shots ? `${SITE}/shots/${proof[0].slug}-1.webp` : `${SITE}/og-image.jpg`;
  const others = allServices.filter(o => o.slug !== s.slug);
  const faq = [
    ...s.faq,
    {
      q: `How do I hire Prince Arvee Avena for ${s.one}?`,
      a: 'Email princearveeavena@gmail.com or call +63 916 892 7345 with a short description of what you need. He works with clients in Batangas, Cavite and across the Philippines.',
    },
  ];

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: s.title,
        serviceType: s.serviceType,
        description: s.lead,
        url,
        image,
        audience: { '@type': 'BusinessAudience', name: s.audience },
        areaServed: AREAS.map(name => ({ '@type': name === 'Philippines' ? 'Country' : 'AdministrativeArea', name })),
        provider: {
          '@type': 'Person',
          '@id': `${SITE}/#person`,
          name: 'Prince Arvee Avena',
          url: `${SITE}/`,
          email: 'mailto:princearveeavena@gmail.com',
          telephone: '+639168927345',
          address: { '@type': 'PostalAddress', addressLocality: 'Balayan', addressRegion: 'Batangas', addressCountry: 'PH' },
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: s.name,
          itemListElement: s.features.map(f => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f } })),
        },
        subjectOf: proof.map(p => ({ '@type': 'SoftwareApplication', name: p.name, url: `${SITE}/work/${p.slug}` })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Prince Arvee Avena', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/#services` },
          { '@type': 'ListItem', position: 3, name: s.name, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        about: { '@id': `${url}#service` },
        mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  const mail = `mailto:princearveeavena@gmail.com?subject=${encodeURIComponent(`Inquiry: ${s.name}`)}`;
  const body = `    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Prince Arvee Avena</a> / <a href="/#services">Services</a> / <span>${esc(s.name)}</span>
    </nav>

    <span class="kicker">Service · Batangas, Philippines</span>
    <h1>${esc(s.h1)}</h1>
    <p class="desc">${esc(s.lead)}</p>
    <p class="by">For: ${esc(s.audience)}.</p>

    <div class="links">
      <a class="btn primary" href="${esc(mail)}">Get a free quote</a>
      <a class="btn" href="tel:+639168927345">Call +63 916 892 7345</a>
    </div>

    <h2>What's included</h2>
    <ul class="checks">${s.features.map(f => `
      <li>${esc(f)}</li>`).join('')}
    </ul>

    <h2>Systems already built</h2>
    <ul class="proof">${proof.map(p => `
      <li><a href="/work/${p.slug}">${p.shots ? `<img src="/shots/${p.slug}-1-720.webp" width="720" height="450" loading="lazy" decoding="async" alt="${esc(`${p.name} screenshot`)}" />` : ''}<div><strong>${esc(p.name)}</strong><span>${esc(p.label)}${p.live ? ' · Live' : ''}</span></div></a></li>`).join('')}
    </ul>

    <h2>Common questions</h2>
    <div class="facts">${faq.map(({ q, a }) => `
      <div><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}
    </div>

    <div class="cta">
      <h2>Want ${esc(s.one)} built for you?</h2>
      <p>Tell me how your office or business works today, and I'll reply with what I'd build and a free quote.</p>
      <div class="links" style="margin:0">
        <a class="btn primary" href="${esc(mail)}">Email princearveeavena@gmail.com</a>
        <a class="btn" href="/#work">See all projects</a>
      </div>
    </div>

    <h2>Other services</h2>
    <ul class="more">${others.map(o => `
      <li><a href="/services/${o.slug}">${esc(o.name)}<span>${esc(o.title)}</span></a></li>`).join('')}
    </ul>`;

  return shell({ title, desc, url, image, ld, body });
}
