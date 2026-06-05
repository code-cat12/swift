import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const NAV_LINKS = [
  { href: '#about',    label: 'about'    },
  { href: '#skills',   label: 'skills'   },
  { href: '#projects',   label: 'projects'   },
  { href: '#supporters', label: 'supporters' },
  { href: '#contact',    label: 'contact'    },
]

export default function Navbar() {
  const navRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, delay: 0.4, ease: 'expo.out' }
    )
  }, [])

  return (
    <nav ref={navRef} className="navbar">
      <a href="#home" className="nav-logo">icy.</a>
      <div className="nav-links">
        {NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href} className="nav-link">{label}</a>
        ))}
      </div>
    </nav>
  )
}
