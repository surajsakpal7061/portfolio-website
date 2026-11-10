import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Split from './Split.jsx'
import { projects } from '../data.js'
gsap.registerPlugin(ScrollTrigger)

const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('calm')

// small star burst on hover
function burst(card, e) {
  if (calm()) return
  const r = card.getBoundingClientRect()
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span')
    s.className = 'star'; s.textContent = '✦'
    s.style.left = `${e.clientX - r.left}px`; s.style.top = `${e.clientY - r.top}px`
    card.appendChild(s)
    const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 70
    gsap.fromTo(s, { scale: 0.4, opacity: 1 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, rotate: Math.random() * 180, scale: 0.4 + Math.random() * 0.9, opacity: 0, duration: 0.8 + Math.random() * 0.5, ease: 'power2.out', onComplete: () => s.remove() })
  }
}

function Card({ p }) {
  const [ok, setOk] = useState(true)
  return (
    <li className="pcard">
      <a href={p.url} target="_blank" rel="noopener noreferrer" data-cur="Visit ↗" aria-label={`${p.name}, open official website in a new tab`} onMouseEnter={(e) => burst(e.currentTarget, e)}>
        <i className="ln t" /><i className="ln r" /><i className="ln b" /><i className="ln l" />
        <div className="sketch">
          {ok ? <img src={`/images/projects/${p.img}.webp`} alt={`Homepage of ${p.name}`} width="800" height="560" loading="lazy" decoding="async" onError={() => setOk(false)} />
            : <div className="ph">Add <code>{p.img}.webp</code> to<br />public/images/projects/</div>}
        </div>
        <div className="cmeta">
          <p className="pcat">{p.cat}</p>
          <h3>{p.name}<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" strokeWidth="2" /></svg></h3>
          <p className="pd">{p.d}</p>
          {p.stack.length > 0 && <ul className="pstack" aria-label="Technologies">{p.stack.map((s) => <li key={s}>{s}</li>)}</ul>}
        </div>
      </a>
    </li>
  )
}

export default function Projects() {
  const root = useRef()
  useEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.pcard').forEach((c, i) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 88%' }, delay: (i % 3) * 0.08 })
        tl.from(c, { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' })
          .from(c.querySelectorAll('.ln.t,.ln.b'), { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, 0.1)
          .from(c.querySelectorAll('.ln.l,.ln.r'), { scaleY: 0, duration: 0.7, ease: 'power3.inOut' }, 0.1)
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="projects" data-s="Projects" className="projects" ref={root}>
      <p className="lab">02 / Selected work</p>
      <h2 className="big" data-reveal><Split text="Selected" /> <em><Split text="works." /></em></h2>
      <p className="psub fade">Some things I've designed, developed and brought to life.</p>
      <ul className="pgrid">{projects.map((p) => <Card key={p.id} p={p} />)}</ul>
    </section>
  )
}
