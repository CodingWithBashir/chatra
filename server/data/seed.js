const interests = ['Technology','Programming','AI','Games','Music','Movies','Education','Business','Sports','Fashion','Art','Photography','Science','Travel','Comedy','News','Lifestyle','Cars','Finance','Books']

function makeUsers(n) {
  const users = []
  for (let i = 1; i <= n; i++) {
    const handle = `user${String(i).padStart(4, '0')}`
    users.push({
      id: `u${i}`,
      handle,
      name: `Creator ${i}`,
      bio: `Chatra creator interested in ${interests[i % interests.length]}.`,
      country: ['RW','KE','NG','US','FR'][i % 5],
      lang: ['en','rw','fr','sw'][i % 4],
      followers: (i * 17) % 50000,
      following: (i * 3) % 800,
      interests: [interests[i % interests.length], interests[(i + 3) % interests.length]],
      verified: i % 40 === 0 ? 'gold' : i % 15 === 0 ? 'blue' : null,
      indexable: true,
      trust: 40 + (i % 50),
    })
  }
  users.unshift({
    id: 'official', handle: 'chatra', name: 'Chatra', bio: 'Connect. Create. Discover.',
    country: 'RW', lang: 'en', followers: 1200000, following: 12,
    interests: ['News'], verified: 'gold', indexable: true, trust: 99,
  })
  return users
}

function makeChannels(n) {
  const cats = ['Education','News','Music','Gaming','Tech','Sports']
  const ch = []
  for (let i = 1; i <= n; i++) {
    ch.push({
      id: `c${i}`,
      handle: `channel${String(i).padStart(3, '0')}`,
      name: `Channel ${i}`,
      category: cats[i % cats.length],
      keywords: [cats[i % cats.length].toLowerCase(), 'chatra'],
      completeness: 50 + (i % 50),
      quality: 40 + (i % 55),
      satisfaction: 45 + (i % 50),
      policy: 80 + (i % 20),
      spam: i % 17,
      activity: 10 + (i % 90),
      indexable: true,
    })
  }
  return ch
}

function makePosts(n, users) {
  const posts = []
  for (let i = 1; i <= n; i++) {
    const author = users[(i % (users.length - 1)) + 1]
    const topic = author.interests[0]
    posts.push({
      id: `p${i}`,
      authorId: author.id,
      handle: author.handle,
      text: `${topic} update #${i}: building in public on Chatra.`,
      topic,
      hashtags: [topic.toLowerCase(), 'chatra'],
      likes: (i * 11) % 4000,
      dislikes: (i * 2) % 40,
      comments: (i * 3) % 200,
      shares: (i * 5) % 300,
      saves: (i * 7) % 150,
      watch: (i * 13) % 100,
      completion: (i * 9) % 100,
      created: Date.now() - i * 3600_000,
      type: i % 5 === 0 ? 'video' : i % 7 === 0 ? 'article' : 'post',
      policyOk: i % 97 !== 0,
      spamScore: i % 23 === 0 ? 70 : 8,
    })
  }
  return posts
}

export function seed() {
  const users = makeUsers(250)
  const channels = makeChannels(120)
  const posts = makePosts(320, users)
  return { users, channels, posts, interests }
}
