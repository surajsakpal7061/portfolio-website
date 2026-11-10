import Split from './Split.jsx'
import { experience } from '../data.js'
export default function Experience() {
  return (
    <section id="experience" data-s="Experience" className="exp">
      <p className="lab">04 / Professional experience</p>
      <h2 className="big" data-reveal><Split text="Where I've" /> <em><Split text="been building." /></em></h2>
      <div className="exp-grid fade">
        <div><b>Sep 2024 – Present</b><h3>Full Stack Developer</h3><p>LocalVocalize, a startup in Maharashtra</p></div>
        <ul>{experience.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </section>
  )
}
