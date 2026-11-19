import PlaceholderCard from './PlaceholderCard.jsx'

// Stage 2: static layout with placeholder content. Logic arrives in later stages.
export default function Arena() {
  return (
    <section className="panel arena" aria-labelledby="arena-title">
      <h2 id="arena-title" className="panel__title">Arena</h2>

      <form className="fight-form" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="fighter-a" className="field__label">Fighter 1</label>
          <input id="fighter-a" className="input" type="text" placeholder="e.g. Goku" />
        </div>

        <span className="vs-badge" aria-hidden="true"><span>VS</span></span>

        <div className="field">
          <label htmlFor="fighter-b" className="field__label">Fighter 2</label>
          <input id="fighter-b" className="input" type="text" placeholder="e.g. 10 cows" />
        </div>

        <button type="submit" className="btn btn--primary fight-form__submit">Fight!</button>
      </form>

      <div className="result">
        <div className="result__cards">
          <PlaceholderCard name="Goku" hue={28} winner />
          <span className="vs-badge vs-badge--large" aria-hidden="true"><span>VS</span></span>
          <PlaceholderCard name="Superman" hue={215} />
        </div>

        <div className="verdict">
          <p className="verdict__winner">
            <span className="verdict__label">Winner</span> Goku
          </p>
          <p className="verdict__reasoning">
            Placeholder reasoning. Goku's raw speed and ki techniques let him close the gap before
            Superman can line up a decisive blow, and his habit of powering up mid-fight tips a
            close battle in his favour.
          </p>
        </div>
      </div>
    </section>
  )
}

