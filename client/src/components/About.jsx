import Split from './Split.jsx'
export default function About() {
  return (
    <section id="about" data-s="About" className="about">
      <p className="lab">01 / About</p>
      <h2 className="big" data-reveal><Split text="Practical code." /> <em><Split text="Built to be used." /></em></h2>
      <div className="about-grid">
        <div className="fade">
          <p className="lead">I'm a full stack developer with about two years of professional experience, building web applications, business websites and dashboards with the MERN stack.</p>
          <p>I work across React.js, Node.js, Express.js and MongoDB, and I deploy what I build myself on Ubuntu servers with Nginx and PM2.</p>
        </div>
        <ul className="edu fade">
          <li><b>MSc Computer Science</b><span>Mumbai University · Vartak College Vasai · 2024 – 2026</span></li>
          <li><b>BSc Computer Science</b><span>G M Vedak College</span></li>
          <li><b>Master React.js</b><span>Certification · Code Compile</span></li>
        </ul>
      </div>
    </section>
  )
}
