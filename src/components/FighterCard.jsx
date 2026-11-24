// The one card used everywhere a fighter appears: the fight result, the winner
// card (Stage 10) and the BattleDex grid. Shows the fighter's art, or a styled
// silhouette placeholder when there is none (a refused image).
//
// Props:
//   name     fighter name, shown on the banner
//   image    image src (data URL), or null/undefined for the placeholder
//   winner   highlights the card and adds a "Winner" ribbon
//   small    compact size for the BattleDex grid

// Stable hue per name (case-insensitive), so a placeholder keeps its colour.
function hueFor(name) {
  let h = 0
  for (const ch of name.toLowerCase()) h = (h * 31 + ch.codePointAt(0)) >>> 0
  return h % 360
}

function Silhouette() {
  return (
    <svg className="card__silhouette" viewBox="0 0 100 120" aria-hidden="true">
      <circle cx="50" cy="38" r="20" />
      <path d="M12 120c0-26 17-44 38-44s38 18 38 44z" />
    </svg>
  )
}

export default function FighterCard({ name, image, winner = false, small = false }) {
  const classes = ['card', winner && 'card--winner', small && 'card--small', !image && 'card--placeholder']
    .filter(Boolean)
    .join(' ')

  return (
    <article className={classes} aria-label={winner ? `${name} (winner)` : name}>
      {winner && <span className="card__ribbon" aria-hidden="true">Winner</span>}

      <div className="card__art" style={image ? undefined : { '--art-hue': hueFor(name) }}>
        {image ? (
          <img src={image} alt={`Trading card art of ${name}`} draggable="false" />
        ) : (
          <>
            <Silhouette />
            <span className="card__no-art">No art</span>
          </>
        )}
      </div>

      <h3 className="card__name" title={name}>{name}</h3>
    </article>
  )
}
