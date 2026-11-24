import { useState } from 'react'
import FighterCard from './FighterCard.jsx'
import { useBattleDex } from '../hooks/useBattleDex.js'
import { regenerateFighter } from '../lib/fighters.js'
import { deleteCharacter } from '../lib/storage.js'

// Stage 12: the saved fighters. Each one can have its art regenerated or be
// deleted (after an inline confirmation). The grid updates live as fighters
// are saved from the winner card.

const REGENERATE_MESSAGES = {
  ok: null,
  refused: 'The new art was refused. Kept the current art.',
  deleted: null,
}

function DexItem({ character }) {
  // idle | confirming | regenerating
  const [mode, setMode] = useState('idle')
  const [message, setMessage] = useState(null)

  async function handleRegenerate() {
    setMode('regenerating')
    setMessage(null)
    try {
      const outcome = await regenerateFighter(character)
      setMessage(REGENERATE_MESSAGES[outcome])
    } catch (err) {
      console.error(`Could not regenerate "${character.name}"`, err)
      setMessage(err.name === 'BattleDexFullError' ? err.message : 'Could not regenerate the art. Try again.')
    } finally {
      setMode('idle')
    }
  }

  function handleDelete() {
    deleteCharacter(character.id)
    // The item unmounts once the BattleDex updates, so there's nothing else to do.
  }

  const busy = mode === 'regenerating'

  return (
    <li className="dex-grid__item">
      <div className={`dex-card${busy ? ' is-busy' : ''}`} aria-busy={busy}>
        <FighterCard name={character.name} image={character.image} small />
        {busy && (
          <div className="dex-card__overlay" aria-hidden="true">
            <span>Painting…</span>
          </div>
        )}
      </div>

      {mode === 'confirming' ? (
        <div className="dex-grid__actions dex-grid__actions--confirm" role="group" aria-label={`Delete ${character.name}?`}>
          <span className="dex-grid__confirm-text">Delete?</span>
          <button type="button" className="btn btn--danger btn--sm is-armed" onClick={handleDelete}>
            Delete
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setMode('idle')} autoFocus>
            Cancel
          </button>
        </div>
      ) : (
        <div className="dex-grid__actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={handleRegenerate}
            disabled={busy}
            aria-label={`Regenerate art for ${character.name}`}
          >
            {busy ? 'Regenerating…' : 'Regenerate'}
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => setMode('confirming')}
            disabled={busy}
            aria-label={`Delete ${character.name}`}
          >
            Delete
          </button>
        </div>
      )}

      <p className="dex-grid__message" role="status">{message}</p>
    </li>
  )
}

export default function BattleDex() {
  const characters = useBattleDex()
  const count = characters.length

  return (
    <section className="panel battledex" aria-labelledby="battledex-title">
      <div className="panel__header">
        <h2 id="battledex-title" className="panel__title">BattleDex</h2>
        <span className="pill">{count} {count === 1 ? 'fighter' : 'fighters'}</span>
      </div>

      {count === 0 ? (
        <div className="empty-state">
          <div className="empty-state__card card-back" aria-hidden="true">
            <span className="card-back__mark" />
          </div>
          <p className="empty-state__title">No fighters saved yet</p>
          <p>Run a fight, then press <strong>Save to BattleDex</strong> under a fighter to keep them here.</p>
        </div>
      ) : (
        <ul className="dex-grid">
          {characters.map((c) => (
            <DexItem key={c.id} character={c} />
          ))}
        </ul>
      )}
    </section>
  )
}
