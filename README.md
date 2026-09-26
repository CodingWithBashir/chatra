# Chatra

**Connect. Create. Discover.**

Chatra is an online social, messaging, content and creator platform. It is designed as a scalable product — social graph, media, channels, Chatra Studio, discovery, trust & safety, and a future API — not as a clone of any single existing network.

This repository is a working implementation of that product: a fast web client, an HTTP API, a recommendation engine, and an SEO engine so **people and channels can be found in Google** by name.

---

## 1. What Chatra is

Chatra combines:

| Layer | What people do |
|---|---|
| Social | Profiles, follow, posts, likes/dislikes, comments, reposts |
| Content | Reels, stories, live, articles, voice, polls, events |
| Creator | Channels and **Chatra Studio** |
| Discovery | Search, Explore, ranked For You, “Why am I seeing this?” |
| Communication | DMs, groups, communities, live chat |
| Trust | Verification ticks, reports, moderation, appeals, anti-spam |
| Business | Subscription plans (eligibility, not forced ads). Channel payouts: Coming Soon |
| Developer | Documented API surface under **docs.chatra.app** (`/docs`) |

The landing page is authentication-first. The main feed is **not** shown to signed-out users.

---

## 2. Repository layout

```
chatra/
  client/                 Frontend (Vite + React)
    src/App.jsx           App shell, feed, onboarding, compose
    src/Admin.jsx         Live admin console
    src/HelpDocs.jsx      Help center + docs.chatra.app
    src/pages.js          400+ Settings / Studio / site routes
    src/store.js          Session, age-from-DOB, username rules
  server/                 Backend (Express)
    index.js              REST, public SEO HTML, sitemap, robots
    algorithm/engine.js   Ranking pipeline
    seo/engine.js         Canonical, JSON-LD, Open Graph
    data/seed.js          Users, channels, posts for crawl + rank
  README.md               This document
```

Run everything:

```bash
npm install
npm run dev
```

| Process | URL |
|---|---|
| Web app | http://localhost:5173 |
| API + SEO HTML | http://localhost:8787 |
| Help | http://localhost:5173/help |
| Docs (docs.chatra.app) | http://localhost:5173/docs |
| Admin | http://localhost:5173/admin |
| Sitemap | http://localhost:8787/sitemap.xml |
| Example profile | http://localhost:8787/u/chatra |
| Example channel | http://localhost:8787/c/channel012 |

Demo email verification code: `123456`.

---

## 3. Product surfaces (pages)

Chatra uses **routes as pages**, not one file per URL.

- **Core app:** landing, login, 7-step signup, home (six feed modes), explore, messages, notifications, bookmarks, communities, channels, profile, settings hub, studio hub, plans, privacy, security, delete, compose (8 create types), admin (dashboard, users, moderation, reports, appeals, analytics, payments).
- **Settings (~45% of extra pages):** account, privacy, security, notifications, feed, messaging, accessibility, language, data, verification — each control is its own URL so it is bookmarkable, searchable, and stable.
- **Studio (~45%):** dashboard ranges, content libraries, analytics metrics, audience, monetization placeholders, copyright, community tools, live, customization, publishing defaults, creator tools.
- **Rest (~10%):** legal policies, developers, status, safety center, explore slices, bookmark folders, about, contact.

Together with server-rendered `/u/:handle`, `/c/:handle`, `/p/:id` and `/t/:topic`, the platform exposes **hundreds of indexable or in-app pages** without duplicating the visual design.

---

## 4. Registration and identity

Signup is progressive and resumable:

1. First name, last name, nickname, date of birth, optional photo. **Age is calculated from DOB.** Age ≤ 18 is rejected; ≥ 19 may continue. DOB is never public.
2. Email (code), country, phone OTP, optional secondary email. Phone is not shown to others by default.
3. Education (skippable).
4. Employment and **income ranges** (private, never auto-posted to the profile).
5. Interests — initialize recommendations only; they do **not** lock the feed forever.
6. Follow **at least four** accounts.
7. Reserve `@username` with live availability and suggestions.

---

## 5. Recommendation engine

Implemented in `server/algorithm/engine.js`:

```
candidates → relevance → user preference → quality
        → safety → spam → diversity → freshness → rank
```

Signals include watch time, completion, likes, dislikes, comments, shares, saves, follows, search, not-interested, topics, hashtags, creator relationship, freshness, policy.

**Distribution rule:** a paid plan only raises *eligibility* (content may enter additional candidate sets). The ranker still applies preference, quality and safety. Payment never forces content onto people who do not want it.

“Not interested” / mute topic lowers a topic weight. Repeated engagement raises it. Weights are bounded so users are not trapped in a single category.

---

## 6. SEO engine

Implemented in `server/seo/engine.js` and `server/index.js`.

Goal: if someone Googles a **Chatra username or channel name**, crawlers can fetch a real HTML document with:

- Unique `<title>` and meta description  
- `rel=canonical`  
- Open Graph  
- JSON-LD (`Person`, `Organization`, `SocialMediaPosting`)  
- Internal links back into the product  

`robots.txt` allows `/u/`, `/c/`, `/p/`, `/t/` and disallows `/admin`, `/messages`, `/settings`, `/api/`.  
`sitemap.xml` lists users, channels, posts and topics.

This is how Chatra treats SEO as a **system**, not a homepage meta tag.

Private data (DOB, phone, income, DMs) is not on public documents.

---

## 7. Chatra Studio and channels

A Channel is a first-class creator object (name, username, bio, keywords, category, images, links). The owner manages it in Studio:

Dashboard (views, followers, watch time, engagement, **Revenue: Coming Soon**), content calendar, scheduling, thumbnails, playlists, comment moderation, aggregated audience (age bands with privacy thresholds), traffic sources, retention, copyright and guideline status.

Channel health is multi-metric (quality, satisfaction, policy, spam risk, originality). Low growth is not an automatic penalty. High growth does not buy extra distribution if policy fails.

---

## 8. Trust, admin, payments

Admin (`/admin`) is interactive: user suspend/restore/ban, moderation review (remove / warn / dismiss), reports & appeals, analytics, subscription table. Sensitive actions append an audit record.

Verification plans ($10, $19, $36, $50, $150 monthly with yearly discounts) map to blue / white / gold ticks. Cards are not stored raw.

Appeals exist for suspensions, removals, restrictions, verification and monetization.

---

## 9. Help and documentation

- **Help Center** (`/help`) — long, **dynamic** article list with live search and category chips (getting started, feed, create, messaging, channels, verification, safety, privacy, developers).
- **docs.chatra.app** (`/docs`) — product and API documentation: architecture, auth, graph, ranking, SEO, Studio, admin, HTTP API, languages.

Use these as the public documentation host. In production, point `docs.chatra.app` at the same `/docs` app.

---

## 10. Performance notes

- Client: Vite, code-split CSS, host `0.0.0.0` for preview.  
- Server: gzip (`compression`), small JSON, `Cache-Control` on public SEO documents, `no-store` on private APIs.  
- Low-bandwidth: lazy images in the design system, feed pagination via `limit`, algorithm diversity so the client does not download a single-topic firehose.

Lighthouse “100” depends on the deployed CDN, images and TLS. The architecture is built so those scores are *attainable* (HTML first paint for SEO URLs, tiny API payloads, no unused giant CSS frameworks).

---

## 11. Development phases (from the product spec)

1. Foundation — auth, profiles, follow, feed, posts, reactions, comments, notifications  
2. Messaging  
3. Discovery  
4. Creator / Studio / video  
5. Live, stories, voice, articles, events  
6. Trust & safety  
7. Monetization  
8. Public API, OAuth, webhooks, bots  

This codebase ships a working slice of phases 1–4 plus UI and engines for 5–8.

---

## 12. License and contact

Product name: **Chatra**.  
Help: `/help`  
Docs: `/docs` (docs.chatra.app)  
Terms, privacy and community guidelines: `/legal/*`

Chatra should stay a distinct product: recommendation controls, creator studio, channel discovery that is explainable, and verification that does not sell forced reach.
