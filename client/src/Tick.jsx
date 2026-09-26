import React from 'react'

const SEAL = (() => {
  const spikes = 12, outer = 31, inner = 24, cx = 32, cy = 32
  const pts = []
  const step = Math.PI / spikes
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = i * step - Math.PI / 2
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`)
  }
  return pts.join(' ')
})()

export function Tick({ kind, size = 18, title }) {
  if (!kind) return null
  const k = String(kind).toLowerCase()
  const gold = k === 'gold' || k === 'master'
  const white = k === 'white'
  const gid = gold ? 'gGold' : white ? 'gWhite' : 'gBlue'
  const label = gold ? 'Gold verified' : white ? 'White verified' : 'Blue verified'
  const uid = gid + size
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={'tick-seal tick-' + (gold ? 'gold' : white ? 'white' : 'blue')}
      role="img"
      aria-label={title || label}
      style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4, flex: 'none' }}
    >
      <defs>
        <linearGradient id={uid} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          {gold && (
            <>
              <stop offset="0%" stopColor="#FFE566" />
              <stop offset="50%" stopColor="#F5C518" />
              <stop offset="100%" stopColor="#C98900" />
            </>
          )}
          {!gold && !white && (
            <>
              <stop offset="0%" stopColor="#5AC8FA" />
              <stop offset="100%" stopColor="#1D9BF0" />
            </>
          )}
          {white && (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cfd3d6" />
            </>
          )}
        </linearGradient>
      </defs>
      <polygon points={SEAL} fill={`url(#${uid})`} />
      <path
        fill={white ? '#0f1419' : '#ffffff'}
        d="M20.5 32.2 28 39.6 44.2 23.4 48 27.2 28 47.2 16.8 36z"
      />
    </svg>
  )
}

export default Tick
