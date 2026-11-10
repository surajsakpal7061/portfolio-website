import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(cors())
app.use(express.json({ limit: '10kb' }))

const hits = new Map() // simple per-IP rate limit: 5 messages / 10 min
const limited = (ip) => {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 600000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 5
}
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

app.post('/api/contact', async (req, res) => {
  const { name = '', email = '', message = '', website = '' } = req.body || {}
  if (website) return res.json({ ok: true }) // honeypot
  const n = String(name).trim(), e = String(email).trim(), m = String(message).trim()
  if (n.length < 2 || n.length > 80) return res.status(400).json({ error: 'Enter your name (2–80 characters).' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return res.status(400).json({ error: 'Enter a valid email address.' })
  if (m.length < 10 || m.length > 2000) return res.status(400).json({ error: 'Message must be 10–2000 characters.' })
  if (limited(req.ip)) return res.status(429).json({ error: 'Too many messages. Try again in a few minutes.' })
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO } = process.env
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const t = nodemailer.createTransport({ host: SMTP_HOST, port: +SMTP_PORT || 465, secure: (+SMTP_PORT || 465) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })
      await t.sendMail({ from: `"Portfolio" <${SMTP_USER}>`, to: MAIL_TO || SMTP_USER, replyTo: e, subject: `Portfolio message from ${n}`, text: `${n} <${e}>\n\n${m}`, html: `<p><b>${esc(n)}</b> &lt;${esc(e)}&gt;</p><p>${esc(m).replace(/\n/g, '<br>')}</p>` })
    } else {
      const file = path.join(__dirname, 'messages.json')
      const all = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : []
      all.push({ name: n, email: e, message: m, at: new Date().toISOString() })
      fs.writeFileSync(file, JSON.stringify(all, null, 2))
    }
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not send right now. Email me directly instead.' })
  }
})

const dist = path.join(__dirname, '../client/dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (_, r) => r.sendFile(path.join(dist, 'index.html')))
}
app.listen(process.env.PORT || 5000, () => console.log('Server running'))
