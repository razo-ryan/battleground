import FighterCard from './FighterCard.jsx'

// Stage 2 sample fighters to show the grid layout; the real BattleDex arrives in Stage 12.
// No images yet, so they show the placeholder art.
const SAMPLE_FIGHTERS = ['Goku', 'Superman', '10 Cows', 'Darth Vader', 'A Very Angry Goose']

export default function BattleDex() {
  return (
    <section className="panel battledex" aria-labelledby="battledex-title">
      <div className="panel__header">
        <h2 id="battledex-title" className="panel__title">BattleDex</h2>
        <span className="pill">{SAMPLE_FIGHTERS.length} fighters</span>
      </div>

      <ul className="dex-grid">
        {SAMPLE_FIGHTERS.map((name) => (
          <li key={name} className="dex-grid__item">
            <FighterCard name={name} small />
            <div className="dex-grid__actions">
              <button type="button" className="btn btn--ghost btn--sm">Regenerate</button>
              <button type="button" className="btn btn--danger btn--sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
