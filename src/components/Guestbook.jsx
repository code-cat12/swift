import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { db } from '../firebase'
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp
} from 'firebase/firestore'

const STORAGE_KEY = 'icy_guestbook_mine'

const getMine = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
const saveMine = (ids) => localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))

export default function Guestbook() {
  const sectionRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [mine, setMine] = useState(getMine)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.guestbook-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        immediateRender: false,
        opacity: 0, x: -28, duration: 0.7,
      })
      gsap.from('.guestbook-heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 73%' },
        immediateRender: false,
        opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.guestbook-form', {
        scrollTrigger: { trigger: '.guestbook-form', start: 'top 82%' },
        immediateRender: false,
        opacity: 0, y: 40, duration: 0.8, ease: 'expo.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSending(true)
    try {
      const ref = await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      })
      const updated = [...getMine(), ref.id]
      saveMine(updated)
      setMine(updated)
      setName('')
      setMessage('')
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (err) {
      console.error(err)
    }
    setSending(false)
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'guestbook', id))
      const updated = getMine().filter(i => i !== id)
      saveMine(updated)
      setMine(updated)
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return ''
    return ts.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <section id="guestbook" ref={sectionRef} className="guestbook-section">
      <div className="guestbook-container">
        <div>
          <span className="section-label guestbook-label">/ guestbook</span>
          <h2 className="section-heading guestbook-heading">
            leave a<br />message.
          </h2>
        </div>

        <div className="guestbook-layout">
          {/* Form */}
          <form className="guestbook-form glass" onSubmit={handleSubmit}>
            <div className="guestbook-field">
              <label className="guestbook-label-field">your name</label>
              <input
                className="guestbook-input"
                type="text"
                placeholder="icy"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={32}
                required
              />
            </div>
            <div className="guestbook-field">
              <label className="guestbook-label-field">message</label>
              <textarea
                className="guestbook-input guestbook-textarea"
                placeholder="say something nice..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={280}
                rows={4}
                required
              />
              <span className="guestbook-char">{message.length}/280</span>
            </div>
            <button
              type="submit"
              className="guestbook-submit"
              disabled={sending || !name.trim() || !message.trim()}
            >
              {sent ? '✓ sent!' : sending ? 'sending...' : 'leave message →'}
            </button>
          </form>

          {/* Messages */}
          <div className="guestbook-messages">
            {messages.length === 0 && (
              <p className="guestbook-empty">be the first to leave a message 🧊</p>
            )}
            {messages.map(m => (
              <div key={m.id} className="guestbook-message glass">
                <div className="guestbook-message-header">
                  <span className="guestbook-message-name">{m.name}</span>
                  <div className="guestbook-message-meta">
                    <span className="guestbook-message-date">{formatDate(m.createdAt)}</span>
                    {mine.includes(m.id) && (
                      <button
                        className="guestbook-delete"
                        onClick={() => handleDelete(m.id)}
                        title="Delete your message"
                      >delete</button>
                    )}
                  </div>
                </div>
                <p className="guestbook-message-text">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
