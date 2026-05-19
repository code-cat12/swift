import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SKILLS = [
  {
    category: 'creative & design',
    items: ['Canva', 'Figma', 'Blender', 'After Effects', 'Photoshop', 'Premiere Pro'],
  },
  {
    category: 'development',
    items: ['React', 'Three.js', 'TypeScript', 'Node.js', 'GSAP', 'WebGL'],
  },
  {
    category: 'ai & tools',
    items: ['Claude', 'Midjourney', 'RunwayML', 'Cursor', 'GitHub Copilot', 'ElevenLabs'],
  },
  {
    category: 'platforms',
    items: ['Roblox Studio', 'Vercel', 'Git', 'Notion', 'VS Code', 'Docker'],
  },
]

export default function Skills() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        immediateRender: false,
        opacity: 0, x: -28, duration: 0.7,
      })
      gsap.from('.skills-heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 73%' },
        immediateRender: false,
        opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      // Animate whole cards — tags come along for free, no separate opacity: 0 on tags
      gsap.from('.skill-card', {
        scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' },
        immediateRender: false,
        opacity: 0, y: 50, scale: 0.95,
        stagger: 0.1, duration: 0.65, ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="skills-section">
      <div className="skills-container">
        <div>
          <span className="section-label skills-label">/ skills & tools</span>
          <h2 className="section-heading skills-heading">
            what i work<br />with.
          </h2>
        </div>

        <div className="skills-grid">
          {SKILLS.map(({ category, items }) => (
            <div key={category} className="skill-card glass">
              <span className="skill-category">{category}</span>
              <div className="skill-tags">
                {items.map(item => (
                  <span key={item} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
