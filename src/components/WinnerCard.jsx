import FighterCard from './FighterCard.jsx'

// Stage 10: the finished result screen. Both fighters' cards, the winner
// highlighted, and the judge's reasoning.
//
// Reveal (CSS only, see "Winner card" in index.css):
//   1. both cards slide in face-down from their sides
//   2. each card flips over to show the fighter
//   3. the loser dims, the winner glows and the verdict fades in
// It only mounts once the verdict and both images are ready (status 'result'),
// so the reveal never starts early. Under reduced motion it shows the final
// state straight away.

const IMAGE_SOURCE_TEXT = {
  saved: 'art reused from BattleDex',
  generated: 'new art generated',
  refused: 'art refused (placeholder)',
}

function RevealSlot({ fighter, isWinner, side }) {
  return (
    <div className={`reveal reveal--${side} ${isWinner ? 'reveal--winner' : 'reveal--loser'}`}>
      <div className="reveal__inner">
        <div className="reveal__face reveal__face--back card-back" aria-hidden="true">
          <span className="card-back__mark" />
        </div>
        <div className="reveal__face reveal__face--front">
          <FighterCard name={fighter.name} image={fighter.image} winner={isWinner} />
        </div>
      </div>
    </div>
  )
}

export default function WinnerCard({ result }) {
  const [a, b] = result.fighters

  return (
    <div className="winner-card">
      <div className="winner-card__cards">
        <RevealSlot fighter={a} isWinner={a.name === result.winner} side="left" />
        <span className="vs-badge vs-badge--large winner-card__vs" aria-hidden="true"><span>VS</span></span>
        <RevealSlot fighter={b} isWinner={b.name === result.winner} side="right" />
      </div>

      <div className="verdict winner-card__verdict">
        <p className="verdict__winner">
          <span className="verdict__label">Winner</span> {result.winner}
        </p>
        <p className="verdict__reasoning">{result.reasoning}</p>
        {/* Dev aid from Stage 7; removed in the Stage 14 tidy-up. */}
        <ul className="fight-debug">
          {result.fighters.map((f) => (
            <li key={f.name}>
              {f.name}: {IMAGE_SOURCE_TEXT[f.imageSource]}
              {f.isSaved ? ' · in BattleDex' : ' · not saved'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
