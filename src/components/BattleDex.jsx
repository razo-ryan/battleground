import PlaceholderCard from './PlaceholderCard.jsx'

// Stage 2: hard-coded fighters to show the grid layout.
const SAMPLE_FIGHTERS = [
  { name: 'Goku', hue: 28 },
  { name: 'Superman', hue: 215 },
  { name: '10 Cows', hue: 120 },
  { name: 'Darth Vader', hue: 0 },
  { name: 'A Very Angry Goose', hue: 50 },
]

export default function BattleDex() {
  return (
    <section className="panel battledex" aria-labelledby="battledex-title">
      <div className="panel__header">
        <h2 id="battledex-title" className="panel__title">BattleDex</h2>
        <span className="pill">{SAMPLE_FIGHTERS.length} fighters</span>
      </div>

      <ul className="dex-grid">
        {SAMPLE_FIGHTERS.map((f) => (
          <li key={f.name} className="dex-grid__item">
            <PlaceholderCard name={f.name} hue={f.hue} small />
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
