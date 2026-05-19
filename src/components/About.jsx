import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const STATS = [
  { num: '∞',    label: 'lines of code' },
  { num: '0ms',  label: 'tolerance for slow' },
  { num: '100%', label: 'pure vibes' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current }

      gsap.from('.about-label', {
        scrollTrigger: { ...trigger, start: 'top 78%' },
        immediateRender: false,
        opacity: 0, x: -28, duration: 0.7, ease: 'power2.out',
      })
      gsap.from('.about-heading', {
        scrollTrigger: { ...trigger, start: 'top 72%' },
        immediateRender: false,
        opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.about-text', {
        scrollTrigger: { ...trigger, start: 'top 68%' },
        immediateRender: false,
        opacity: 0, y: 24,
        stagger: 0.12, duration: 0.75, ease: 'power2.out',
      })
      gsap.from('.about-card', {
        scrollTrigger: { ...trigger, start: 'top 65%' },
        immediateRender: false,
        opacity: 0, x: 50, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.about-stat', {
        scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
        immediateRender: false,
        opacity: 0, y: 24, scale: 0.92,
        stagger: 0.1, duration: 0.6, ease: 'back.out(1.5)',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="about-section">
      <div className="about-container">
        <div className="about-left">
          <span className="section-label about-label">/ about me</span>
          <h2 className="section-heading about-heading">
            the person<br />behind the screen.
          </h2>
          <div className="about-text-block">
            <p className="about-text">
              i'm <strong>icy</strong> — also known as <strong>swift</strong>.
              a developer who moves fast and builds things that feel deliberate.
              obsessed with clean aesthetics, smooth motion, and experiences
              that linger after you close the tab.
            </p>
            <p className="about-text">
              i live at the intersection of design and engineering.
              from pixel-perfect UIs to complex systems — i bring ideas
              to life with precision, speed, and style.
            </p>
            <p className="about-text">
              when i'm not shipping code, i'm exploring new tech, messing with
              generative art, or chasing the perfect dark-mode palette.
            </p>
          </div>
        </div>

        <div className="about-right">
          <div className="about-card glass">
            <div className="about-avatar">
              <div className="avatar-ring" />
              <div className="avatar-inner">
                <span>icy.</span>
              </div>
            </div>

            <div className="about-stats">
              {STATS.map(({ num, label }) => (
                <div key={label} className="about-stat glass">
                  <span className="stat-num">{num}</span>
                  <span className="stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
