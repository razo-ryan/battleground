// Temporary stand-in until the real FighterCard component (Stage 9).
export default function PlaceholderCard({ name, hue, winner = false, small = false }) {
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <article className={`card${winner ? ' card--winner' : ''}${small ? ' card--small' : ''}`}>
      {winner && <span className="card__ribbon">Winner</span>}
      <div className="card__art" style={{ '--art-hue': hue }}>
        <span className="card__initials">{initials}</span>
      </div>
      <h3 className="card__name">{name}</h3>
    </article>
  )
}
