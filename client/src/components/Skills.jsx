import Split from './Split.jsx'
import { skills } from '../data.js'
export default function Skills() {
  return (
    <section id="skills" data-s="Skills" className="skillsec">
      <p className="lab">03 / Technical skills</p>
      <h2 className="big" data-reveal><Split text="The tools I" /> <em><Split text="build with." /></em></h2>
      <ul className="srows">
        {Object.entries(skills).map(([k, v], i) => (
          <li key={k} className="fade"><span className="sn">0{i + 1}</span><h3>{k}</h3><p>{v.map((s) => <span key={s}>{s}</span>)}</p></li>
        ))}
      </ul>
    </section>
  )
}
