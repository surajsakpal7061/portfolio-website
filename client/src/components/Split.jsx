export default function Split({ text, cls = '' }) {
  return (
    <span className={`split ${cls}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" key={i} aria-hidden="true">
          {[...w].map((c, j) => <span className="c" key={j}>{c}</span>)}
          {'\u00A0'}
        </span>
      ))}
    </span>
  )
}
