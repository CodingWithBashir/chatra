const KEY = 'chatra.admin.v1'

const seedUsers = [
  { id: 10234, username: 'user123', name: 'John Doe', email: 'john@example.com', status: 'Active' },
  { id: 10235, username: 'skywalker', name: 'Sarah Kamau', email: 'sarah@domain.com', status: 'Active' },
  { id: 10236, username: 'devmaster', name: 'Ali Hassan', email: 'ali@domain.com', status: 'Active' },
  { id: 10237, username: 'queen254', name: 'Amina Uwimana', email: 'amina@domain.com', status: 'Active' },
  { id: 10238, username: 'coderboy', name: 'Brian Mutabazi', email: 'brian@domain.com', status: 'Suspended' },
  { id: 10239, username: 'musiclover', name: 'Grace Nyirenda', email: 'grace@domain.com', status: 'Active' },
  { id: 10240, username: 'gamer_rwanda', name: 'Eric Ndayishimiye', email: 'eric@domain.com', status: 'Banned' },
  { id: 10241, username: 'techgirl', name: 'Liza Ingabire', email: 'liza@domain.com', status: 'Active' },
]

const seedQueue = [
  { id: 'q1', type: 'Video', title: 'Crazy stunts…', by: 'travelguy_22', reports: 789, reason: 'Violence / Dangerous', severity: 'High', status: 'Open' },
  { id: 'q2', type: 'Post', title: 'Make money fast…', by: 'fastleman', reports: 456, reason: 'Scam / Fraud', severity: 'High', status: 'Open' },
  { id: 'q3', type: 'Comment', title: 'This is toxic…', by: 'user321', reports: 654, reason: 'Harassment', severity: 'Medium', status: 'Open' },
  { id: 'q4', type: 'Video', title: 'Copyright music…', by: 'musiclover', reports: 12, reason: 'Copyright Violation', severity: 'High', status: 'Open' },
  { id: 'q5', type: 'Post', title: 'Political hate speech…', by: 'politician03', reports: 777, reason: 'Hate Speech', severity: 'High', status: 'Open' },
  { id: 'q6', type: 'Message', title: 'Check this link…', by: 'user999', reports: 222, reason: 'Phishing', severity: 'Medium', status: 'Open' },
]

const seedReports = [
  { id: 'R1001', type: 'Account', user: 'fastguy123', reason: 'Scam', status: 'Open', ago: '2h ago' },
  { id: 'R1002', type: 'Post', user: 'fakeuser', reason: 'Harassment', status: 'Under Review', ago: '3h ago' },
  { id: 'R1003', type: 'Message', user: 'spammer', reason: 'Phishing', status: 'Open', ago: '4h ago' },
]

const seedAppeals = [
  { id: 'A2201', type: 'Suspension', user: 'coderboy', reason: 'False positive spam', status: 'Open', ago: '1h ago' },
  { id: 'A2202', type: 'Content removal', user: 'musiclover', reason: 'Fair use claim', status: 'Under Review', ago: '5h ago' },
]

const seedPlans = [
  { id: 'basic', name: 'Basic Verification', monthly: 10, yearly: 75, discount: '37.5%', subscribers: 12402, tick: 'blue' },
  { id: 'pro', name: 'Pro Verification', monthly: 19, yearly: 130, discount: '43.0%', subscribers: 8731, tick: 'blue' },
  { id: 'biz', name: 'Business Verification', monthly: 36, yearly: 300, discount: '30.6%', subscribers: 4298, tick: 'white' },
  { id: 'creator', name: 'Creator Pro', monthly: 50, yearly: 400, discount: '33.3%', subscribers: 2147, tick: 'white' },
  { id: 'master', name: 'Master Plan', monthly: 150, yearly: 1000, discount: '44.4%', subscribers: 892, tick: 'gold' },
]

function empty() {
  return {
    users: seedUsers,
    queue: seedQueue,
    reports: seedReports,
    appeals: seedAppeals,
    plans: seedPlans,
    activity: [
      { t: 'New user registered', ago: '2 minutes ago', n: 1240, tone: 'ok' },
      { t: 'New report submitted', ago: '5 minutes ago', n: 12, tone: 'warn' },
      { t: 'New channel created', ago: '8 minutes ago', n: 3, tone: 'info' },
      { t: 'Payment received', ago: '12 minutes ago', n: 6, tone: 'ok' },
    ],
    audit: [],
    totals: {
      users: 1248532,
      active: 482317,
      posts: 3942618,
      channels: 48392,
    },
    growth: [220, 280, 310, 340, 390, 450, 520, 580, 640, 700, 760, 820],
  }
}

export function loadAdmin() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  const d = empty()
  localStorage.setItem(KEY, JSON.stringify(d))
  return d
}

export function saveAdmin(d) {
  localStorage.setItem(KEY, JSON.stringify(d))
  window.dispatchEvent(new Event('chatra-admin'))
}

export function logAudit(admin, action, target, reason) {
  admin.audit.unshift({
    admin: 'admin_123',
    action,
    target,
    reason,
    at: new Date().toISOString(),
  })
}


