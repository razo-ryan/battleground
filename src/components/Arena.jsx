import { useState } from 'react'
import PlaceholderCard from './PlaceholderCard.jsx'
import { NAME_MAX, SAME_FIGHTER_ERROR, validateFighters } from '../lib/validation.js'

// Empty and too-short errors wait until the field is blurred, so they don't
// nag while someone is still typing. Too-long errors show straight away.
function visibleError(raw, error, touched) {
  if (!error) return null
  if (touched || [...raw.trim()].length > NAME_MAX) return error
  return null
}

function FighterField({ id, label, placeholder, value, onChange, onBlur, error, invalid }) {
  const errorId = `${id}-error`
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">{label}</label>
      <input
        id={id}
        className="input"
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={invalid}
        aria-describedby={error ? errorId : undefined}
      />
      <p id={errorId} className="field__error" aria-live="polite">{error}</p>
    </div>
  )
}

// Stage 3: fighter inputs and validation. The result below is still placeholder content.
export default function Arena() {
  const [fighterA, setFighterA] = useState('')
  const [fighterB, setFighterB] = useState('')
  const [touched, setTouched] = useState({ a: false, b: false })

  const validation = validateFighters(fighterA, fighterB)
  const errorA = visibleError(fighterA, validation.a, touched.a)
  // The self-fight error shows under Fighter 2 as soon as it applies; both inputs get the red border.
  const errorB = validation.same
    ? SAME_FIGHTER_ERROR
    : visibleError(fighterB, validation.b, touched.b)

  function handleSubmit(e) {
    e.preventDefault()
    if (!validation.valid) {
      setTouched({ a: true, b: true })
      return
    }
    // Stage 7 replaces this with the real fight flow.
    console.log('Fight:', fighterA.trim(), 'vs', fighterB.trim())
  }

  return (
    <section className="panel arena" aria-labelledby="arena-title">
      <h2 id="arena-title" className="panel__title">Arena</h2>

      <form className="fight-form" onSubmit={handleSubmit} noValidate>
        <FighterField
          id="fighter-a"
          label="Fighter 1"
          placeholder="e.g. Goku"
          value={fighterA}
          onChange={setFighterA}
          onBlur={() => setTouched((t) => ({ ...t, a: true }))}
          error={errorA}
          invalid={Boolean(errorA) || validation.same}
        />

        <span className="vs-badge" aria-hidden="true"><span>VS</span></span>

        <FighterField
          id="fighter-b"
          label="Fighter 2"
          placeholder="e.g. 10 cows"
          value={fighterB}
          onChange={setFighterB}
          onBlur={() => setTouched((t) => ({ ...t, b: true }))}
          error={errorB}
          invalid={Boolean(errorB)}
        />

        <button
          type="submit"
          className="btn btn--primary fight-form__submit"
          disabled={!validation.valid}
        >
          Fight!
        </button>
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
