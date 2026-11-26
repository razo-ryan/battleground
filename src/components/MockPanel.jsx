import { useState } from 'react'
import { mockSettings } from '../api/index.js'
import { storageSettings } from '../lib/storage.js'

// Dev-only panel for the mock API failure switches (see src/api/mockSettings.js),
// plus the "BattleDex is full" switch from the storage layer.
// Rendered from App.jsx only when import.meta.env.DEV is true, so it never ships
// in a production build. It edits mockSettings directly; the mocks read it on
// every call, so a change applies to the next fight.
//
// Starts from whatever the URL set (?failVerdict, ?refuse=all, ?refuse=Goku,10 cows, ?dexFull).

function initialMode() {
  if (Array.isArray(mockSettings.refuseImages)) return 'names'
  return mockSettings.refuseImages ? 'all' : 'off'
}

export default function MockPanel() {
  const [failVerdict, setFailVerdict] = useState(mockSettings.failVerdict)
  const [dexFull, setDexFull] = useState(storageSettings.simulateFull)
  const [mode, setMode] = useState(initialMode)
  const [names, setNames] = useState(
    Array.isArray(mockSettings.refuseImages) ? mockSettings.refuseImages.join(', ') : '',
  )

  function applyRefusal(nextMode, nextNames) {
    mockSettings.refuseImages =
      nextMode === 'all' ? true
      : nextMode === 'names' ? nextNames.split(',').map((n) => n.trim()).filter(Boolean)
      : false
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    applyRefusal(nextMode, names)
  }

  function changeNames(value) {
    setNames(value)
    applyRefusal('names', value)
  }

  const active = failVerdict || mode !== 'off' || dexFull

  return (
    <details className="mock-panel">
      <summary className="mock-panel__toggle">
        <span className={`mock-panel__dot${active ? ' is-active' : ''}`} aria-hidden="true" />
        Mock API
        {active && <span className="visually-hidden"> (failures on)</span>}
      </summary>

      <div className="mock-panel__body">
        <p className="mock-panel__note">Dev only. Applies to the next fight.</p>

        <label className="mock-panel__row">
          <input
            type="checkbox"
            checked={failVerdict}
            onChange={(e) => {
              setFailVerdict(e.target.checked)
              mockSettings.failVerdict = e.target.checked
            }}
          />
          Fail every verdict
        </label>

        <fieldset className="mock-panel__group">
          <legend>Refuse images</legend>
          {[
            ['off', 'Never'],
            ['all', 'Every fighter'],
            ['names', 'Only these fighters'],
          ].map(([value, label]) => (
            <label key={value} className="mock-panel__row">
              <input
                type="radio"
                name="mock-refuse"
                value={value}
                checked={mode === value}
                onChange={() => changeMode(value)}
              />
              {label}
            </label>
          ))}
          {mode === 'names' && (
            <input
              className="input mock-panel__names"
              type="text"
              placeholder="Goku, 10 cows"
              aria-label="Fighters whose images are refused, comma separated"
              value={names}
              onChange={(e) => changeNames(e.target.value)}
            />
          )}
        </fieldset>

        <label className="mock-panel__row">
          <input
            type="checkbox"
            checked={dexFull}
            onChange={(e) => {
              setDexFull(e.target.checked)
              storageSettings.simulateFull = e.target.checked
            }}
          />
          BattleDex is full
        </label>
      </div>
    </details>
  )
}
