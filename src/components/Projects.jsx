import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PROJECTS = [
  {
    title: 'Gubby Clicker',
    tag: 'game',
    desc: 'a clicker game built for the vibes. click gubby, get points, feel good.',
    url: 'https://gubby.vercel.app',
    logo: 'https://i.postimg.cc/vgXw5qHq/G.png',
    color: '#f5a623',
  },
  {
    title: 'Icy Animations',
    tag: 'side project',
    desc: 'a collection of smooth, icy motion experiments and animation showcases.',
    url: 'https://icyanime.vercel.app',
    logo: 'https://em-content.zobj.net/source/apple/237/snowflake_2744.png',
    color: '#6ab4d0',
  },
]

export default function Projects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects-label', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        immediateRender: false,
        opacity: 0, x: -28, duration: 0.7,
      })
      gsap.from('.projects-heading', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 73%' },
        immediateRender: false,
        opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.project-card', {
        scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
        immediateRender: false,
        opacity: 0, y: 60, scale: 0.95,
        stagger: 0.15, duration: 0.8, ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="projects-section">
      <div className="projects-container">
        <div>
          <span className="section-label projects-label">/ projects</span>
          <h2 className="section-heading projects-heading">
            stuff i've<br />shipped.
          </h2>
        </div>

        <div className="projects-grid">
          {PROJECTS.map(({ title, tag, desc, url, logo, color }) => (
            <a
              key={title}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card glass"
            >
              <div className="project-card-top">
                <div className="project-logo-wrap">
                  <img src={logo} alt={title} className="project-logo" />
                </div>
                <span className="project-tag" style={{ color, borderColor: color + '55', background: color + '18' }}>
                  {tag}
                </span>
              </div>

              <div className="project-card-body">
                <h3 className="project-title">{title}</h3>
                <p className="project-desc">{desc}</p>
              </div>

              <div className="project-card-footer">
                <span className="project-url">{url.replace('https://', '')}</span>
                <span className="project-arrow" style={{ color }}>↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
