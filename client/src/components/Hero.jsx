import Split from './Split.jsx'
import Portrait from './Portrait.jsx'
import Magnetic from './Magnetic.jsx'

export default function Hero() {
  return (
    <section id="home" data-s="Home" className="hero">
      <p className="lab top"><span>Full stack developer · MERN stack</span><span>Based in Maharashtra, India</span></p>
      <Portrait />
      <p className="tag">Building practical web products</p>
      <h1 className="hname"><Split text="Suraj Sakpal" /></h1>
      <p className="intro">I build web applications, business websites and dashboards with React, Node.js and MongoDB, and take them all the way to a live server.</p>
      <div className="cta">
        <Magnetic><a className="btn" href="#projects">Explore my work</a></Magnetic>
        <Magnetic><a className="btn ghost" href="#contact">Start a conversation</a></Magnetic>
        <a className="dl" href="/Suraj_Sakpal_Resume.pdf" download="Suraj_Sakpal_Resume.pdf">Download resume ↓</a>
      </div>
      <dl className="stats">
        <div><dt>2+</dt><dd>years building production apps</dd></div>
        <div><dt>5</dt><dd>live websites shipped</dd></div>
        <div><dt>2024</dt><dd>full stack at LocalVocalize</dd></div>
      </dl>
      <a className="scroll" href="#about" aria-label="Scroll to About"><span>Scroll to discover</span><i /></a>
    </section>
  )
}
