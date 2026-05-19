import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { db } from '../firebase'
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

const EXPECTED_HASH = '6b8475dc99d84f476903739332a46024d132bc4f4bd8de98b82f5e77cb812b5f'

const DEFAULT_MOODS = [
  { label: 'happy',    emoji: '😊', color: '#4caf7d' },
  { label: 'chill',    emoji: '🧊', color: '#6ab4d0' },
  { label: 'hype',     emoji: '🔥', color: '#f5a623' },
  { label: 'sad',      emoji: '😢', color: '#5c7cfa' },
  { label: 'tired',    emoji: '😴', color: '#9c7fd4' },
  { label: 'sick',     emoji: '🤒', color: '#f5c842' },
  { label: 'angry',    emoji: '😠', color: '#e53935' },
  { label: 'loved',    emoji: '🥰', color: '#e91e8c' },
  { label: 'anxious',  emoji: '😰', color: '#7c4daf' },
  { label: 'bored',    emoji: '😑', color: '#78909c' },
  { label: 'excited',  emoji: '🤩', color: '#ffb300' },
  { label: 'grateful', emoji: '🙏', color: '#ff7043' },
]

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function getCurrentMonthDays() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    days.push(date.toISOString().split('T')[0])
  }
  return days
}

const MONTH_NAMES = ['january','february','march','april','may','june','july','august','september','october','november','december']

export default function MoodCalendar() {
  const sectionRef = useRef(null)
  const [moods, setMoods] = useState({}) // { 'YYYY-MM-DD': { label, emoji, color } }
  const [moodTypes, setMoodTypes] = useState(DEFAULT_MOODS)

  // Admin panel state
  const [keySeq, setKeySeq] = useState([])
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  // Admin form
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMood, setSelectedMood] = useState('')
  const [newMoodLabel, setNewMoodLabel] = useState('')
  const [newMoodEmoji, setNewMoodEmoji] = useState('')
  const [newMoodColor, setNewMoodColor] = useState('#6ab4d0')

  const days = getCurrentMonthDays()
  const currentMonth = MONTH_NAMES[new Date().getMonth()]

  // Firebase listener for moods
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'mood_entries'), (snap) => {
      const data = {}
      snap.docs.forEach(d => { data[d.id] = d.data() })
      setMoods(data)
    })
    return () => unsub()
  }, [])

  // Firebase listener for mood types
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'mood_types'), (snap) => {
      if (!snap.empty) {
        setMoodTypes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      }
    })
    return () => unsub()
  }, [])

  // Key sequence listener: Up Up Up Down Down Down
  useEffect(() => {
    const SEQ = ['ArrowUp','ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowDown']
    const handleKey = (e) => {
      if (showAdmin || showPasswordPrompt) return
      setKeySeq(prev => {
        const next = [...prev, e.key].slice(-6)
        if (next.join(',') === SEQ.join(',')) {
          setShowPasswordPrompt(true)
          return []
        }
        return next
      })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showAdmin, showPasswordPrompt])

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const hash = await sha256(passwordInput)
    if (hash === EXPECTED_HASH) {
      setShowAdmin(true)
      setShowPasswordPrompt(false)
      setPasswordInput('')
      setPasswordError(false)
    } else {
      setPasswordError(true)
      setPasswordInput('')
    }
  }

  const handleSetMood = async () => {
    if (!selectedDate || !selectedMood) return
    const mood = moodTypes.find(m => m.label === selectedMood)
    if (!mood) return
    await setDoc(doc(db, 'mood_entries', selectedDate), {
      label: mood.label,
      emoji: mood.emoji,
      color: mood.color,
    })
  }

  const handleRemoveMood = async (date) => {
    await deleteDoc(doc(db, 'mood_entries', date))
  }

  const handleAddMoodType = async () => {
    if (!newMoodLabel.trim() || !newMoodEmoji.trim()) return
    await setDoc(doc(db, 'mood_types', newMoodLabel.trim()), {
      label: newMoodLabel.trim(),
      emoji: newMoodEmoji.trim(),
      color: newMoodColor,
    })
    setNewMoodLabel('')
    setNewMoodEmoji('')
    setNewMoodColor('#6ab4d0')
  }

  const handleRemoveMoodType = async (label) => {
    await deleteDoc(doc(db, 'mood_types', label))
  }

  const handleResetMoodTypes = async () => {
    for (const m of DEFAULT_MOODS) {
      await setDoc(doc(db, 'mood_types', m.label), {
        label: m.label, emoji: m.emoji, color: m.color,
      })
    }
  }

  const closeAdmin = () => {
    setShowAdmin(false)
    setPasswordInput('')
    setPasswordError(false)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    if (showAdmin || showPasswordPrompt) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showAdmin, showPasswordPrompt])

  // GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mood-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        immediateRender: false, opacity: 0, x: -28, duration: 0.7,
      })
      gsap.from('.mood-heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 73%' },
        immediateRender: false, opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.mood-grid-wrap', {
        scrollTrigger: { trigger: '.mood-grid-wrap', start: 'top 85%' },
        immediateRender: false, opacity: 0, y: 30, duration: 0.8, ease: 'expo.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Build weeks for current month
  const weeks = []
  let week = []
  const firstDay = new Date(days[0]).getDay()
  for (let i = 0; i < firstDay; i++) week.push(null)
  days.forEach(d => {
    week.push(d)
    if (week.length === 7) { weeks.push(week); week = [] }
  })
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  const today = new Date().toISOString().split('T')[0]

  // Days in the past (including today) with no mood logged
  const missingDays = days.filter(d => d <= today && !moods[d])

  // Compute top mood for this month
  const monthEntries = Object.entries(moods).filter(([date]) => date.startsWith(days[0].slice(0, 7)))
  const moodCounts = {}
  monthEntries.forEach(([, m]) => { moodCounts[m.label] = (moodCounts[m.label] || 0) + 1 })
  const topMoodLabel = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
  const topMood = topMoodLabel ? moodTypes.find(m => m.label === topMoodLabel[0]) : null
  const topCount = topMoodLabel ? topMoodLabel[1] : 0
  const totalLogged = monthEntries.length

  return (
    <section id="mood" ref={sectionRef} className="mood-section">
      <div className="mood-container">
        <div>
          <span className="section-label mood-label">/ mood</span>
          <h2 className="section-heading mood-heading">how i've been<br />feeling in {currentMonth}.</h2>
        </div>

        <div className="mood-layout">
        <div className="mood-grid-wrap glass">
          {/* Legend */}
          <div className="mood-legend">
            {moodTypes.map(m => (
              <div key={m.label} className="mood-legend-item">
                <div className="mood-dot" style={{ background: m.color }} />
                <span>{m.emoji} {m.label}</span>
              </div>
            ))}
          </div>

          {/* Calendar section with border */}
          <div className="mood-calendar-border">
          {/* Day labels */}
          <div className="mood-day-labels">
            {['sun','mon','tue','wed','thu','fri','sat'].map(d => (
              <span key={d} className="mood-day-label">{d}</span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="mood-grid">
            {weeks.map((wk, wi) => (
              <div key={wi} className="mood-week">
                {wk.map((day, di) => {
                  if (!day) return (
                    <div key={`${wi}-${di}`} className="mood-cell-wrap">
                      <div className="mood-cell mood-cell-empty" />
                    </div>
                  )
                  const entry = moods[day]
                  const dayNum = parseInt(day.split('-')[2])
                  return (
                    <div key={day} className="mood-cell-wrap">
                      <div
                        className={`mood-cell ${day === today ? 'mood-cell-today' : ''}`}
                        style={{ background: entry ? entry.color + 'cc' : 'rgba(168,216,234,0.08)', border: day === today ? '1px solid var(--ice-blue)' : '1px solid rgba(168,216,234,0.1)' }}
                        title={entry ? `${entry.emoji} ${entry.label} — ${day}` : day}
                      >
                        {entry && <span className="mood-cell-emoji">{entry.emoji}</span>}
                      </div>
                      <span className="mood-day-num">{dayNum}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          </div>{/* end mood-calendar-border */}
        </div>

        {/* Top mood card */}
        <div className="mood-top-card glass">
          <span className="mood-top-label">top mood</span>
          {topMood ? (
            <>
              <div className="mood-top-emoji" style={{ color: topMood.color }}>{topMood.emoji}</div>
              <div className="mood-top-info">
                <div className="mood-top-name" style={{ color: topMood.color }}>{topMood.label}</div>
                <div className="mood-top-count">{topCount} / {totalLogged} days</div>
              </div>
            </>
          ) : (
            <div className="mood-top-empty">no data yet</div>
          )}
        </div>

        </div>
      </div>

      {/* Password Prompt */}
      {showPasswordPrompt && (
        <div className="mood-overlay" onClick={() => { setShowPasswordPrompt(false); setPasswordInput(''); setPasswordError(false) }}>
          <div className="mood-password-box glass" onClick={e => e.stopPropagation()}>
            <p className="mood-password-title">enter password</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                autoFocus
                type="password"
                className="guestbook-input"
                placeholder="••••••••"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
              />
              {passwordError && <p className="mood-password-error">wrong password</p>}
              <button type="submit" className="guestbook-submit" style={{ marginTop: '0.8rem', width: '100%' }}>unlock</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="mood-overlay" onClick={closeAdmin}>
          <div className="mood-admin glass" onClick={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
            <div className="mood-admin-header">
              <span className="mood-admin-title">mood admin</span>
              <button className="mood-admin-close" onClick={closeAdmin}>✕</button>
            </div>

            <div className="mood-admin-body">
              {/* LEFT — entries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="mood-admin-section" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <p className="mood-admin-label">set mood</p>
                  <input type="date" className="guestbook-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                  <select className="guestbook-input" value={selectedMood} onChange={e => setSelectedMood(e.target.value)}>
                    <option value="">pick a mood...</option>
                    {moodTypes.map(m => (
                      <option key={m.label} value={m.label}>{m.emoji} {m.label}</option>
                    ))}
                  </select>
                  <button className="guestbook-submit" onClick={handleSetMood}>set mood</button>
                </div>

                <div className="mood-admin-section">
                  <p className="mood-admin-label">remove entry</p>
                  <div className="mood-admin-entries">
                    {Object.entries(moods).sort((a,b) => b[0].localeCompare(a[0])).map(([date, m]) => (
                      <div key={date} className="mood-admin-entry">
                        <span>{m.emoji} {date}</span>
                        <button className="guestbook-delete" onClick={() => handleRemoveMood(date)}>remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mood-admin-section">
                  <p className="mood-admin-label">missing days {missingDays.length > 0 && <span className="mood-missing-count">{missingDays.length}</span>}</p>
                  <div className="mood-admin-entries">
                    {missingDays.length === 0 && <span style={{ fontSize: '0.78rem', color: 'rgba(12,31,46,0.35)' }}>all caught up! ✓</span>}
                    {missingDays.map(date => (
                      <div key={date} className="mood-admin-entry">
                        <span>📅 {date}</span>
                        <button className="mood-reset-btn" onClick={() => { setSelectedDate(date); }}>fill in</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT — mood types */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="mood-admin-section" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <p className="mood-admin-label">add mood type</p>
                  <input className="guestbook-input" placeholder="label (e.g. angry)" value={newMoodLabel} onChange={e => setNewMoodLabel(e.target.value)} />
                  <input className="guestbook-input" placeholder="emoji (e.g. 😡)" value={newMoodEmoji} onChange={e => setNewMoodEmoji(e.target.value)} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="color" value={newMoodColor} onChange={e => setNewMoodColor(e.target.value)} style={{ width: 40, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.8rem', color: 'rgba(12,31,46,0.5)' }}>pick color</span>
                  </div>
                  <button className="guestbook-submit" onClick={handleAddMoodType}>add</button>
                </div>

                <div className="mood-admin-section">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p className="mood-admin-label">mood types</p>
                    <button className="mood-reset-btn" onClick={handleResetMoodTypes}>↺ reset defaults</button>
                  </div>
                  <div className="mood-admin-entries">
                    {moodTypes.map(m => (
                      <div key={m.label} className="mood-admin-entry">
                        <span>{m.emoji} {m.label}</span>
                        <button className="guestbook-delete" onClick={() => handleRemoveMoodType(m.label)}>remove</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
