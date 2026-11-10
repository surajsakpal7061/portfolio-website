import { useEffect, useRef } from 'react'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const COLORS = [0, 1, 2, 3, 4].map((i) => { const t = i / 4; return `rgb(${238 + 17 * t | 0},${238 - 68 * t | 0},${235 - 155 * t | 0})` })

// The portrait is drawn as dots. Scrolling away scatters the dots and fades them out; scrolling back gathers them again.
export default function Portrait() {
  const wrap = useRef(), img = useRef(), cv = useRef()
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = cv.current, ctx = canvas.getContext('2d')
    let groups = null, W = 0, H = 0, raf = 0, iw = 1
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      W = innerWidth; H = innerHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const build = (im) => {
      iw = im.naturalWidth
      const ih = im.naturalHeight, c = document.createElement('canvas')
      c.width = iw; c.height = ih
      const g = c.getContext('2d', { willReadFrequently: true })
      g.drawImage(im, 0, 0)
      const d = g.getImageData(0, 0, iw, ih).data
      const prob = innerWidth < 900 ? 0.3 : 0.5
      groups = [[], [], [], [], []]
      for (let y = 0; y < ih; y++) for (let x = 0; x < iw; x++) {
        const i = (y * iw + x) * 4
        if (d[i + 3] < 128 || Math.random() > prob) continue
        const fy = y / ih
        if (fy > 0.62 && Math.random() > clamp((1 - fy) / 0.38)) continue
        const a = Math.random() * 6.2832
        groups[Math.round(clamp((d[i] - d[i + 2]) / 80) * 4)].push({ x, y, dx: Math.cos(a), dy: Math.sin(a), d: 80 + Math.random() * 420, del: Math.random() * 0.35, k: Math.random() })
      }
    }
    const draw = () => {
      raf = 0
      const hero = wrap.current.closest('section')
      const calm = document.documentElement.classList.contains('calm')
      const p = calm ? 0 : clamp(scrollY / (hero.offsetHeight * 0.75))
      ctx.clearRect(0, 0, W, H)
      if (!groups || p <= 0.002) { img.current.style.opacity = 1; return }
      img.current.style.opacity = clamp(1 - p * 25)
      const r = wrap.current.getBoundingClientRect(), s = r.width / iw, sz = Math.max(1.4, 2.1 * s)
      ctx.globalAlpha = clamp(p * 25)
      groups.forEach((list, b) => {
        ctx.fillStyle = COLORS[b]
        for (const q of list) {
          const l = clamp(p * 1.3 - q.del)
          if (q.k < l * 1.05) continue
          const e = Math.pow(l, 1.5)
          ctx.fillRect(r.left + q.x * s + q.dx * q.d * e, r.top + q.y * s + (q.dy * q.d - 120) * e, sz, sz)
        }
      })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    size()
    const t = setTimeout(() => { const im = new Image(); im.onload = () => { build(im); schedule() }; im.src = '/suraj.webp' }, 400)
    const onResize = () => { size(); schedule() }
    addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', onResize)
    return () => { clearTimeout(t); cancelAnimationFrame(raf); removeEventListener('scroll', schedule); removeEventListener('resize', onResize) }
  }, [])
  return (
    <>
      <div className="portrait" ref={wrap}>
        <picture>
          <source type="image/avif" srcSet="/suraj-sm.avif 480w, /suraj.avif 819w" sizes="(max-width:900px) 90vw, 560px" />
          <img ref={img} src="/suraj.webp" srcSet="/suraj-sm.webp 480w, /suraj.webp 819w" sizes="(max-width:900px) 90vw, 560px" alt="Portrait of Suraj Sakpal" width="819" height="752" fetchpriority="high" decoding="async" />
        </picture>
      </div>
      <canvas ref={cv} className="dust" aria-hidden="true" />
    </>
  )
}
