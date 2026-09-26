import express from 'express'
import cors from 'cors'
import compression from 'compression'
import { seed } from './data/seed.js'
import { rankFeed, applySignal, channelDiscoveryScore } from './algorithm/engine.js'
import { robotsTxt, sitemapXml, jsonLdPerson, jsonLdChannel, publicHtml } from './seo/engine.js'

const app = express()
app.disable('x-powered-by')
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '256kb' }))
app.use((req, res, next) => {
  res.set('Cache-Control', req.path.startsWith('/api/') ? 'no-store' : 'public, max-age=60')
  next()
})

const db = seed()
const sessions = new Map()
const weightsByUser = new Map()

app.get('/health', (_, res) => res.json({ ok: true, users: db.users.length, channels: db.channels.length, posts: db.posts.length }))

app.get('/robots.txt', (_, res) => {
  res.type('text/plain').send(robotsTxt())
})

app.get('/sitemap.xml', (_, res) => {
  res.type('application/xml').send(sitemapXml({
    users: db.users,
    channels: db.channels,
    posts: db.posts,
    topics: db.interests,
  }))
})

app.get('/api/feed', (req, res) => {
  const user = db.users.find(u => u.handle === (req.query.user || 'chatra')) || db.users[0]
  const weights = weightsByUser.get(user.id) || {}
  const feed = rankFeed({ posts: db.posts, user, weights, limit: Number(req.query.limit) || 30 })
  res.json({ feed })
})

app.post('/api/signal', (req, res) => {
  const { userId, topic, dir } = req.body || {}
  const uid = userId || 'u1'
  const next = applySignal(weightsByUser.get(uid) || {}, topic, dir || -3)
  weightsByUser.set(uid, next)
  res.json({ weights: next })
})

app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '').toLowerCase()
  const people = db.users.filter(u => !q || u.handle.includes(q) || u.name.toLowerCase().includes(q)).slice(0, 20)
  const channels = db.channels
    .map(c => ({ ...c, _s: channelDiscoveryScore(c, q) }))
    .sort((a, b) => b._s - a._s)
    .slice(0, 20)
  const posts = db.posts.filter(p => !q || p.text.toLowerCase().includes(q) || p.hashtags.some(h => h.includes(q))).slice(0, 20)
  res.json({ people, channels, posts })
})

app.get('/api/users/:handle', (req, res) => {
  const u = db.users.find(x => x.handle === req.params.handle)
  if (!u) return res.status(404).json({ error: 'not found' })
  res.json(u)
})

app.get('/api/channels/:handle', (req, res) => {
  const c = db.channels.find(x => x.handle === req.params.handle)
  if (!c) return res.status(404).json({ error: 'not found' })
  res.json(c)
})

app.get('/api/stats', (_, res) => {
  res.json({
    users: db.users.length,
    channels: db.channels.length,
    posts: db.posts.length,
    urls: db.users.length + db.channels.length + db.posts.length + db.interests.length + 40,
  })
})

function seoUser(req, res) {
  const u = db.users.find(x => x.handle === req.params.handle)
  if (!u) return res.status(404).send('Not found')
  res.send(publicHtml({
    title: `${u.name} (@${u.handle}) · Chatra`,
    description: u.bio,
    path: `/u/${u.handle}`,
    jsonld: jsonLdPerson(u),
    body: `<h1>${u.name}</h1><p>@${u.handle}</p><p>${u.bio}</p><p>${u.followers} followers</p>`,
  }))
}

function seoChannel(req, res) {
  const c = db.channels.find(x => x.handle === req.params.handle)
  if (!c) return res.status(404).send('Not found')
  res.send(publicHtml({
    title: `${c.name} (@${c.handle}) · Chatra Channel`,
    description: `${c.category} channel on Chatra`,
    path: `/c/${c.handle}`,
    jsonld: jsonLdChannel(c),
    body: `<h1>${c.name}</h1><p>@${c.handle} · ${c.category}</p>`,
  }))
}

app.get('/seo/u/:handle', seoUser)
app.get('/seo/c/:handle', seoChannel)
app.get('/u/:handle', seoUser)
app.get('/c/:handle', seoChannel)

app.get('/p/:id', (req, res) => {
  const p = db.posts.find(x => x.id === req.params.id)
  if (!p) return res.status(404).send('Not found')
  res.send(publicHtml({
    title: p.text.slice(0, 80) + ' · Chatra',
    description: p.text,
    path: `/p/${p.id}`,
    jsonld: { '@context': 'https://schema.org', '@type': 'SocialMediaPosting', headline: p.text, author: p.handle },
    body: `<h1>${p.text}</h1><p>@${p.handle} · ${p.topic}</p>`,
  }))
})

app.get('/t/:topic', (req, res) => {
  const topic = req.params.topic
  const posts = db.posts.filter(p => p.topic.toLowerCase() === topic.toLowerCase()).slice(0, 20)
  res.send(publicHtml({
    title: `#${topic} on Chatra`,
    description: `Posts about ${topic}`,
    path: `/t/${topic}`,
    jsonld: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: topic },
    body: `<h1>#${topic}</h1>` + posts.map(p => `<p>${p.text}</p>`).join(''),
  }))
})

const port = process.env.PORT || 8787
app.listen(port, '0.0.0.0', () => {
  console.log(`Chatra API + SEO on :${port} · ${db.users.length} users · ${db.channels.length} channels · crawlable URLs ready`)
})
