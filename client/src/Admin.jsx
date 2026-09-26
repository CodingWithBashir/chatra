import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Radio, FileText, Video, MessageCircle, Flag,
  Scale, CreditCard, BadgeCheck, Shield, BarChart3, Settings, Search, Bell
} from 'lucide-react'
import { loadAdmin, saveAdmin, logAudit } from './adminStore'

function useAdmin() {
  const [data, setData] = useState(loadAdmin)
  useEffect(() => {
    const fn = () => setData(loadAdmin())
    window.addEventListener('chatra-admin', fn)
    return () => window.removeEventListener('chatra-admin', fn)
  }, [])
  const patch = (mut) => {
    const next = structuredClone(data)
    mut(next)
    saveAdmin(next)
    setData(next)
  }
  return [data, patch]
}

const NAV = [
  ['/admin', LayoutDashboard, 'Dashboard', true],
  ['/admin/users', Users, 'Users'],
  ['/admin/channels', Radio, 'Channels'],
  ['/admin/posts', FileText, 'Posts'],
  ['/admin/videos', Video, 'Videos'],
  ['/admin/messages', MessageCircle, 'Messages'],
  ['/admin/reports', Flag, 'Reports'],
  ['/admin/appeals', Scale, 'Appeals'],
  ['/admin/payments', CreditCard, 'Payments'],
  ['/admin/verification', BadgeCheck, 'Verification'],
  ['/admin/moderation', Shield, 'Moderation'],
  ['/admin/analytics', BarChart3, 'Analytics'],
  ['/admin/settings', Settings, 'Settings'],
]

function Shell({ children }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  return (
    <div className="ad-root">
      <aside className="ad-side">
        <div className="ad-brand" onClick={() => nav('/admin')}>
          <span className="ad-logo">C</span> Chatra
        </div>
        {NAV.map(([to, Icon, label, exact]) => (
          <NavLink key={to} to={to} end={!!exact} className={({ isActive }) => 'ad-link' + (isActive ? ' on' : '')}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
        <div className="ad-admin-foot">
          <div className="ad-avatar">A</div>
          <div><b>Admin</b><div className="muted">Super Admin</div></div>
        </div>
      </aside>
      <div className="ad-body">
        <header className="ad-top">
          <div className="ad-search">
            <Search size={16} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything…" />
          </div>
          <div className="ad-top-right">
            <span className="ad-chip">Last 7 days ▾</span>
            <Bell size={18} />
            <span className="ad-ad">AD</span>
          </div>
        </header>
        <div className="ad-content">{children}</div>
      </div>
    </div>
  )
}

function Kpi({ label, value, delta, icon }) {
  return (
    <div className="ad-kpi">
      <div className="ad-kpi-ico">{icon}</div>
      <div>
        <div className="muted">{label}</div>
        <b>{value.toLocaleString()}</b>
        {delta != null && <div className={delta >= 0 ? 'up' : 'down'}>{(delta >= 0 ? '↑ ' : '↓ ') + Math.abs(delta)}%</div>}
      </div>
    </div>
  )
}

function Dashboard() {
  const [data, patch] = useAdmin()
  useEffect(() => {
    const id = setInterval(() => {
      const d = loadAdmin()
      d.totals.active += Math.floor(Math.random() * 9) - 2
      d.activity.unshift({
        t: ['New user registered', 'New report submitted', 'Payment received', 'Live started'][Math.floor(Math.random() * 4)],
        ago: 'just now',
        n: Math.floor(Math.random() * 20) + 1,
        tone: 'ok',
      })
      d.activity = d.activity.slice(0, 8)
      saveAdmin(d)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  const maxG = Math.max(...data.growth)
  const cats = [
    ['Technology', 28], ['Entertainment', 22], ['Gaming', 14], ['Education', 11], ['Lifestyle', 8],
  ]
  const web = 52, mobile = 42, desktop = 6

  return (
    <>
      <h1>Good morning, Admin</h1>
      <p className="muted">Here’s what’s happening on Chatra today.</p>
      <div className="ad-kpis">
        <Kpi label="Total Users" value={data.totals.users} delta={12.3} icon="👤" />
        <Kpi label="Active Users" value={data.totals.active} delta={8.1} icon="⚡" />
        <Kpi label="Total Posts" value={data.totals.posts} delta={16.7} icon="✉" />
        <Kpi label="Total Channels" value={data.totals.channels} delta={9.4} icon="📡" />
      </div>
      <div className="ad-grid-2">
        <div className="ad-card">
          <div className="ad-card-h">User Growth <span className="up">↑ 12.5%</span></div>
          <div className="ad-bars">
            {data.growth.map((v, i) => (
              <div key={i} className="ad-bar" style={{ height: `${(v / maxG) * 140}px` }} />
            ))}
          </div>
        </div>
        <div className="ad-card">
          <div className="ad-card-h">Platform Activity</div>
          <div className="ad-donut">
            <svg viewBox="0 0 42 42" width="140" height="140">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#1b3a55" strokeWidth="6" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2ee6c5" strokeWidth="6"
                strokeDasharray={`${web} ${100 - web}`} strokeDashoffset="25" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="6"
                strokeDasharray={`${mobile} ${100 - mobile}`} strokeDashoffset={25 - web} />
            </svg>
            <div>
              <b>{data.totals.users.toLocaleString()}</b>
              <div className="muted">Total users</div>
              <p>Web {web}% · Mobile {mobile}% · Desktop {desktop}%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="ad-grid-3">
        <div className="ad-card">
          <div className="ad-card-h">Recent Activity</div>
          {data.activity.map((a, i) => (
            <div key={i} className="ad-act">
              <span>{a.t}</span>
              <span className="muted">{a.ago}</span>
              <b className="up">+{a.n}</b>
            </div>
          ))}
        </div>
        <div className="ad-card">
          <div className="ad-card-h">Top Categories (by engagement)</div>
          {cats.map(([n, p]) => (
            <div key={n} className="ad-cat">
              <span>{n}</span>
              <div className="ad-track"><i style={{ width: p + '%' }} /></div>
              <span>{p}%</span>
            </div>
          ))}
        </div>
        <div className="ad-card">
          <div className="ad-card-h">Quick Actions</div>
          <NavLink className="ad-qa" to="/admin/reports">View Reports</NavLink>
          <NavLink className="ad-qa" to="/admin/users">Manage Users</NavLink>
          <NavLink className="ad-qa" to="/admin/moderation">Moderation Queue</NavLink>
          <NavLink className="ad-qa" to="/admin/settings">System Settings</NavLink>
        </div>
      </div>
    </>
  )
}

function UsersPage() {
  const [data, patch] = useAdmin()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(null)
  const filtered = data.users.filter(u => {
    const s = (u.username + u.name + u.email + u.id).toLowerCase()
    if (q && !s.includes(q.toLowerCase())) return false
    if (status !== 'All' && u.status !== status) return false
    return true
  })
  const counts = {
    total: data.users.length,
    active: data.users.filter(u => u.status === 'Active').length,
    suspended: data.users.filter(u => u.status === 'Suspended').length,
    banned: data.users.filter(u => u.status === 'Banned').length,
  }
  function setStatusOf(id, status) {
    patch(d => {
      const u = d.users.find(x => x.id === id)
      if (u) u.status = status
      logAudit(d, status, 'user_' + id, 'admin action')
    })
    setOpen(null)
  }
  return (
    <>
      <h1>User Management</h1>
      <p className="muted">Manage users, their status, and account actions.</p>
      <div className="ad-toolbar">
        <input className="ad-inp" placeholder="Search by username, email or ID…" value={q} onChange={e => { setQ(e.target.value); setPage(1) }} />
        <select className="ad-inp" value={status} onChange={e => setStatus(e.target.value)}>
          {['All', 'Active', 'Suspended', 'Banned'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="ad-kpis">
        <Kpi label="Total Users" value={data.totals.users} />
        <Kpi label="Active" value={counts.active} />
        <Kpi label="Suspended" value={counts.suspended} />
        <Kpi label="Banned" value={counts.banned} />
      </div>
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>@{u.username}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={'st ' + u.status.toLowerCase()}>{u.status}</span></td>
                <td>
                  <button className="ad-more" onClick={() => setOpen(open === u.id ? null : u.id)}>⋯</button>
                  {open === u.id && (
                    <div className="ad-menu">
                      <button onClick={() => setStatusOf(u.id, 'Active')}>Restore</button>
                      <button onClick={() => setStatusOf(u.id, 'Suspended')}>Suspend</button>
                      <button onClick={() => setStatusOf(u.id, 'Banned')}>Ban</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="muted">Showing {filtered.length} of {data.users.length} (platform {data.totals.users.toLocaleString()})</div>
      </div>
    </>
  )
}

function Moderation() {
  const [data, patch] = useAdmin()
  const [tab, setTab] = useState('All')
  const [sev, setSev] = useState('All')
  const [review, setReview] = useState(null)
  const tabs = ['All', 'Posts', 'Comments', 'Messages', 'Videos', 'Live']
  const list = data.queue.filter(i => {
    if (tab !== 'All' && !i.type.toLowerCase().includes(tab.slice(0, 4).toLowerCase()) && !(tab === 'Videos' && i.type === 'Video') && !(tab === 'Posts' && i.type === 'Post') && !(tab === 'Comments' && i.type === 'Comment') && !(tab === 'Messages' && i.type === 'Message') && !(tab === 'Live' && i.type === 'Live')) {
      if (tab !== 'All') {
        const map = { Posts: 'Post', Comments: 'Comment', Messages: 'Message', Videos: 'Video', Live: 'Live' }
        if (i.type !== map[tab]) return false
      }
    }
    if (sev !== 'All' && i.severity !== sev) return false
    return i.status === 'Open'
  })
  const counts = {
    All: data.queue.filter(x => x.status === 'Open').length,
    Posts: data.queue.filter(x => x.type === 'Post' && x.status === 'Open').length,
    Comments: data.queue.filter(x => x.type === 'Comment' && x.status === 'Open').length,
    Messages: data.queue.filter(x => x.type === 'Message' && x.status === 'Open').length,
    Videos: data.queue.filter(x => x.type === 'Video' && x.status === 'Open').length,
    Live: data.queue.filter(x => x.type === 'Live' && x.status === 'Open').length,
  }
  function decide(id, action) {
    patch(d => {
      const item = d.queue.find(x => x.id === id)
      if (item) item.status = action
      logAudit(d, action, id, item?.reason)
    })
    setReview(null)
  }
  return (
    <>
      <h1>Moderation Queue</h1>
      <p className="muted">Review flagged content, reports and potential violations. Coordinated reports trigger investigation — not automatic guilt.</p>
      <div className="ad-tabs">
        {tabs.map(t => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t} ({counts[t] || 0})</button>
        ))}
      </div>
      <div className="ad-toolbar">
        <select className="ad-inp" value={sev} onChange={e => setSev(e.target.value)}>
          {['All', 'High', 'Medium', 'Low'].map(s => <option key={s}>{s === 'All' ? 'All Severity' : s}</option>)}
        </select>
      </div>
      {list.map(i => (
        <div key={i.id} className="ad-mod-row">
          <div>
            <b>{i.type}: “{i.title}”</b>
            <div className="muted">by @{i.by} · {i.reports} reports</div>
          </div>
          <span className="muted">{i.reason}</span>
          <span className={'sev ' + i.severity.toLowerCase()}>{i.severity}</span>
          <button className="ad-review" onClick={() => setReview(i)}>Review</button>
        </div>
      ))}
      {review && (
        <div className="modal-back" onClick={() => setReview(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Case {review.id}</h2>
            <p>{review.type}: {review.title}</p>
            <p className="muted">Reason: {review.reason} · {review.reports} reports (investigate, do not auto-ban)</p>
            <div className="chip-row">
              <button className="chip" onClick={() => decide(review.id, 'Removed')}>Remove content</button>
              <button className="chip" onClick={() => decide(review.id, 'Warned')}>Warn</button>
              <button className="chip" onClick={() => decide(review.id, 'Dismissed')}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ReportsAppeals({ mode }) {
  const [data, patch] = useAdmin()
  const [tab, setTab] = useState(mode === 'appeals' ? 'Appeals' : 'Reports')
  const list = tab === 'Appeals' ? data.appeals : data.reports
  function setSt(id, status) {
    patch(d => {
      const arr = tab === 'Appeals' ? d.appeals : d.reports
      const it = arr.find(x => x.id === id)
      if (it) it.status = status
      logAudit(d, status, id, tab)
    })
  }
  return (
    <>
      <h1>Reports & Appeals</h1>
      <p className="muted">Handle user reports and their appeals.</p>
      <div className="ad-tabs">
        <button className={tab === 'Reports' ? 'on' : ''} onClick={() => setTab('Reports')}>Reports ({data.reports.length})</button>
        <button className={tab === 'Appeals' ? 'on' : ''} onClick={() => setTab('Appeals')}>Appeals ({data.appeals.length})</button>
      </div>
      <table className="ad-table">
        <thead><tr><th>ID</th><th>Type</th><th>User</th><th>Reason</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {list.map(r => (
            <tr key={r.id}>
              <td>#{r.id}</td><td>{r.type}</td><td>@{r.user}</td><td>{r.reason}</td>
              <td><span className={'st ' + (r.status === 'Open' ? 'active' : 'suspended')}>{r.status}</span></td>
              <td>{r.ago}</td>
              <td>
                <button className="chip" onClick={() => setSt(r.id, 'Under Review')}>Review</button>
                <button className="chip" onClick={() => setSt(r.id, 'Resolved')}>Resolve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function Analytics() {
  const [data] = useAdmin()
  const maxG = Math.max(...data.growth)
  return (
    <>
      <h1>Analytics</h1>
      <p className="muted">Detailed insights about platform usage and performance.</p>
      <div className="ad-tabs">
        {['Overview', 'Users', 'Engagement', 'Content', 'Channels', 'Revenue'].map(t => <button key={t}>{t}</button>)}
      </div>
      <div className="ad-kpis">
        <Kpi label="Total Views" value={28432567} delta={18.4} />
        <Kpi label="Active Users" value={data.totals.users} delta={12.5} />
        <Kpi label="Engagement Rate" value={6.8} delta={2.3} />
        <Kpi label="New Channels" value={4382} delta={16.7} />
      </div>
      <div className="ad-grid-2">
        <div className="ad-card">
          <div className="ad-card-h">User Growth</div>
          <div className="ad-bars">
            {data.growth.map((v, i) => <div key={i} className="ad-bar" style={{ height: `${(v / maxG) * 140}px` }} />)}
          </div>
        </div>
        <div className="ad-card">
          <div className="ad-card-h">Top Content Types</div>
          {[['Videos', 42], ['Posts', 28], ['Reels', 19], ['Articles', 11]].map(([n, p]) => (
            <div key={n} className="ad-cat"><span>{n}</span><div className="ad-track"><i style={{ width: p + '%' }} /></div><span>{p}%</span></div>
          ))}
        </div>
      </div>
    </>
  )
}

function Payments() {
  const [data, patch] = useAdmin()
  const [tab, setTab] = useState('Subscriptions')
  const [tx] = useState([
    { id: 'T9A1', user: 'niakodes', plan: 'Pro', amount: 19, state: 'Active' },
    { id: 'T9A2', user: 'algolab', plan: 'Master', amount: 150, state: 'Past Due' },
  ])
  return (
    <>
      <h1>Payments & Subscriptions</h1>
      <p className="muted">Manage payments, subscriptions and revenue (coming soon). Cards are never stored raw.</p>
      <div className="ad-tabs">
        {['Subscriptions', 'Transactions', 'Payouts'].map(t => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {tab === 'Subscriptions' && (
        <table className="ad-table">
          <thead><tr><th>Plan</th><th>Monthly</th><th>Yearly</th><th>Discount</th><th>Subscribers</th><th></th></tr></thead>
          <tbody>
            {data.plans.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.monthly}</td>
                <td>${p.yearly}</td>
                <td className="up">{p.discount}</td>
                <td>{p.subscribers.toLocaleString()}</td>
                <td><button className="chip" onClick={() => patch(d => { const x = d.plans.find(y => y.id === p.id); x.subscribers += 1 })}>Manage +1</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === 'Transactions' && tx.map(t => (
        <div key={t.id} className="ad-card">{t.id} · @{t.user} · ${t.amount} · {t.state}</div>
      ))}
      {tab === 'Payouts' && <div className="ad-card">Creator payouts: Coming Soon</div>}
    </>
  )
}

function Simple({ title, body }) {
  return <><h1>{title}</h1><p className="muted">{body}</p></>
}

export default function AdminApp() {
  return (
    <Shell>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="moderation" element={<Moderation />} />
        <Route path="reports" element={<ReportsAppeals mode="reports" />} />
        <Route path="appeals" element={<ReportsAppeals mode="appeals" />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="payments" element={<Payments />} />
        <Route path="verification" element={<Payments />} />
        <Route path="channels" element={<Simple title="Channels" body="Search and moderate channels. Health metrics are quality, satisfaction, policy — not a binary up/down." />} />
        <Route path="posts" element={<Simple title="Posts" body="Platform post inventory. Open moderation for flagged items." />} />
        <Route path="videos" element={<Simple title="Videos" body="Transcoding pipeline status and copyright claims." />} />
        <Route path="messages" element={<Simple title="Messages" body="Abuse reports on DMs only — contents stay private unless reported." />} />
        <Route path="settings" element={<Simple title="System Settings" body="API, database, cache, queue, storage, CDN, WebSocket, video, email, SMS, payments health." />} />
      </Routes>
    </Shell>
  )
}
