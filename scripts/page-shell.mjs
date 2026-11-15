// Shared <head>, styles and footer for the static pages built at prerender
// time (/work/<slug> and /services/<slug>), so they look and behave alike.

export const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const host = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
export const trimDesc = d => d.length > 158 ? `${d.slice(0, 155).replace(/\s+\S*$/, '')}…` : d;

export function shell({ title, desc, url, image, ld, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>try{document.documentElement.setAttribute('data-theme',localStorage.getItem('portfolio-theme')||'light')}catch(e){}</script>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="author" content="Prince Arvee Avena" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Prince Arvee Avena" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:image" content="${image}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
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
    .checks { padding:0; margin:0; list-style:none; display:grid; gap:8px; }
    .checks li { padding-left:26px; position:relative; max-width:70ch; }
    .checks li::before { content:'✓'; position:absolute; left:4px; color:var(--accent); font-weight:700; }
    .proof { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:14px; padding:0; list-style:none; }
    .proof a { display:block; height:100%; border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--card); text-decoration:none; color:var(--text); }
    .proof img { display:block; width:100%; height:auto; aspect-ratio:16/10; object-fit:cover; border-bottom:1px solid var(--border); }
    .proof div { padding:12px 14px; }
    .proof strong { display:block; }
    .proof span { display:block; font-size:13px; color:var(--muted); }
    .cta { margin-top:44px; padding:24px; border:1px solid var(--border); border-radius:14px; background:var(--card); }
    .cta h2 { margin:0 0 6px; }
    .cta p { margin:0 0 16px; color:var(--muted); }
    footer { margin-top: 48px; padding-top: 20px; border-top:1px solid var(--border); font-size:13.5px; color:var(--muted); }
  </style>
</head>
<body>
  <main class="wrap">
${body}
    <footer>
      <a href="/">← Back to arveeavena.site</a> · © ${new Date().getFullYear()} Prince Arvee Avena · Full-stack developer, Balayan, Batangas, Philippines
    </footer>
  </main>
</body>
</html>
`;
}
