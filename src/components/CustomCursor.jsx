import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current

    let mouseX = window.innerWidth  / 2
    let mouseY = window.innerHeight / 2
    let outerX = mouseX
    let outerY = mouseY
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      inner.style.left = mouseX + 'px'
      inner.style.top  = mouseY + 'px'
    }

    const loop = () => {
      outerX += (mouseX - outerX) * 0.11
      outerY += (mouseY - outerY) * 0.11
      outer.style.left = outerX + 'px'
      outer.style.top  = outerY + 'px'
      raf = requestAnimationFrame(loop)
    }

    loop()
    window.addEventListener('mousemove', onMove)

    const expand = (e) => {
      const el = e.target
      if (el.closest('a') || el.closest('button') || el.dataset.cursor) {
        outer.style.transform = 'translate(-50%, -50%) scale(1.9)'
        outer.style.background = 'rgba(168,216,234,0.08)'
        outer.style.borderColor = 'rgba(168,216,234,0.9)'
      }
    }

    const contract = () => {
      outer.style.transform = 'translate(-50%, -50%) scale(1)'
      outer.style.background = 'transparent'
      outer.style.borderColor = 'rgba(168,216,234,0.7)'
    }

    document.addEventListener('mouseover',  expand)
    document.addEventListener('mouseout',   contract)
    document.addEventListener('mousedown',  () => {
      outer.style.transform = 'translate(-50%, -50%) scale(0.85)'
    })
    document.addEventListener('mouseup',    contract)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  expand)
      document.removeEventListener('mouseout',   contract)
    }
  }, [])

  return (
    <>
      <div ref={outerRef} className="cursor-outer" />
      <div ref={innerRef} className="cursor-inner" />
    </>
  )
}
