import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const scrolled  = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const pct       = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0
      if (barRef.current) barRef.current.style.width = pct + '%'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress-track">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  )
}
