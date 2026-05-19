import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const isMobile = () => window.matchMedia('(max-width: 768px)').matches

const BG = {
  ice:   "https://i.redd.it/8hr60jort3w91.gif",
  sunny: "https://i.pinimg.com/originals/09/01/43/0901434384290893f3f67b1065855d60.gif",
  green: "https://i.pinimg.com/originals/7b/e5/a1/7be5a1cb85ca4d0483c1ff17a487d50a.gif",
  red:   "https://cdna.artstation.com/p/assets/images/images/083/367/432/original/kobe-ouano-vampire-castle-watermarked.gif?1735733105",
}

const ACCENT = {
  ice:   { logo: 'linear-gradient(160deg,#fff 0%,#6ab4d0 55%,#3a9fc0 100%)', sub: 'rgba(168,216,234,0.65)', kbd: '#6ab4d0', kbdBg: 'rgba(106,180,208,0.1)', kbdBorder: 'rgba(106,180,208,0.35)' },
  sunny: { logo: 'linear-gradient(160deg,#fff 0%,#f5a623 55%,#f7841a 100%)', sub: 'rgba(255,200,80,0.75)',  kbd: '#f5a623', kbdBg: 'rgba(245,166,35,0.1)',  kbdBorder: 'rgba(245,166,35,0.4)'  },
  green: { logo: 'linear-gradient(160deg,#fff 0%,#4caf50 55%,#2e7d32 100%)', sub: 'rgba(165,214,167,0.75)', kbd: '#4caf50', kbdBg: 'rgba(76,175,80,0.1)',   kbdBorder: 'rgba(76,175,80,0.4)'   },
  red:   { logo: 'linear-gradient(160deg,#fff 0%,#e53935 55%,#b71c1c 100%)', sub: 'rgba(239,154,154,0.75)', kbd: '#e53935', kbdBg: 'rgba(229,57,53,0.1)',   kbdBorder: 'rgba(229,57,53,0.4)'   },
}

export default function WelcomeScreen({ onEnter, theme = 'ice' }) {
  const screenRef = useRef(null)
  const a = ACCENT[theme] || ACCENT.ice

  const dismiss = () => {
    gsap.to(screenRef.current, {
      opacity: 0, duration: 0.9, ease: 'power2.inOut', onComplete: onEnter,
    })
  }

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Enter' && !isMobile()) dismiss() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onEnter])

  return (
    <div ref={screenRef} className="welcome-screen" onClick={isMobile() ? dismiss : undefined}>
      <div className="welcome-bg" style={{ backgroundImage: `url('${BG[theme]}')` }} />
      <div className="welcome-overlay" />
      <div className="welcome-content">
        <div className="welcome-logo" style={{ background: a.logo, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          icy.
        </div>
        <p className="welcome-sub" style={{ color: a.sub }}>creative developer & designer</p>
        <div className="welcome-hint">
          {isMobile() ? (
            <span className="hint-tap" style={{ color: a.sub }}>tap anywhere to enter</span>
          ) : (
            <>
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>press</span>
              <kbd style={{ color: a.kbd, background: a.kbdBg, borderColor: a.kbdBorder, boxShadow: `0 0 12px ${a.kbdBg}` }}>enter</kbd>
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>to enter</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
