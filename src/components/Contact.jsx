import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.715-6.193-5.394 6.193H2.75l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="currentColor" aria-hidden="true">
      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
    </svg>
  )
}

const SOCIALS = [
  {
    platform: 'X (Twitter)',
    handle: '@icyswiftme',
    href: 'https://x.com/icyswiftme',
    Icon: XIcon,
    color: '#000000',
  },
  {
    platform: 'Discord',
    handle: '@icy.gb',
    href: 'https://discord.com/users/1306043139567517772',
    Icon: DiscordIcon,
    color: '#5865F2',
  },
]

export default function Contact() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current }

      gsap.from('.contact-label', {
        scrollTrigger: { ...trigger, start: 'top 78%' },
        immediateRender: false,
        opacity: 0, x: -28, duration: 0.7,
      })
      gsap.from('.contact-heading', {
        scrollTrigger: { ...trigger, start: 'top 73%' },
        immediateRender: false,
        opacity: 0, y: 44, duration: 0.9, ease: 'expo.out',
      })
      gsap.from('.contact-desc', {
        scrollTrigger: { ...trigger, start: 'top 68%' },
        immediateRender: false,
        opacity: 0, y: 20, duration: 0.65,
      })
      gsap.from('.social-link', {
        scrollTrigger: { trigger: '.contact-socials', start: 'top 82%' },
        immediateRender: false,
        opacity: 0, y: 32,
        stagger: 0.1, duration: 0.6, ease: 'power2.out',
      })
      gsap.from('.contact-footer', {
        scrollTrigger: { trigger: '.contact-footer', start: 'top 98%' },
        immediateRender: false,
        opacity: 0, duration: 0.9,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="contact-container">
        {/* Left — text */}
        <div className="contact-text">
          <span className="section-label contact-label">/ get in touch</span>
          <h2 className="section-heading contact-heading">
            let's build<br />something<br />
            <span className="gradient-text">great.</span>
          </h2>
          <p className="contact-desc">
            have an idea? want to collab? just wanna chat?<br />
            i'm always down — hit me up anywhere below.
          </p>
        </div>

        {/* Right — socials */}
        <div className="contact-socials">
          {SOCIALS.map(({ platform, handle, href, Icon, color }) => (
            <a
              key={platform}
              href={href}
              className="social-link glass"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-icon" style={{ color }}>
                <Icon />
              </span>
              <div className="social-info">
                <span className="social-platform">{platform}</span>
                <span className="social-handle">{handle}</span>
              </div>
              <span className="social-arrow">→</span>
            </a>
          ))}
        </div>
      </div>

      <footer className="contact-footer">
        <span>crafted with care by</span>
        <span className="footer-name">icy.</span>
        <span>— {new Date().getFullYear()}</span>
      </footer>
    </section>
  )
}
