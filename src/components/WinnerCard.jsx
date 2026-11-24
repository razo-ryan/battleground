import { useState } from 'react'
import FighterCard from './FighterCard.jsx'
import { useBattleDex } from '../hooks/useBattleDex.js'
import { saveFighter } from '../lib/fighters.js'
import { nameKey } from '../lib/validation.js'

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
//
// Stage 11: each fighter has its own Save to BattleDex button. Nothing is saved
// unless the user presses it.

const IMAGE_SOURCE_TEXT = {
  saved: 'art reused from BattleDex',
  generated: 'new art generated',
  refused: 'art refused (placeholder)',
}

// "Saved" comes from the live BattleDex, so deleting the fighter from the grid
// brings the button back. While saving, the button is disabled; on failure the
// message shows and the button can be pressed again.
function SaveButton({ fighter, isSaved }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    if (saving) return
    setSaving(true)
    setError(null)
    try {
      await saveFighter(fighter)
    } catch (err) {
      console.error(`Could not save "${fighter.name}"`, err)
      setError(err.name === 'BattleDexFullError' ? err.message : 'Could not save this fighter. Try again.')
    } finally {
      setSaving(false)
    }
  }

  const state = isSaved ? 'saved' : saving ? 'saving' : 'idle'

  return (
    <div className="save-fighter" aria-live="polite">
      {state === 'saved' ? (
        <span className="save-fighter__saved">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
          Saved<span className="visually-hidden"> {fighter.name} to BattleDex</span>
        </span>
      ) : (
        <button
          type="button"
          className="btn btn--ghost btn--sm save-fighter__btn"
          onClick={handleSave}
          disabled={state === 'saving'}
          aria-busy={state === 'saving'}
          aria-label={`Save ${fighter.name} to BattleDex`}
        >
          {state === 'saving' ? 'Saving…' : 'Save to BattleDex'}
        </button>
      )}
      {error && <p className="save-fighter__error" role="alert">{error}</p>}
    </div>
  )
}

function RevealSlot({ fighter, isWinner, isSaved, side }) {
  return (
    <div className="winner-card__fighter">
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
      <SaveButton fighter={fighter} isSaved={isSaved} />
    </div>
  )
}

export default function WinnerCard({ result }) {
  const [a, b] = result.fighters
  const characters = useBattleDex()
  const isSaved = (f) => characters.some((c) => c.nameKey === nameKey(f.name))

  return (
    <div className="winner-card">
      <div className="winner-card__cards">
        <RevealSlot fighter={a} isWinner={a.name === result.winner} isSaved={isSaved(a)} side="left" />
        <span className="vs-badge vs-badge--large winner-card__vs" aria-hidden="true"><span>VS</span></span>
        <RevealSlot fighter={b} isWinner={b.name === result.winner} isSaved={isSaved(b)} side="right" />
      </div>

      <div className="verdict winner-card__verdict">
        <p className="verdict__winner">
          <span className="verdict__label">Winner</span> {result.winner}
        </p>
        <p className="verdict__reasoning">{result.reasoning}</p>
        {/* Dev aid from Stage 7; removed in the Stage 14 tidy-up. */}
        <ul className="fight-debug">
          {result.fighters.map((f) => (
            <li key={f.name}>{f.name}: {IMAGE_SOURCE_TEXT[f.imageSource]}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
