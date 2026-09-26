/**
 * Chatra recommendation engine
 * candidate → relevance → preference → quality → safety → spam → diversity → freshness → rank
 * Paid plans raise eligibility only; they never force distribution.
 */

function clamp(n, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n))
}

export function scorePost(post, user, weights = {}, eligibility = 1) {
  if (!post.policyOk) return { score: 0, drop: 'policy' }
  if (post.spamScore > 60) return { score: 0, drop: 'spam' }

  const topic = post.topic
  const interested = user?.interests?.includes(topic) ? 1 : 0.35
  const pref = clamp(0.5 + ((weights[topic] || 0) / 20), 0.05, 1.4)
  const quality = clamp(
    (post.likes * 1.2 - post.dislikes * 2 + post.saves * 1.5 + post.completion * 0.4) / 5000,
    0.05,
    1
  )
  const freshness = clamp(1 - (Date.now() - post.created) / (1000 * 60 * 60 * 24 * 14), 0.15, 1)
  const watch = clamp(post.watch / 100, 0, 1)
  const followBoost = user?.follows?.includes(post.authorId) ? 1.25 : 1
  const relevance = interested * 0.7 + 0.3

  let score =
    relevance * 0.22 +
    pref * 0.2 +
    quality * 0.18 +
    watch * 0.12 +
    freshness * 0.1 +
    0.08
  score *= followBoost
  score *= clamp(eligibility, 1, 1.35)

  return { score, drop: null, signals: { relevance, pref, quality, freshness, watch, eligibility } }
}

export function rankFeed({ posts, user, weights = {}, eligibilityByAuthor = {}, limit = 40 }) {
  const scored = posts.map(p => {
    const el = eligibilityByAuthor[p.authorId] || 1
    const s = scorePost(p, user, weights, el)
    return { ...p, _rank: s }
  }).filter(p => !p._rank.drop)

  scored.sort((a, b) => b._rank.score - a._rank.score)

  const seenTopics = new Set()
  const diverse = []
  for (const p of scored) {
    const repeat = seenTopics.has(p.topic) && diverse.length < limit
    if (repeat && Math.random() < 0.55) continue
    seenTopics.add(p.topic)
    diverse.push(p)
    if (diverse.length >= limit) break
  }

  return diverse.map((p, i) => ({
    ...p,
    why: whyCopy(p, user, i),
  }))
}

function whyCopy(p, user, i) {
  if (user?.follows?.includes(p.authorId)) return 'You follow this creator'
  if (user?.interests?.includes(p.topic)) return `You selected ${p.topic}`
  if (i < 3) return 'Popular among users with similar interests'
  return 'Fresh content related to your activity'
}

export function applySignal(weights, topic, dir) {
  const next = { ...weights }
  next[topic] = (next[topic] || 0) + dir
  if (next[topic] < -12) next[topic] = -12
  if (next[topic] > 20) next[topic] = 20
  return next
}

export function channelDiscoveryScore(ch, query = '') {
  const q = query.toLowerCase()
  const rel = !q ? 0.5 : (
    (ch.name.toLowerCase().includes(q) ? 0.5 : 0) +
    (ch.handle.includes(q) ? 0.4 : 0) +
    (ch.keywords.some(k => k.includes(q)) ? 0.3 : 0)
  )
  const quality = ch.quality / 100
  const complete = ch.completeness / 100
  const policy = ch.policy / 100
  const spam = 1 - ch.spam / 100
  return rel * 0.3 + quality * 0.25 + complete * 0.15 + policy * 0.2 + spam * 0.1 + ch.activity / 1000
}
