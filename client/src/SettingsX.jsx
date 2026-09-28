import React, { useMemo, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import { SETTINGS_PAGES } from './pages.js'
import { Tick } from './Tick.jsx'
import { PLANS } from './data.js'
import { loadSession, saveSession } from './store.js'

const CATS = [
  { id: 'account', label: 'Your account', to: '/settings/account' },
  { id: 'plans', label: 'Premium', to: '/plans' },
  { id: 'studio', label: 'Creator / Studio', to: '/studio' },
  { id: 'security', label: 'Security and account access', to: '/settings/security' },
  { id: 'privacy', label: 'Privacy and safety', to: '/settings/privacy' },
  { id: 'notifications', label: 'Notifications', to: '/settings/notifications' },
  { id: 'accessibility', label: 'Accessibility, display, and languages', to: '/settings/accessibility' },
  { id: 'data', label: 'Additional resources', to: '/settings/data' },
  { id: 'help', label: 'Help Center', to: '/help', ext: true },
]

export function SettingsHub() {
  const loc = useLocation()
  const [q, setQ] = useState('')
  const group = loc.pathname.split('/')[2] || 'account'
  const items = SETTINGS_PAGES.filter(p => p.group === group || (group === 'account' && p.group === 'account'))
  const filteredCats = CATS.filter(c => !q || c.label.toLowerCase().includes(q.toLowerCase()))
  const filteredItems = items.filter(p => !q || p.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="x-set">
      <div className="x-set-mid">
        <h2>Settings</h2>
        <div className="search" style={{ margin: '12px 0 8px' }}>
          <Search size={16} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search Settings" />
        </div>
        {filteredCats.map(c => (
          <NavLink key={c.id} to={c.to} className={({ isActive }) => 'x-row' + (isActive && !c.ext ? ' on' : '')}>
            <span>{c.label}</span>
            <ChevronRight size={18} color="#71767b" />
          </NavLink>
        ))}
      </div>
      <div className="x-set-right">
        <h2>{CATS.find(c => c.id === group)?.label || 'Your account'}</h2>
        <p className="muted" style={{ marginBottom: 16 }}>Manage what you see and share on Chatra.</p>
        {(filteredItems.length ? filteredItems : SETTINGS_PAGES.filter(p => p.group === 'account').slice(0, 12)).map(p => (
          <Link key={p.path} to={p.path} className="x-row">
            <div>
              <b>{p.title}</b>
              <div className="muted" style={{ fontWeight: 400, fontSize: 13 }}>Open this setting</div>
            </div>
            <ChevronRight size={18} color="#71767b" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ListsPage() {
  const [q, setQ] = useState('')
  const [lists, setLists] = useState([])
  return (
    <div className="page">
      <div className="search"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search Lists" /></div>
      <h3 style={{ margin: '18px 0 8px' }}>Discover new Lists</h3>
      <p className="muted">Lists you follow will show here. Create one to curate accounts.</p>
      <button className="chip" onClick={() => setLists(l => [...l, { name: 'New list ' + (l.length + 1), n: 0 }])}>+ Create List</button>
      <h3 style={{ margin: '24px 0 8px' }}>Your Lists</h3>
      {!lists.length && <p className="muted">You haven’t created or followed any Lists. When you do, they’ll show up here.</p>}
      {lists.map((l, i) => <div key={i} className="card">{l.name} · {l.n} members</div>)}
    </div>
  )
}

export function PremiumPage() {
  const [annual, setAnnual] = useState(false)
  const nav = useNavigate()
  const user = loadSession()?.user
  function take(p) {
    const s = loadSession()
    if (!s?.user) return
    s.user.planTick = p.tick
    s.user.verified = p.tick
    s.user.planId = p.id
    saveSession(s)
    nav('/profile')
  }
  return (
    <div className="page" style={{ maxWidth: 920 }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>Upgrade to Premium</h1>
      <p className="muted" style={{ textAlign: 'center' }}>Enhanced tools, verification seals, and distribution eligibility — never forced reach.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0 24px' }}>
        <button className={`chip ${annual ? 'on' : ''}`} onClick={() => setAnnual(true)}>Annual</button>
        <button className={`chip ${!annual ? 'on' : ''}`} onClick={() => setAnnual(false)}>Monthly</button>
      </div>
      <div className="prem-grid">
        {PLANS.slice(0, 3).map(p => {
          const active = user?.planId === p.id
          return (
            <div key={p.id} className="prem-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{p.name} <Tick kind={p.tick} size={20} /></div>
              <div className="prem-price">${annual ? p.annual : p.monthly} <span className="muted">/ {annual ? 'year' : 'month'}</span></div>
              <button className="btn" style={{ background: active ? '#333' : '#fff', color: active ? '#fff' : '#000', margin: '12px 0' }} onClick={() => take(p)}>
                {active ? 'This is your active subscription' : 'Subscribe'}
              </button>
              <ul className="muted">{p.perks.map(x => <li key={x}>✓ {x}</li>)}</ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
