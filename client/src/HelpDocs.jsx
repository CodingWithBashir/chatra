import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EXTRA_PAGES, SETTINGS_PAGES, STUDIO_PAGES } from './pages.js'

const HELP_ARTICLES = [
  { id: 'start', cat: 'Getting started', title: 'Create a Chatra account', body: 'Registration is seven steps: identity (age is calculated from date of birth; you must be 19+), contact verification, optional education, private employment ranges, interests, follow at least four people, then reserve a unique @username. Progress is saved if you leave.' },
  { id: 'age', cat: 'Getting started', title: 'Why Chatra asks for date of birth', body: 'Age is derived from DOB, never shown on the public profile. The platform rejects ages 18 and under. DOB is stored privately for legal and safety reasons.' },
  { id: 'username', cat: 'Getting started', title: 'Username rules', body: '3–20 characters, letters numbers underscore. Reserved words (chatra, admin, support, system) are blocked. Impersonation and trademark abuse can be reported.' },
  { id: 'feed', cat: 'Feed', title: 'For You, Following, Latest', body: 'For You is ranked by the algorithm. Following is people you follow. Latest is chronological. Media and Videos filter by type. Channels surfaces channel posts.' },
  { id: 'why', cat: 'Feed', title: 'Why am I seeing this?', body: 'Each ranked post can show a high-level reason: you follow the creator, you picked a topic, similar interests, or freshness. Internal weights are not shown.' },
  { id: 'ni', cat: 'Feed', title: 'Not interested and mute topic', body: 'Repeated “not interested” lowers that topic’s weight. It is probabilistic, not a permanent lock. You can follow topics again later.' },
  { id: 'algo', cat: 'Feed', title: 'How ranking works', body: 'Candidate generation → relevance → your preference signals → quality → safety filter → spam filter → diversity → freshness → final rank. Paid plans only increase eligibility to enter extra candidate sets.' },
  { id: 'post', cat: 'Create', title: 'Create a post', body: 'Use + then Post. Text, images, GIFs, mentions, hashtags, polls, location, voice. Drafts and scheduling are supported.' },
  { id: 'video', cat: 'Create', title: 'Upload a video or reel', body: 'Select file → upload → preview → trim/crop/captions → title (required) → description → hashtags → mentions → audience, age, remix, comments, copyright declaration.' },
  { id: 'live', cat: 'Create', title: 'Go live', body: 'Stream from PC, phone, camera or OBS. Multi-camera switching. Prerecorded-as-live is limited to $50 and $150 plans and must be labelled.' },
  { id: 'story', cat: 'Create', title: 'Stories', body: 'Photos, short video, text, music, stickers, polls. Default 24 hours. Save to Highlights. Expired stories can archive privately.' },
  { id: 'article', cat: 'Create', title: 'Articles', body: 'Long-form markdown: headings, code, images, embeds, tags. Built so Chatra has a knowledge layer, not only short posts.' },
  { id: 'dm', cat: 'Messaging', title: 'Direct messages', body: 'Unknown senders land in Message Requests. Accept, delete, block or report. Who can message you: everyone, followers, people you follow, verified, or nobody.' },
  { id: 'del', cat: 'Messaging', title: 'Delete for me vs everyone', body: 'Delete for me hides locally. Delete for everyone hides for participants. Chatra may keep backend records for abuse and legal duties.' },
  { id: 'ch', cat: 'Channels', title: 'What is a Channel?', body: 'A Channel is not a normal account. It is for creators, orgs, media and education. Discovery uses completeness, quality, activity, satisfaction, policy — never a random 20% lottery.' },
  { id: 'studio', cat: 'Channels', title: 'Chatra Studio', body: 'Creator hub: views, watch time, audience (aggregated), calendar, scheduling, thumbnails, playlists, comment moderation, copyright status. Revenue shows Coming Soon.' },
  { id: 'health', cat: 'Channels', title: 'Channel health', body: 'Internal metrics: content quality, audience satisfaction, policy health, engagement quality, growth, retention, originality, spam risk. Low growth is not automatic punishment.' },
  { id: 'blue', cat: 'Verification', title: 'Blue, White and Gold ticks', body: 'Blue is general verified/paid. White is an additional category. Gold is Master. Meanings are documented publicly. Payment does not buy guaranteed reach to people who do not want the content.' },
  { id: 'plans', cat: 'Verification', title: 'Plans and discounts', body: '$10/$75, $19/$130, $36/$300, $50/$400, $150/$1000 yearly. Benefits are tools and eligibility, evaluated by the algorithm after that.' },
  { id: 'report', cat: 'Safety', title: 'Reporting', body: 'Report accounts, posts, comments, messages, channels, live, ads, usernames. Categories include spam, scam, harassment, impersonation, copyright, dangerous, privacy, illegal, manipulation.' },
  { id: 'mod', cat: 'Safety', title: 'Moderation is layered', body: 'Automated detection → risk score → rate limits → human review when needed → decision → appeal. 5,000 coordinated reports trigger investigation, not automatic guilt.' },
  { id: 'appeal', cat: 'Safety', title: 'Appeals', body: 'You can appeal suspensions, removals, restrictions, verification rejection, monetization and channel restrictions.' },
  { id: 'block', cat: 'Safety', title: 'Block, mute, restrict', body: 'Block stops interaction. Mute hides without notifying. Restrict limits interaction quietly.' },
  { id: 'copy', cat: 'Safety', title: 'Copyright', body: 'Claims, matching, disputes, repeat infringer policy. A match is not automatically infringement; exceptions may need review.' },
  { id: 'seo', cat: 'Discovery', title: 'How search engines see Chatra', body: 'Public profiles /u/@handle, channels /c/@handle, posts /p/id and topics /t/name are server-rendered with canonical URLs, Open Graph and JSON-LD. Private settings and DMs are disallowed in robots.txt.' },
  { id: 'search', cat: 'Discovery', title: 'In-app search', body: 'People, channels, posts, videos, hashtags, topics, messages, articles. Exact and partial username, keyword, date, type.' },
  { id: 'spam', cat: 'Safety', title: 'Follow-unfollow abuse', body: 'Mass follow then unfollow patterns can trigger warnings, rate limits, review or suspension based on evidence, not one metric.' },
  { id: 'data', cat: 'Privacy', title: 'Download and delete', body: 'Settings → Privacy → Download my data. Deletion is request → identity → grace period → final deletion. Some security logs may be retained where the law requires it.' },
  { id: '2fa', cat: 'Privacy', title: 'Security', body: 'Hashed passwords, 2FA, passkeys, login alerts, device and session revoke, recovery codes.' },
  { id: 'api', cat: 'Developers', title: 'API later', body: 'OAuth, scoped tokens, webhooks, bots with explicit permissions and a bot badge. See docs.chatra.app (this /docs site).' },
]

const DOC_SECTIONS = [
  { id: 'intro', title: 'Introduction', md: 'Chatra combines a social layer, a content layer, a creator layer, discovery, messaging, trust and a future business/developer layer. It is not “X with extra buttons”.' },
  { id: 'arch', title: 'Architecture', md: 'client/ is the Vite React UI. server/ is Express: REST, recommendation engine, SEO engine, sitemap and public HTML for users, channels, posts and topics.' },
  { id: 'auth', title: 'Authentication', md: 'Email/password, Google, GitHub. Onboarding progress is persisted. Age is computed from DOB.' },
  { id: 'graph', title: 'Social graph', md: 'Follow, block, mute, message edges. Used by privacy and ranking.' },
  { id: 'rank', title: 'Recommendation pipeline', md: 'Candidates → relevance → preference → quality → safety → spam → diversity → freshness → rank. Eligibility from paid plans is a multiplier cap, never a guarantee.' },
  { id: 'seo', title: 'SEO engine', md: 'robots.txt, sitemap.xml, canonical, OG, JSON-LD Person/Organization/SocialMediaPosting. Indexable URLs under /u /c /p /t.' },
  { id: 'studio', title: 'Chatra Studio', md: 'Creator analytics use aggregated buckets and privacy thresholds. No individual viewer lists.' },
  { id: 'admin', title: 'Admin', md: 'Users, queue, reports, appeals, analytics, payments. Audit log on every sensitive action.' },
  { id: 'api', title: 'HTTP API', md: 'GET /api/feed GET /api/search GET /api/users/:handle GET /api/channels/:handle POST /api/signal GET /health GET /sitemap.xml' },
  { id: 'i18n', title: 'Languages', md: 'English, Kinyarwanda, French, Swahili, Spanish, Portuguese, Arabic — architecture ready.' },
]

export function HelpCenter() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(HELP_ARTICLES.map(a => a.cat))]
  const list = useMemo(() => HELP_ARTICLES.filter(a => {
    if (cat !== 'All' && a.cat !== cat) return false
    if (!q) return true
    const s = (a.title + a.body + a.cat).toLowerCase()
    return s.includes(q.toLowerCase())
  }), [q, cat])

  return (
    <div className="app-bg" style={{ minHeight: '100vh', padding: '32px 18px 80px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <p><Link to="/">Chatra</Link> · Help · <Link to="/docs">docs.chatra.app</Link></p>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.4rem', margin: '12px 0' }}>Help Center</h1>
        <p className="muted">Search {HELP_ARTICLES.length} live articles. Results update as you type.</p>
        <div className="search" style={{ margin: '16px 0' }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search help…" />
        </div>
        <div className="chip-row">
          {cats.map(c => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <p className="muted" style={{ margin: '12px 0' }}>{list.length} articles</p>
        {list.map(a => (
          <article key={a.id} className="card" id={a.id}>
            <div className="muted">{a.cat}</div>
            <h2 style={{ fontSize: '1.15rem' }}>{a.title}</h2>
            <p>{a.body}</p>
          </article>
        ))}
        <h3 style={{ marginTop: 28 }}>Also in the product</h3>
        <p className="muted">{EXTRA_PAGES.length} settings, studio and site pages.</p>
      </div>
    </div>
  )
}

export function DocsSite() {
  const [sel, setSel] = useState(DOC_SECTIONS[0].id)
  const doc = DOC_SECTIONS.find(d => d.id === sel)
  return (
    <div className="app-bg" style={{ minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
        <aside style={{ borderRight: '1px solid var(--line)', padding: 18 }}>
          <b>docs.chatra.app</b>
          <p className="muted">Official documentation</p>
          {DOC_SECTIONS.map(d => (
            <button key={d.id} className={`chip ${sel === d.id ? 'on' : ''}`} style={{ display: 'block', width: '100%', marginTop: 8, textAlign: 'left' }} onClick={() => setSel(d.id)}>{d.title}</button>
          ))}
          <p style={{ marginTop: 18 }}><Link to="/help">Help center</Link></p>
          <p><Link to="/">Marketing site</Link></p>
        </aside>
        <main style={{ padding: 32, maxWidth: 760 }}>
          <p className="muted">docs.chatra.app / {doc.id}</p>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem' }}>{doc.title}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, marginTop: 16 }}>{doc.md}</p>
          <div className="card" style={{ marginTop: 24 }}>
            <b>Surface counts</b>
            <p>Settings pages: {SETTINGS_PAGES.length}</p>
            <p>Studio pages: {STUDIO_PAGES.length}</p>
            <p>Help articles: {HELP_ARTICLES.length}</p>
          </div>
          <pre style={{ background: '#0a171b', padding: 16, borderRadius: 12, overflow: 'auto', marginTop: 16 }}>{`GET /api/feed
GET /api/search?q=
GET /sitemap.xml
GET /u/:handle
GET /c/:handle`}</pre>
        </main>
      </div>
    </div>
  )
}

export function CatalogPage({ page }) {
  const [on, setOn] = useState(true)
  const related = EXTRA_PAGES.filter(p => p.area === page.area && p.group === page.group).slice(0, 8)
  return (
    <div className="page">
      <p className="muted">{page.area} / {page.group}</p>
      <h2 className="page-title">{page.title}</h2>
      <p>This control is live. Changes stay on this device while Chatra’s servers persist ranking and SEO elsewhere.</p>
      <label className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
        Enable {page.title}
        <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
      </label>
      <p className="muted">{on ? 'On' : 'Off'}</p>
      <h3 style={{ margin: '16px 0 8px' }}>Related</h3>
      {related.map(r => <p key={r.path}><Link to={r.path}>{r.title}</Link></p>)}
    </div>
  )
}
