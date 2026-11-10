import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cursor from './components/Cursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import Contact from './components/Contact.jsx'
gsap.registerPlugin(ScrollTrigger)

const pref = matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [motion, setMotion] = useState(!pref)
  const calm = !motion
  useEffect(() => { document.documentElement.classList.toggle('calm', calm) }, [calm])

  useEffect(() => {
    let lenis, tick
    if (!calm) {
      lenis = new Lenis({ lerp: 0.09, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    }
    const ctx = gsap.context(() => {
      if (calm) return
      gsap.from('.hname .c', { yPercent: 115, stagger: 0.03, duration: 1, ease: 'expo.out' })
      gsap.from('.hero .top, .tag, .hero .intro, .hero .cta, .stats, .portrait', { opacity: 0, y: 30, stagger: 0.08, duration: 0.9, delay: 0.1, ease: 'power3.out' })
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el.querySelectorAll('.c'), { yPercent: 115, stagger: 0.015, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }))
      gsap.utils.toArray('.fade').forEach((el) =>
        gsap.from(el, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
    })
    return () => { ctx.revert(); if (lenis) { gsap.ticker.remove(tick); lenis.destroy() } }
  }, [calm])

  return (
    <>
      <Cursor />
      <Nav motion={motion} onMotion={() => setMotion(!motion)} />
      <main>
        <Hero /><About /><Projects /><Skills /><Experience /><Contact />
      </main>
    </>
  )
}
