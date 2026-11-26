import { CrownIcon, SilhouetteIcon } from './icons.jsx'

// The one card used everywhere a fighter appears: the fight result, the winner
// card (Stage 10) and the BattleDex grid. Shows the fighter's art, or a pixel
// silhouette on TV static when there is none (a refused image).
//
// Props:
//   name     fighter name, shown on the banner
//   image    image src (data URL), or null/undefined for the placeholder
//   winner   highlights the card and adds a "Winner" ribbon
//   small    compact size for the BattleDex grid

export default function FighterCard({ name, image, winner = false, small = false }) {
  const classes = ['card', winner && 'card--winner', small && 'card--small', !image && 'card--placeholder']
    .filter(Boolean)
    .join(' ')

  return (
    <article className={classes} aria-label={winner ? `${name} (winner)` : name}>
      {winner && (
        <span className="card__ribbon" aria-hidden="true">
          <CrownIcon />
          Winner
        </span>
      )}

      <div className="card__art">
        {image ? (
          <img src={image} alt={`Trading card art of ${name}`} draggable="false" />
        ) : (
          <>
            <SilhouetteIcon className="card__silhouette" />
            <span className="card__no-art">No art</span>
          </>
        )}
      </div>

      <h3 className="card__name" title={name}>{name}</h3>
    </article>
  )
}
