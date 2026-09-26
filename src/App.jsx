import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom'
import {
  Home, Compass, MessageCircle, Bell, Bookmark, Users, Radio, User, Settings as SettingsIcon,
  Search, Plus, Heart, ThumbsDown, MessageSquare, Repeat2, Share2, MoreHorizontal,
  Shield, BarChart3, Video, Mic, Newspaper, Calendar, Hash
} from 'lucide-react'
import { INTERESTS, SUGGESTED, SEED_POSTS, CHANNELS, COMMUNITIES, PLANS } from './data'
import { loadSession, saveSession, clearSession, ageFromDob, usernameOk } from './store'

function Logo({ size = 28 }) {
  return (
    <div className="logo-mark" style={{ width: size, height: size, fontSize: size * 0.42, borderRadius: size * 0.3 }}>
      C
    </div>
  )
}

function Landing() {
  const nav = useNavigate()
  return (
    <div className="app-bg landing">
      <div className="landing-card">
        <Logo size={52} />
        <h1>Connect.<br />Create.<br />Discover.</h1>
        <p className="sub">Chatra is a social, messaging and creator platform — not a cloned feed.</p>
        <button className="btn btn-primary" onClick={() => nav('/login')}>Log in</button>
        <button className="btn btn-ghost" onClick={() => nav('/signup')}>Create account</button>
        <div className="or">OR</div>
        <button className="btn btn-oauth" onClick={() => quickOauth('google')}>Continue with Google</button>
        <button className="btn btn-oauth" onClick={() => quickOauth('github')}>Continue with GitHub</button>
        <p className="legal">
          <a href="/legal/terms">Terms</a> · <a href="/legal/privacy">Privacy</a> · <a href="/legal/guidelines">Community Guidelines</a>
          <br /><a href="/help">Help / support</a> · <a href="/login">Forgot password</a>
        </p>
      </div>
    </div>
  )
  function quickOauth(p) {
    saveSession({
      user: {
        first: 'Guest', last: p, nick: p, handle: p + 'user',
        interests: ['Technology', 'Programming'], follows: SUGGESTED.slice(0, 4).map(s => s.id),
        email: `${p}@chatra.app`, oauth: p,
      },
      onboardingStep: 7,
    })
    nav('/home')
  }
}

function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  function submit(e) {
    e.preventDefault()
    const s = loadSession()
    if (!email || !pw) { setErr('Email and password required'); return }
    if (s?.user?.email && s.user.email !== email) { setErr('No account for this email'); return }
    if (!s) {
      saveSession({ user: { email, first: 'You', last: '', handle: 'you', interests: [], follows: SUGGESTED.slice(0,4).map(x=>x.id) } })
    }
    nav('/home')
  }
  return (
    <div className="app-bg landing">
      <form className="landing-card" onSubmit={submit}>
        <Logo />
        <h1 style={{ fontSize: '1.8rem' }}>Welcome back</h1>
        <p className="sub">Log in to Chatra</p>
        <div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="field"><label>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} /></div>
        {err && <p className="err">{err}</p>}
        <button className="btn btn-primary" type="submit">Log in</button>
        <button type="button" className="btn btn-ghost" onClick={() => nav('/signup')}>Create account</button>
        <p className="legal"><a href="/">← Landing</a></p>
      </form>
    </div>
  )
}

function Signup() {
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    first: '', last: '', nick: '', dob: '',
    email: '', country: 'Rwanda', phone: '', email2: '',
    emailCode: '', phoneCode: '', emailOk: false, phoneOk: false,
    student: '', school: '', field: '', grad: '',
    job: '', title: '', industry: '', status: '', income: 'Prefer not to say',
    interests: [], follows: [], handle: '',
  })
  const [err, setErr] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    const s = loadSession()
    if (s?.draftSignup) { setForm(s.draftSignup); setStep(s.onboardingStep || 1) }
  }, [])
  useEffect(() => {
    saveSession({ draftSignup: form, onboardingStep: step })
  }, [form, step])

  function next() {
    setErr('')
    if (step === 1) {
      if (!form.first || !form.last || !form.nick || !form.dob) { setErr('Required fields missing'); return }
      const age = ageFromDob(form.dob)
      if (age < 19) { setErr('You must be 19 or older. Date of birth is never shown publicly.'); return }
    }
    if (step === 2) {
      if (!form.email || !form.country) { setErr('Email and country required'); return }
      if (!form.emailOk) { setErr('Verify email with the code (use 123456)'); return }
    }
    if (step === 5 && form.interests.length < 3) { setErr('Pick at least 3 interests'); return }
    if (step === 6 && form.follows.length < 4) { setErr('Follow at least 4 accounts'); return }
    if (step === 7) {
      const u = usernameOk(form.handle)
      if (!u.ok) { setErr(u.reason); return }
      const user = { ...form, handle: u.name, agePrivate: ageFromDob(form.dob) }
      saveSession({ user, onboardingStep: 8 })
      nav('/home')
      return
    }
    setStep(s => s + 1)
  }

  return (
    <div className="app-bg landing">
      <div className="landing-card" style={{ width: 'min(520px, 100%)' }}>
        <Logo />
        <div className="steps">{[1,2,3,4,5,6,7].map(i => <span key={i} className={i <= step ? 'on' : ''} />)}</div>
        {step === 1 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>Who are you?</h1>
            <p className="sub">Basic identity. Age is calculated from date of birth.</p>
            <div className="field"><label>First name</label><input value={form.first} onChange={e=>set('first', e.target.value)} /></div>
            <div className="field"><label>Last name</label><input value={form.last} onChange={e=>set('last', e.target.value)} /></div>
            <div className="field"><label>Nickname</label><input value={form.nick} onChange={e=>set('nick', e.target.value)} /></div>
            <div className="field"><label>Date of birth</label><input type="date" value={form.dob} onChange={e=>set('dob', e.target.value)} /></div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>Contact</h1>
            <div className="field"><label>Email</label><input value={form.email} onChange={e=>set('email', e.target.value)} /></div>
            <button type="button" className="btn btn-ghost" onClick={() => alert('Verification code sent: 123456')}>Send verification code</button>
            <div className="field"><label>Email code</label>
              <input value={form.emailCode} onChange={e=>set('emailCode', e.target.value)} />
            </div>
            <button type="button" className="btn btn-oauth" onClick={() => {
              if (form.emailCode === '123456') { set('emailOk', true); alert('Email verified') } else alert('Invalid code')
            }}>Verify email</button>
            <div className="field"><label>Country</label><input value={form.country} onChange={e=>set('country', e.target.value)} /></div>
            <div className="field"><label>Phone (private)</label><input value={form.phone} onChange={e=>set('phone', e.target.value)} /></div>
            <button type="button" className="btn btn-ghost" onClick={() => alert('OTP sent: 000111')}>Send OTP</button>
            <div className="field"><label>OTP</label><input value={form.phoneCode} onChange={e=>set('phoneCode', e.target.value)} /></div>
            <div className="field"><label>Secondary email (optional)</label><input value={form.email2} onChange={e=>set('email2', e.target.value)} /></div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>Education</h1>
            <p className="sub">Optional unless you use campus features.</p>
            {['University','School','College / TVET','No, I am not currently a student','I dropped out'].map(o => (
              <button key={o} type="button" className={`chip ${form.student===o?'on':''}`} onClick={()=>set('student', o)}>{o}</button>
            ))}
            <div className="field" style={{marginTop:12}}><label>School / university</label><input value={form.school} onChange={e=>set('school', e.target.value)} /></div>
            <div className="field"><label>Field of study</label><input value={form.field} onChange={e=>set('field', e.target.value)} /></div>
            <div className="field"><label>Graduation year</label><input value={form.grad} onChange={e=>set('grad', e.target.value)} /></div>
          </>
        )}
        {step === 4 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>Work</h1>
            <p className="sub">Private. Never shown on your public profile automatically.</p>
            <div className="field"><label>Occupation</label><input value={form.job} onChange={e=>set('job', e.target.value)} /></div>
            <div className="field"><label>Job title</label><input value={form.title} onChange={e=>set('title', e.target.value)} /></div>
            <div className="field"><label>Industry</label><input value={form.industry} onChange={e=>set('industry', e.target.value)} /></div>
            <div className="field"><label>Employment status</label><input value={form.status} onChange={e=>set('status', e.target.value)} /></div>
            <div className="field"><label>Monthly income range</label>
              <select value={form.income} onChange={e=>set('income', e.target.value)}>
                {['Prefer not to say','$0–$100','$100–$500','$500–$1,000','$1,000–$5,000','$5,000+'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>What would you like to see?</h1>
            <p className="sub">Initializes recommendations — it does not lock your feed.</p>
            <div className="chip-row">
              {INTERESTS.map(i => (
                <button key={i} type="button" className={`chip ${form.interests.includes(i)?'on':''}`}
                  onClick={() => set('interests', form.interests.includes(i) ? form.interests.filter(x=>x!==i) : [...form.interests, i])}>{i}</button>
              ))}
            </div>
          </>
        )}
        {step === 6 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>Discover people</h1>
            <p className="sub">Follow at least 4 accounts. Following: {form.follows.length}</p>
            {SUGGESTED.map(a => (
              <div key={a.id} className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div><b>{a.name}</b> @{a.handle}<div className="muted">{a.bio}</div></div>
                <button type="button" className={`chip ${form.follows.includes(a.id)?'on':''}`}
                  onClick={() => set('follows', form.follows.includes(a.id) ? form.follows.filter(x=>x!==a.id) : [...form.follows, a.id])}>
                  {form.follows.includes(a.id) ? 'Following ✓' : 'Follow'}
                </button>
              </div>
            ))}
          </>
        )}
        {step === 7 && (
          <>
            <h1 style={{ fontSize: '1.6rem' }}>Choose @username</h1>
            <div className="field"><label>Username</label><input value={form.handle} onChange={e=>set('handle', e.target.value)} placeholder="@preferredusername" /></div>
            {form.handle && (() => {
              const u = usernameOk(form.handle)
              return u.ok
                ? <p className="ok">✓ Username available</p>
                : <div><p className="err">✕ {u.reason}</p>{u.suggestions && <p className="muted">Suggestions: {u.suggestions.join(', ')}</p>}</div>
            })()}
          </>
        )}
        {err && <p className="err">{err}</p>}
        <div style={{display:'flex',gap:8,marginTop:16}}>
          {step > 1 && <button className="btn btn-ghost" type="button" onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn btn-primary" type="button" onClick={next}>{step===7 ? 'Reserve username' : 'Continue'}</button>
        </div>
      </div>
    </div>
  )
}

function RequireAuth({ children }) {
  const s = loadSession()
  if (!s?.user) return <Navigate to="/" replace />
  return children
}

function Shell({ children }) {
  const nav = useNavigate()
  const loc = useLocation()
  const [createOpen, setCreateOpen] = useState(false)
  const items = [
    ['/home', Home, 'Home'],
    ['/explore', Compass, 'Explore'],
    ['/messages', MessageCircle, 'Messages'],
    ['/notifications', Bell, 'Notifications'],
    ['/bookmarks', Bookmark, 'Bookmarks'],
    ['/communities', Users, 'Communities'],
    ['/channels', Radio, 'Channels'],
    ['/profile', User, 'Profile'],
    ['/settings', SettingsIcon, 'Settings'],
  ]
  return (
    <div className="app-bg shell">
      <aside className="nav">
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18,padding:'0 8px'}}>
          <Logo size={36} /><span className="label" style={{fontWeight:800,letterSpacing:'.04em'}}>CHATRA</span>
        </div>
        {items.map(([to, Icon, label]) => (
          <NavLink key={to} to={to} className={({isActive}) => isActive || (to==='/home' && loc.pathname==='/') ? 'active' : ''}>
            <Icon size={20} /><span className="label">{label}</span>
          </NavLink>
        ))}
        <button className="create-plus" onClick={() => setCreateOpen(true)}><Plus size={18} /> <span className="label">Create</span></button>
      </aside>
      <main className="main">{children}</main>
      <aside className="rail">
        <div className="search" onClick={() => nav('/explore')}>
          <Search size={16} />
          <input readOnly placeholder="Search people, posts, channels" />
        </div>
        <div className="card" style={{marginTop:16}}>
          <b>Trending with quality</b>
          <p className="muted" style={{marginTop:8}}>#javascript · growth + quality filter</p>
          <p className="muted">#kigali · geo relevance</p>
          <p className="muted">#chatra · freshness</p>
        </div>
        <div className="card">
          <b>Who to follow</b>
          {SUGGESTED.slice(0,3).map(a => (
            <p key={a.id} style={{marginTop:8}}>@{a.handle} <span className="muted">{a.topic}</span></p>
          ))}
        </div>
      </aside>
      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} />}
    </div>
  )
}

function CreateModal({ onClose }) {
  const nav = useNavigate()
  const kinds = [
    ['Post', '/compose/post'],
    ['Video / Reel', '/compose/video'],
    ['Go Live', '/compose/live'],
    ['Story', '/compose/story'],
    ['Poll', '/compose/poll'],
    ['Article', '/compose/article'],
    ['Voice Post', '/compose/voice'],
    ['Event', '/compose/event'],
  ]
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h2>What would you like to create?</h2>
        <div className="chip-row" style={{marginTop:16}}>
          {kinds.map(([l, to]) => (
            <button key={l} className="chip" onClick={() => { onClose(); nav(to) }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Tick({ kind }) {
  if (!kind) return null
  return <span className={`badge ${kind}`} title={kind + ' verification'} />
}

function HomeFeed() {
  const session = loadSession()
  const user = session?.user
  const [tab, setTab] = useState('For You')
  const [posts, setPosts] = useState(() => {
    const extra = JSON.parse(localStorage.getItem('chatra.posts') || '[]')
    return [...extra, ...SEED_POSTS]
  })
  const [draft, setDraft] = useState('')
  const [weights, setWeights] = useState(() => JSON.parse(localStorage.getItem('chatra.weights') || '{}'))
  const tabs = ['For You','Following','Latest','Media','Videos','Channels']

  function publish() {
    if (!draft.trim()) return
    const p = {
      id: 'local-' + Date.now(),
      author: { name: user?.nick || user?.first || 'You', handle: user?.handle || 'you' },
      text: draft, likes: 0, dislikes: 0, comments: 0, type: 'post', why: 'You posted this', topic: 'Lifestyle',
    }
    const next = [p, ...posts]
    setPosts(next)
    localStorage.setItem('chatra.posts', JSON.stringify(next.filter(x => String(x.id).startsWith('local'))))
    setDraft('')
  }
  function react(id, key) {
    setPosts(ps => ps.map(p => p.id === id ? { ...p, [key]: (p[key]||0) + 1 } : p))
  }
  function signal(topic, dir) {
    const w = { ...weights, [topic]: (weights[topic] || 0) + dir }
    setWeights(w)
    localStorage.setItem('chatra.weights', JSON.stringify(w))
  }
  const filtered = useMemo(() => {
    let list = posts
    if (tab === 'Following') list = list.filter(p => (user?.follows||[]).includes(p.author.id) || String(p.id).startsWith('local'))
    if (tab === 'Media') list = list.filter(p => p.type === 'media')
    if (tab === 'Videos') list = list.filter(p => p.type === 'video')
    if (tab === 'Latest') list = [...list]
    return list
  }, [posts, tab, user])

  return (
    <>
      <div className="feed-tabs">
        {tabs.map(t => <button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}</button>)}
      </div>
      <div className="composer">
        <textarea placeholder="Share something on Chatra…" value={draft} onChange={e=>setDraft(e.target.value)} />
        <button className="btn btn-primary" style={{width:'auto'}} onClick={publish}>Post</button>
      </div>
      {filtered.map(p => (
        <article key={p.id} className="post">
          <div className="avatar">{(p.author.handle||'?')[0].toUpperCase()}</div>
          <div>
            <b>{p.author.name}</b> <Tick kind={p.author.verified} /> <span className="post-meta">@{p.author.handle}</span>
            <p style={{marginTop:6}}>{p.text}</p>
            <p className="why">Why am I seeing this? {p.why} · topic weight {weights[p.topic]||0}</p>
            <div className="post-actions">
              <button className="liked" onClick={() => { react(p.id,'likes'); signal(p.topic, 1) }}><Heart size={16}/> {p.likes}</button>
              <button className="disliked" onClick={() => { react(p.id,'dislikes'); signal(p.topic, -2) }}><ThumbsDown size={16}/> {p.dislikes}</button>
              <button><MessageSquare size={16}/> {p.comments}</button>
              <button><Repeat2 size={16}/> Repost</button>
              <button><Share2 size={16}/></button>
              <button onClick={() => signal(p.topic, -3)}>Not interested</button>
              <button><MoreHorizontal size={16}/></button>
            </div>
          </div>
        </article>
      ))}
    </>
  )
}

function Explore() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('Trending')
  const people = SUGGESTED.filter(s => (s.name+s.handle).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="page">
      <h2 className="page-title">Explore</h2>
      <div className="search"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="People, channels, posts, hashtags…" /></div>
      <div className="feed-tabs" style={{paddingLeft:0}}>
        {['Trending','For You','Popular','Latest','Videos','Channels','Topics'].map(t => (
          <button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}</button>
        ))}
      </div>
      {people.map(a => <div key={a.id} className="card"><b>{a.name}</b> @{a.handle}<div className="muted">{a.bio}</div></div>)}
      {CHANNELS.map(c => <div key={c.id} className="card">#{c.handle} · {c.cat}<div className="muted">Discovery by quality, not luck.</div></div>)}
    </div>
  )
}

function Messages() {
  const [sel, setSel] = useState('req')
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState([{ me:false, t:'Hey — this is a message request from @lenslight' }])
  return (
    <div className="msg-row">
      <div style={{borderRight:'1px solid var(--line)'}}>
        <div className="page" style={{paddingBottom:8}}><h2 className="page-title">Messages</h2></div>
        <div className={`conv ${sel==='req'?'on':''}`} onClick={()=>setSel('req')}>Message Requests · @lenslight</div>
        <div className={`conv ${sel==='g'?'on':''}`} onClick={()=>setSel('g')}>Group · JS Nightly</div>
      </div>
      <div className="page">
        <p className="muted">Accept · Delete · Block · Report</p>
        {msgs.map((m,i)=><div key={i} className={`bubble ${m.me?'me':'them'}`}>{m.t}</div>)}
        <div className="field" style={{marginTop:12}}>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Message…"
            onKeyDown={e => { if (e.key==='Enter' && text) { setMsgs([...msgs,{me:true,t:text}]); setText('') } }} />
        </div>
        <p className="muted">Typing · read receipts · disappearing messages · themes live in settings.</p>
      </div>
    </div>
  )
}

function Notifications() {
  const [tab, setTab] = useState('All')
  const items = [
    { t:'follower', text:'@niakodes followed you' },
    { t:'like', text:'@algolab liked your post' },
    { t:'system', text:'New login from Kigali · device Chrome' },
  ]
  return (
    <div className="page">
      <h2 className="page-title">Notifications</h2>
      <div className="chip-row">{['All','Mentions','Followers','Messages','Channels','System'].map(t=>(
        <button key={t} className={`chip ${tab===t?'on':''}`} onClick={()=>setTab(t)}>{t}</button>
      ))}</div>
      {items.map((n,i)=><div key={i} className="card">{n.text}</div>)}
    </div>
  )
}

function Bookmarks() {
  const [folders] = useState(['Programming','Movies','Ideas','Research','Music','Favorites'])
  return (
    <div className="page">
      <h2 className="page-title">Bookmarks</h2>
      {folders.map(f => <div key={f} className="card">{f}</div>)}
    </div>
  )
}

function Communities() {
  return (
    <div className="page">
      <h2 className="page-title">Communities</h2>
      {COMMUNITIES.map(c => <div key={c.id} className="card"><b>{c.name}</b><div className="muted">{c.members.toLocaleString()} members · rules · events · chat</div></div>)}
    </div>
  )
}

function Channels() {
  return (
    <div className="page">
      <h2 className="page-title">Channels</h2>
      {CHANNELS.map(c => (
        <div key={c.id} className="card">
          <b>{c.name}</b> @{c.handle}
          <div className="muted">Quality {c.health.quality} · Satisfaction {c.health.satisfaction} · Policy {c.health.policy} · Spam risk {c.health.spam}</div>
        </div>
      ))}
      <NavLink className="btn btn-primary" to="/studio" style={{marginTop:12}}>Open Chatra Studio</NavLink>
    </div>
  )
}

function Profile() {
  const user = loadSession()?.user || {}
  const [tab, setTab] = useState('Posts')
  return (
    <div className="page">
      <div className="profile-banner" />
      <div className="profile-head">
        <div className="avatar" style={{width:72,height:72,fontSize:24}}>{(user.handle||'Y')[0].toUpperCase()}</div>
        <h2>{user.nick || user.first} <Tick kind={user.planTick} /></h2>
        <p className="muted">@{user.handle} · Joined 2026 · Followers 4 · Following {user.follows?.length||0}</p>
        <p>{user.bio || 'Bio not set. Date of birth and income stay private.'}</p>
      </div>
      <div className="feed-tabs">{['Posts','Replies','Media','Likes','Reposts'].map(t=>(
        <button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t}</button>
      ))}</div>
      <p className="muted" style={{padding:16}}>Your {tab.toLowerCase()} will appear here.</p>
    </div>
  )
}

function Settings() {
  const nav = useNavigate()
  const user = loadSession()?.user
  return (
    <div className="page">
      <h2 className="page-title">Settings</h2>
      {['Account','Channel','Customization','Chatra Studio','Privacy','Security','Notifications','Verification','Billing','Accessibility','Language','Download my data','Delete account'].map(s => (
        <div key={s} className="card" style={{cursor:'pointer'}} onClick={() => {
          if (s==='Chatra Studio') nav('/studio')
          if (s==='Verification' || s==='Billing') nav('/plans')
          if (s==='Privacy') nav('/privacy')
          if (s==='Security') nav('/security')
          if (s==='Delete account') nav('/delete')
        }}>{s}</div>
      ))}
      <button className="btn btn-ghost" onClick={() => { clearSession(); nav('/') }}>Log out</button>
      <p className="muted" style={{marginTop:12}}>Signed in as @{user?.handle}</p>
    </div>
  )
}

function Studio() {
  return (
    <div className="page">
      <h2 className="page-title">Chatra Studio</h2>
      <div className="stat-grid">
        {[['Views','12.4k'],['Followers','1,902'],['Watch time','88h'],['Engagement','6.2%'],['Revenue','Coming Soon']].map(([k,v])=>(
          <div key={k} className="stat"><span className="muted">{k}</span><b>{v}</b></div>
        ))}
      </div>
      <div className="card" style={{marginTop:16}}>
        Audience (aggregated): 18–24 70% · 25–34 30% · privacy thresholds applied.
      </div>
      <div className="card">Content calendar · scheduled publishing · thumbnails · playlists · comment moderation · keywords · retention · traffic sources · copyright status.</div>
    </div>
  )
}

function Plans() {
  return (
    <div className="page">
      <h2 className="page-title">Verification & plans</h2>
      <p className="muted">Payment raises distribution eligibility. It never forces content onto people who do not want it.</p>
      {PLANS.map(p => (
        <div key={p.id} className="card">
          <b>{p.name}</b> <Tick kind={p.tick} /> · ${p.monthly}/mo or ${p.annual}/yr ({p.discount} off)
          <ul className="muted">{p.perks.map(x => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  )
}

function Privacy() {
  return (
    <div className="page">
      <h2 className="page-title">Privacy</h2>
      {['Who can follow me','Who can message me','Who can mention me','Who can comment','Likes visibility','Following list','Followers list','Search visibility','Activity status','Read receipts','Personalized recommendations'].map(x => (
        <div key={x} className="card">{x}
          <select defaultValue="Followers"><option>Everyone</option><option>Followers</option><option>People I follow</option><option>Verified</option><option>Nobody</option></select>
        </div>
      ))}
    </div>
  )
}

function Security() {
  return (
    <div className="page">
      <h2 className="page-title">Security · Active sessions</h2>
      <div className="card">Chrome · Kigali · Now <button className="chip">This device</button></div>
      <div className="card">Mobile Safari · yesterday <button className="chip">Revoke</button></div>
      <p className="muted">2FA · passkeys · recovery codes · login alerts.</p>
    </div>
  )
}

function DeleteAccount() {
  const nav = useNavigate()
  return (
    <div className="page">
      <h2 className="page-title">Delete account</h2>
      <p>Request → confirm identity → grace period → final deletion. Some security logs may be retained where legally required.</p>
      <button className="btn btn-ghost" onClick={() => { clearSession(); nav('/') }}>Confirm deletion request</button>
    </div>
  )
}

function Legal({ title, body }) {
  return (
    <div className="app-bg landing">
      <div className="landing-card" style={{width:'min(640px,100%)'}}>
        <h1 style={{fontSize:'1.8rem'}}>{title}</h1>
        <p className="sub">{body}</p>
        <a className="btn btn-primary" href="/">Back</a>
      </div>
    </div>
  )
}

function Compose({ kind }) {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  return (
    <div className="page">
      <h2 className="page-title">{kind}</h2>
      {kind === 'Video / Reel' && (
        <>
          <p className="muted">Upload → preview → trim / crop / captions → title * → hashtags → mentions → advanced.</p>
          <div className="field"><label>Video title *</label><input value={title} onChange={e=>setTitle(e.target.value)} /></div>
          <div className="field"><label>Description</label><textarea /></div>
          <div className="field"><label>Hashtags (space creates a new tag)</label><input placeholder="#coding #javascript" /></div>
        </>
      )}
      {kind === 'Go Live' && <p>PC · Phone · Camera · OBS. Multi-device: main / guest / angle. Prerecorded live is $50 / $150 plans and must be labelled.</p>}
      {kind === 'Story' && <p>Photos, short video, music, stickers, polls. Lives 24h. Save to Highlights.</p>}
      {kind === 'Poll' && <><div className="field"><label>Question</label><input /></div>{['A','B','C','D'].map(o=><div key={o} className="field"><label>Option {o}</label><input /></div>)}</>}
      {kind === 'Article' && <div className="field"><label>Markdown article</label><textarea rows={8} placeholder="# Title" /></div>}
      {kind === 'Voice Post' && <p>Record · waveform · speed · cover · download permission.</p>}
      {kind === 'Event' && <div className="field"><label>Title / date / RSVP</label><input /></div>}
      {kind === 'Post' && <div className="field"><textarea placeholder="Text, images, GIFs, mentions, hashtags…" /></div>}
      <button className="btn btn-primary" onClick={()=>nav('/home')}>Save draft</button>
    </div>
  )
}

function Admin() {
  return (
    <div className="page">
      <h2 className="page-title">Admin</h2>
      <div className="stat-grid">
        {['Users','Channels','Reports','Appeals','DAU','Revenue'].map(k => <div key={k} className="stat"><span className="muted">{k}</span><b>—</b></div>)}
      </div>
      <div className="card">Moderation queue: High / Medium / Low · evidence · audit trail. Coordinated reports trigger review, not automatic guilt.</div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/help" element={<Legal title="Help" body="Support center placeholder. Account, safety, creators." />} />
      <Route path="/legal/terms" element={<Legal title="Terms of Service" body="Use Chatra lawfully. Do not manipulate distribution or impersonate others." />} />
      <Route path="/legal/privacy" element={<Legal title="Privacy Policy" body="DOB, phone and income are private by default. You can download or delete your data." />} />
      <Route path="/legal/guidelines" element={<Legal title="Community Guidelines" body="No spam, scams, harassment, or coordinated abuse." />} />
      <Route path="/home" element={<RequireAuth><Shell><HomeFeed /></Shell></RequireAuth>} />
      <Route path="/explore" element={<RequireAuth><Shell><Explore /></Shell></RequireAuth>} />
      <Route path="/messages" element={<RequireAuth><Shell><Messages /></Shell></RequireAuth>} />
      <Route path="/notifications" element={<RequireAuth><Shell><Notifications /></Shell></RequireAuth>} />
      <Route path="/bookmarks" element={<RequireAuth><Shell><Bookmarks /></Shell></RequireAuth>} />
      <Route path="/communities" element={<RequireAuth><Shell><Communities /></Shell></RequireAuth>} />
      <Route path="/channels" element={<RequireAuth><Shell><Channels /></Shell></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Shell><Profile /></Shell></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Shell><Settings /></Shell></RequireAuth>} />
      <Route path="/studio" element={<RequireAuth><Shell><Studio /></Shell></RequireAuth>} />
      <Route path="/plans" element={<RequireAuth><Shell><Plans /></Shell></RequireAuth>} />
      <Route path="/privacy" element={<RequireAuth><Shell><Privacy /></Shell></RequireAuth>} />
      <Route path="/security" element={<RequireAuth><Shell><Security /></Shell></RequireAuth>} />
      <Route path="/delete" element={<RequireAuth><Shell><DeleteAccount /></Shell></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth><Shell><Admin /></Shell></RequireAuth>} />
      <Route path="/compose/post" element={<RequireAuth><Shell><Compose kind="Post" /></Shell></RequireAuth>} />
      <Route path="/compose/video" element={<RequireAuth><Shell><Compose kind="Video / Reel" /></Shell></RequireAuth>} />
      <Route path="/compose/live" element={<RequireAuth><Shell><Compose kind="Go Live" /></Shell></RequireAuth>} />
      <Route path="/compose/story" element={<RequireAuth><Shell><Compose kind="Story" /></Shell></RequireAuth>} />
      <Route path="/compose/poll" element={<RequireAuth><Shell><Compose kind="Poll" /></Shell></RequireAuth>} />
      <Route path="/compose/article" element={<RequireAuth><Shell><Compose kind="Article" /></Shell></RequireAuth>} />
      <Route path="/compose/voice" element={<RequireAuth><Shell><Compose kind="Voice Post" /></Shell></RequireAuth>} />
      <Route path="/compose/event" element={<RequireAuth><Shell><Compose kind="Event" /></Shell></RequireAuth>} />
    </Routes>
  )
}
