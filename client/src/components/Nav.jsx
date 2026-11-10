import { useEffect, useState } from 'react'
const links = [['About', 'about'], ['Work', 'projects'], ['Skills', 'skills'], ['Experience', 'experience']]
export default function Nav({ motion, onMotion }) {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return (
    <header className="nav">
      <a href="#home" className="logo" aria-label="Suraj Sakpal, home">Suraj Sakpal</a>
      <button className="mtog" onClick={onMotion} aria-pressed={!motion}>Motion {motion ? 'on' : 'off'}</button>
      <button className="burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}><i /><i /></button>
      <nav className={open ? 'open' : ''} aria-label="Primary">
        {links.map(([l, id]) => <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{l}</a>)}
        <a href="#contact" className="navcta" onClick={() => setOpen(false)}>Let's talk</a>
      </nav>
    </header>
  )
}
