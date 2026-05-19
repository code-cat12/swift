import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SUPPORTERS = [
  { name: 'Lana',   color: '#e84444' },
  { name: 'Collin', color: '#f5c842' },
  { name: 'Kash',   color: '#4caf7d' },
  { name: 'Alvin',  color: '#4a90d9' },
]

// Clean symmetric SVG heart
function Heart({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

export default function Supporters() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.supporters-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        immediateRender: false,
        opacity: 0, x: -28, duration: 0.7,
      })
      gsap.from('.supporters-heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 73%' },
        immediateRender: false,
        opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.supporter-card', {
        scrollTrigger: { trigger: '.supporters-grid', start: 'top 82%' },
        immediateRender: false,
        opacity: 0, y: 50, scale: 0.92,
        stagger: 0.12, duration: 0.7, ease: 'back.out(1.4)',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="supporters" ref={sectionRef} className="supporters-section">
      <div className="supporters-container">
        <div>
          <span className="section-label supporters-label">/ supporters</span>
          <h2 className="section-heading supporters-heading">
            people who<br />believed.
          </h2>
        </div>

        <div className="supporters-grid">
          {SUPPORTERS.map(({ name, color }) => (
            <div key={name} className="supporter-card glass">
              <div className="supporter-heart">
                <Heart color={color} size={32} />
              </div>
              <div className="supporter-info">
                <span className="supporter-name">{name}</span>
                <span className="supporter-role">supporter</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
