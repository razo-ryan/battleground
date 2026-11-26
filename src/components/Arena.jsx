import { useState } from 'react'
import { useFight } from '../hooks/useFight.js'
import FightLoading from './FightLoading.jsx'
import WinnerCard from './WinnerCard.jsx'
import Window, { TitleBar } from './Window.jsx'
import { AlertIcon, ExclaimIcon, SwordsIcon, WarningIcon } from './icons.jsx'
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
      <p id={errorId} className="field__error" aria-live="polite">
        {error && <><ExclaimIcon className="field__error-icon" />{error}</>}
      </p>
    </div>
  )
}

// Verdict failure. Try again re-runs the same matchup (even if the inputs were
// edited since), and gets focus so keyboard users land on it: the Fight button
// was disabled during loading, so focus would otherwise be lost.
function FightError({ error, names, onRetry }) {
  return (
    <div className="pop fight-error" role="alert">
      <TitleBar title="Judge" icon={<AlertIcon />} variant="alert" small heading="span" controls={['close']} />
      <div className="pop__body">
        <WarningIcon className="pop__icon" />
        <div>
          <p className="pop__title">No verdict this time</p>
          <p className="pop__msg">{error.message}</p>
          <div className="pop__actions">
            <button type="button" className="btn btn--primary" onClick={onRetry} autoFocus>
              Try again<span className="visually-hidden">: {names[0]} vs {names[1]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Arena() {
  const [fighterA, setFighterA] = useState('')
  const [fighterB, setFighterB] = useState('')
  const [touched, setTouched] = useState({ a: false, b: false })
  const { status, names, progress, result, error, fight, retry, isLoading } = useFight()

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
    <Window
      className="arena"
      title={isLoading ? 'Arena — fighting…' : 'Arena'}
      titleId="arena-title"
      icon={<SwordsIcon />}
    >
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
          {status === 'loading' && <FightLoading names={names} progress={progress} />}
          {status === 'error' && <FightError error={error} names={names} onRetry={retry} />}
          {status === 'result' && <WinnerCard result={result} />}
        </div>
      )}
    </Window>
  )
}
