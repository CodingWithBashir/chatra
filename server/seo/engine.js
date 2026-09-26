const SITE = process.env.PUBLIC_URL || 'https://chatra.app'

export function robotsTxt() {
  return `User-agent: *
Allow: /
Allow: /u/
Allow: /c/
Allow: /p/
Allow: /t/
Disallow: /admin
Disallow: /messages
Disallow: /settings
Disallow: /api/
Sitemap: ${SITE}/sitemap.xml
`
}

export function sitemapXml({ users, channels, posts, topics }) {
  const urls = []
  const add = (loc, freq, pri) => {
    urls.push(`<url><loc>${SITE}${loc}</loc><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`)
  }
  add('/', 'hourly', '1.0')
  add('/explore', 'hourly', '0.9')
  for (const u of users.filter(u => u.indexable)) add(`/u/${u.handle}`, 'daily', '0.8')
  for (const c of channels.filter(c => c.indexable)) add(`/c/${c.handle}`, 'daily', '0.8')
  for (const p of posts.slice(0, 400)) add(`/p/${p.id}`, 'weekly', '0.6')
  for (const t of topics) add(`/t/${encodeURIComponent(t.toLowerCase())}`, 'hourly', '0.7')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

export function jsonLdPerson(u) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: u.name,
    alternateName: `@${u.handle}`,
    url: `${SITE}/u/${u.handle}`,
    description: u.bio,
    identifier: u.handle,
  }
}

export function jsonLdChannel(c) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: c.name,
    url: `${SITE}/c/${c.handle}`,
    description: `${c.category} channel on Chatra`,
  }
}

export function publicHtml({ title, description, path, jsonld, body }) {
  const url = SITE + path
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${url}"/>
<meta name="robots" content="index,follow"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:type" content="profile"/>
<meta name="twitter:card" content="summary"/>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>
body{margin:0;font-family:Outfit,system-ui,sans-serif;background:#071014;color:#e8f4f2}
main{max-width:720px;margin:40px auto;padding:24px}
a{color:#2ee6c5}
h1{font-family:Georgia,serif}
</style>
</head>
<body>
<main>
<p><a href="/">Chatra</a></p>
${body}
<p><a href="/home">Open in Chatra</a></p>
</main>
</body>
</html>`
}

function esc(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
}

export { SITE }
