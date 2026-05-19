import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const MARQUEE_TEXT = Array(8).fill(null).flatMap(() => [
  'icy', '·', 'swift', '·', 'developer', '·', 'creator', '·',
])

export default function Hero() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.9 })

      tl.from('.hero-greeting', {
        opacity: 0, y: 18,
        duration: 0.7,
        ease: 'power2.out',
      })
      .from('.hero-char', {
        opacity: 0,
        y: 110,
        rotationX: -75,
        transformOrigin: '0% 50% -50px',
        stagger: 0.055,
        duration: 0.85,
        ease: 'expo.out',
      }, '-=0.35')
      .from('.hero-aka', {
        opacity: 0, x: -36,
        duration: 0.65,
        ease: 'power3.out',
      }, '-=0.5')
      .from('.hero-desc', {
        opacity: 0, y: 18,
        duration: 0.65,
        ease: 'power2.out',
      }, '-=0.4')
      .from('.hero-tags span', {
        opacity: 0, y: 16, scale: 0.85,
        stagger: 0.07,
        duration: 0.45,
        ease: 'back.out(1.5)',
      }, '-=0.35')
      .from('.hero-marquee', {
        opacity: 0, duration: 0.8,
      }, '-=0.3')
      .from('.hero-scroll-hint', {
        opacity: 0, y: 16,
        duration: 0.55,
      }, '-=0.5')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={sectionRef} className="hero-section">
      <div className="hero-inner">
        <p className="hero-greeting">hello world, i'm</p>

        <div className="hero-name" aria-label="icy.">
          {'icy.'.split('').map((ch, i) => (
            <span key={i} className="hero-char">{ch}</span>
          ))}
        </div>

        <div className="hero-aka">
          <span className="aka-also">also known as</span>
          <span className="aka-name">swift</span>
        </div>

        <p className="hero-desc">
          i craft digital experiences that move fast and feel alive.
          code is my language — design is my dialect.
        </p>

        <div className="hero-tags">
          <span>developer</span>
          <span className="tag-sep">·</span>
          <span>creator</span>
          <span className="tag-sep">·</span>
          <span>problem solver</span>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="hero-marquee">
        <div className="marquee-track">
          {MARQUEE_TEXT.map((word, i) => (
            <span key={i} className={word === '·' ? 'marquee-dot' : ''}>
              {word}
            </span>
          ))}
          {/* duplicate for seamless loop */}
          {MARQUEE_TEXT.map((word, i) => (
            <span key={`b${i}`} className={word === '·' ? 'marquee-dot' : ''}>
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>scroll to explore</span>
      </div>
    </section>
  )
}
