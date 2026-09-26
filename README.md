# Chatra

Social, messaging, content and creator platform.

```
chatra/
  client/   React UI (Vite)
  server/   API, recommendation engine, SEO engine
```

```bash
npm install
npm run dev
```

- App: http://localhost:5173
- API + crawlable SEO: http://localhost:8787
- Sitemap: http://localhost:8787/sitemap.xml
- Public profiles: `/u/:handle`  channels: `/c/:handle`  posts: `/p/:id`

The algorithm ranks by relevance, preference, quality, safety, spam, diversity and freshness. Paid plans only raise *eligibility*.

Google-facing pages include canonical URLs, robots, JSON-LD, and Open Graph so user and channel names can appear in search.
