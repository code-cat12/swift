import { useEffect, useRef, useState } from 'react'
import { Snowflake, Sun, Leaf, Star } from 'lucide-react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ThreeBackground from './components/ThreeBackground'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Supporters from './components/Supporters'
import Contact from './components/Contact'
import MoodCalendar from './components/MoodCalendar'
import MusicPlayer from './components/MusicPlayer'
import WelcomeScreen from './components/WelcomeScreen'

gsap.registerPlugin(ScrollTrigger)

const THEMES = ['ice', 'sunny', 'green', 'red']

const THEME_ICONS = {
  ice:   <Snowflake size={18} strokeWidth={1.8} />,
  sunny: <Sun       size={18} strokeWidth={1.8} />,
  green: <Leaf      size={18} strokeWidth={1.8} />,
  red:   <Star      size={18} strokeWidth={1.8} />,
}

export default function App() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('icy-theme') || 'ice')

  useEffect(() => {
    document.body.classList.remove(...THEMES.map(t => `${t}-theme`))
    if (theme !== 'ice') document.body.classList.add(`${theme}-theme`)
    localStorage.setItem('icy-theme', theme)
  }, [theme])

  useEffect(() => {
    const audio = new Audio('https://files.catbox.moe/oi2tv2.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    return () => { audio.pause(); audio.src = '' }
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy(); gsap.ticker.remove(tick) }
  }, [])

  const cycleTheme = () => {
    setTheme(t => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length])
  }

  const handleWelcomeEnter = () => {
    const shouldPlay = localStorage.getItem('icy-music') !== 'off'
    if (audioRef.current && shouldPlay) {
      audioRef.current.play()
      setPlaying(true)
    }
    setShowWelcome(false)
  }

  const handleToggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause(); setPlaying(false)
      localStorage.setItem('icy-music', 'off')
    } else {
      audio.play(); setPlaying(true)
      localStorage.setItem('icy-music', 'on')
    }
  }

  return (
    <>
      {showWelcome && <WelcomeScreen onEnter={handleWelcomeEnter} theme={theme} />}
      <ThreeBackground theme={theme} />
      <CustomCursor />
      <ScrollProgress />
      <MusicPlayer audioRef={audioRef} playing={playing} onToggle={handleToggleMusic} />
      <button
        className={`theme-toggle theme-${theme}`}
        onClick={cycleTheme}
        title={`Theme: ${theme} — click to cycle`}
      >{THEME_ICONS[theme]}</button>
      <div className="content">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Supporters />
        <MoodCalendar />
        <Contact />
      </div>
    </>
  )
}
