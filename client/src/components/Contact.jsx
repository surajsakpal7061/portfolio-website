import { useState } from 'react'
import Split from './Split.jsx'
import Magnetic from './Magnetic.jsx'
import { me } from '../data.js'

const check = (f) => {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (f.message.trim().length < 10) e.message = 'Write at least 10 characters.'
  return e
}
export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', message: '', website: '' })
  const [err, setErr] = useState({})
  const [st, setSt] = useState({ s: 'idle', m: '' })
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    const v = check(f); setErr(v)
    if (Object.keys(v).length) return
    setSt({ s: 'sending', m: '' })
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      console.log(API_URL)

      const r = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const d = await r.json().catch((err) => (console.log(err)))
      console.log(d)
      if (!r.ok) throw new Error(d.error || 'Something went wrong.')
      setSt({ s: 'done', m: 'Message sent. I will reply to your email soon.' }); setF({ name: '', email: '', message: '', website: '' })
    } catch (x) { setSt({ s: 'error', m: x.message }) }
  }
  const field = (k, label, Tag = 'input', extra = {}) => (
    <div className={`fld ${err[k] ? 'bad' : ''}`}>
      <Tag id={k} value={f[k]} onChange={on(k)} placeholder=" " aria-invalid={!!err[k]} aria-describedby={err[k] ? `${k}-e` : undefined} {...extra} />
      <label htmlFor={k}>{label}</label><i />
      {err[k] && <small id={`${k}-e`}>{err[k]}</small>}
    </div>
  )
  return (
    <section id="contact" data-s="Contact" className="contact">
      <p className="lab">05 / Contact</p>
      <h2 className="big" data-reveal><Split text="Have a project" /> <em><Split text="in mind?" /></em></h2>
      <div className="ct-grid">
        <ul className="links fade">
          <li><a href={`mailto:${me.email}`}>{me.email}</a></li>
          <li><a href={`tel:${me.phone.replace(/\s/g, '')}`}>{me.phone}</a></li>
          <li><a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href={me.github} target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
        <form onSubmit={submit} noValidate className="fade">
          {field('name', 'Your name', 'input', { autoComplete: 'name' })}
          {field('email', 'Your email', 'input', { type: 'email', autoComplete: 'email' })}
          {field('message', 'Tell me about the project', 'textarea', { rows: 4 })}
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={on('website')} name="website" />
          <Magnetic><button className="btn" disabled={st.s === 'sending'}>{st.s === 'sending' ? 'Sending…' : 'Send message'}</button></Magnetic>
          <p className={`msg ${st.s}`} role="status" aria-live="polite">{st.m}</p>
        </form>
      </div>
      <footer><a href="#home" className="logo">Suraj Sakpal.</a><span><a href={me.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={me.github} target="_blank" rel="noreferrer">GitHub</a><a href={`mailto:${me.email}`}>Email</a></span><small>© {new Date().getFullYear()} Suraj Sakpal · Maharashtra, India</small></footer>
    </section>
  )
}
