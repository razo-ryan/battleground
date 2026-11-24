import { useState } from 'react'
import { useFight } from '../hooks/useFight.js'
import FightLoading from './FightLoading.jsx'
import WinnerCard from './WinnerCard.jsx'
import { NAME_MAX, SAME_FIGHTER_ERROR, validateFighters } from '../lib/validation.js'

// Empty and too-short errors wait until the field is blurred, so they don't
// nag while someone is still typing. Too-long errors show straight away.
function visibleError(raw, error, touched) {
  if (!error) return null
  if (touched || [...raw.trim()].length > NAME_MAX) return error
  return null
}

function FighterField({ id, label, placeholder, value, onChange, onBlur, error, invalid, disabled }) {
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
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={error ? errorId : undefined}
      />
      <p id={errorId} className="field__error" aria-live="polite">{error}</p>
    </div>
  )
}

export default function Arena() {
  const [fighterA, setFighterA] = useState('')
  const [fighterB, setFighterB] = useState('')
  const [touched, setTouched] = useState({ a: false, b: false })
  const { status, progress, result, error, fight, isLoading } = useFight()

  const validation = validateFighters(fighterA, fighterB)
  const errorA = visibleError(fighterA, validation.a, touched.a)
  // The self-fight error shows under Fighter 2 as soon as it applies; both inputs get the red border.
  const errorB = validation.same
    ? SAME_FIGHTER_ERROR
    : visibleError(fighterB, validation.b, touched.b)

  function handleSubmit(e) {
    e.preventDefault()
    if (isLoading) return
    if (!validation.valid) {
      setTouched({ a: true, b: true })
      return
    }
    fight(fighterA, fighterB)
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
          disabled={isLoading}
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
          disabled={isLoading}
        />

        <button
          type="submit"
          className="btn btn--primary fight-form__submit"
          disabled={!validation.valid || isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Fighting…' : 'Fight!'}
        </button>
      </form>

      {status !== 'idle' && (
        <div className="result" aria-live="polite">
          {/* Inputs are disabled while loading, so the typed names match the running fight. */}
          {status === 'loading' && (
            <FightLoading names={[fighterA.trim(), fighterB.trim()]} progress={progress} />
          )}
          {status === 'error' && (
            <p className="result__status result__status--error" role="alert">{error.message}</p>
          )}
          {status === 'result' && <WinnerCard result={result} />}
        </div>
      )}
    </section>
  )
}
