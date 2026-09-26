export const INTERESTS = [
  'Technology','Programming','AI','Games','Music','Movies','Education','Business',
  'Entrepreneurship','Sports','Fashion','Art','Photography','Science','Travel',
  'Comedy','News','Lifestyle','Cars','Finance','Books','Relationships'
]

export const SUGGESTED = [
  { id: 'u1', name: 'Nia Kamanzi', handle: 'niakodes', bio: 'Building in public · JS', topic: 'Programming' },
  { id: 'u2', name: 'Chatra Official', handle: 'chatra', bio: 'Product updates', topic: 'News', verified: 'gold' },
  { id: 'u3', name: 'Dev Africa', handle: 'devafr', bio: 'African developers', topic: 'Technology' },
  { id: 'u4', name: 'Lens & Light', handle: 'lenslight', bio: 'Photography daily', topic: 'Photography' },
  { id: 'u5', name: 'Algo Lab', handle: 'algolab', bio: 'AI research notes', topic: 'AI' },
  { id: 'u6', name: 'Pitch Desk', handle: 'pitchdesk', bio: 'Startups & markets', topic: 'Business' },
]

export const SEED_POSTS = [
  {
    id: 'p1', author: SUGGESTED[1], text: 'Welcome to Chatra. Connect, create, discover — without a cloned feed.',
    likes: 2401, dislikes: 12, comments: 180, type: 'post', why: 'Official announcement',
    topic: 'News', media: false,
  },
  {
    id: 'p2', author: SUGGESTED[0], text: 'Shipped a Node webhook that retries with jitter. Thread on reliability ↓',
    likes: 412, dislikes: 3, comments: 44, type: 'post', why: 'You selected Programming',
    topic: 'Programming',
  },
  {
    id: 'p3', author: SUGGESTED[4], text: 'New reel: training a tiny classifier on Kinyarwanda news headlines.',
    likes: 890, dislikes: 9, comments: 71, type: 'video', why: 'Popular among AI readers',
    topic: 'AI',
  },
  {
    id: 'p4', author: SUGGESTED[3], text: 'Golden hour over Lake Kivu. Shot on a 35mm.',
    likes: 1502, dislikes: 4, comments: 90, type: 'media', why: 'Trending in Photography',
    topic: 'Photography',
  },
]

export const CHANNELS = [
  { id: 'c1', name: 'JS Nightly', handle: 'jsnightly', cat: 'Education', health: { quality: 82, satisfaction: 78, policy: 96, spam: 8 } },
  { id: 'c2', name: 'Kigali Live', handle: 'kigalilive', cat: 'News', health: { quality: 74, satisfaction: 80, policy: 91, spam: 12 } },
]

export const COMMUNITIES = [
  { id: 'cm1', name: 'JavaScript Developers', members: 18420 },
  { id: 'cm2', name: 'African Developers', members: 9200 },
  { id: 'cm3', name: 'Photography', members: 5400 },
]

export const PLANS = [
  { id: 'blue', name: 'Blue', monthly: 10, annual: 75, discount: '37.5%', tick: 'blue', perks: ['Blue tick', 'Premium profile', 'Creator tools'] },
  { id: 'plus', name: 'Plus', monthly: 19, annual: 130, discount: '43.0%', tick: 'blue', perks: ['Enhanced profile', 'Advanced analytics'] },
  { id: 'white', name: 'White', monthly: 36, annual: 300, discount: '30.6%', tick: 'white', perks: ['Blue or White tick', 'Stronger distribution eligibility'] },
  { id: 'live', name: 'Live Pro', monthly: 50, annual: 400, discount: '33.3%', tick: 'white', perks: ['Prerecorded live', 'Advanced streaming'] },
  { id: 'master', name: 'Master', monthly: 150, annual: 1000, discount: '44.4%', tick: 'gold', perks: ['Gold tick', 'Highest creator tooling'] },
]
