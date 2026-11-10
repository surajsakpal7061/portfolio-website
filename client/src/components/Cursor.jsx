import { useEffect, useRef } from 'react'
export default function Cursor() {
  const dot = useRef(null), ring = useRef(null), glow = useRef(null)
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const p = { x: innerWidth / 2, y: innerHeight / 2 }, r = { ...p }, g = { ...p }
    let raf
    const mv = (e) => { p.x = e.clientX; p.y = e.clientY }
    const over = (e) => {
      const t = e.target.closest('a,button,input,textarea,[data-cur]')
      ring.current?.classList.toggle('big', !!t)
      ring.current?.setAttribute('data-label', t?.dataset.cur || '')
    }
    const tick = () => {
      r.x += (p.x - r.x) * 0.16; r.y += (p.y - r.y) * 0.16
      g.x += (p.x - g.x) * 0.06; g.y += (p.y - g.y) * 0.06
      dot.current.style.transform = `translate3d(${p.x}px,${p.y}px,0)`
      ring.current.style.transform = `translate3d(${r.x}px,${r.y}px,0)`
      glow.current.style.transform = `translate3d(${g.x}px,${g.y}px,0)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    addEventListener('mousemove', mv); addEventListener('mouseover', over)
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', mv); removeEventListener('mouseover', over); document.documentElement.classList.remove('has-cursor') }
  }, [])
  return <><div ref={glow} className="cur-glow" /><div ref={ring} className="cur-ring" /><div ref={dot} className="cur-dot" /></>
}
