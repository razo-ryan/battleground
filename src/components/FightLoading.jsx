import { CheckIcon } from './icons.jsx'

// Stage 8: loading UI shown in the Arena while a fight runs.
// Two face-down card slots (one per fighter's art) and a verdict row, each with
// its own status, so you can see what's still pending. Art stays hidden here;
// the reveal happens in Stage 10 once everything is ready.

// The progress bar is drawn as arcade-style segments.
const SEGMENTS = 12

function Cursor() {
  return <span className="cursor" aria-hidden="true" />
}

function ArtSlot({ name, done }) {
  return (
    <div className={`loading-slot${done ? ' is-done' : ''}`}>
      <div className="card-back loading-slot__card" aria-hidden="true" />
      <p className="loading-slot__name" title={name}>{name}</p>
      <p className="loading-status">
        {done ? <><CheckIcon className="loading-check" /> Art ready</> : <>Painting art<Cursor /></>}
      </p>
    </div>
  )
}

export default function FightLoading({ names, progress }) {
  const doneCount = [progress.verdict, progress.a, progress.b].filter(Boolean).length
  const lit = Math.round((doneCount / 3) * SEGMENTS)

  return (
    <div className="fight-loading">
      <div className="fight-loading__cards">
        <ArtSlot name={names[0]} done={progress.a} />
        <span className="vs-badge vs-badge--large vs-badge--pulse" aria-hidden="true"><span>VS</span></span>
        <ArtSlot name={names[1]} done={progress.b} />
      </div>

      <p className={`loading-verdict${progress.verdict ? ' is-done' : ''}`}>
        {progress.verdict ? (
          <><CheckIcon className="loading-check" /> Verdict is in</>
        ) : (
          <>The judge is deciding<Cursor /></>
        )}
      </p>

      <div
        className="loading-bar"
        role="progressbar"
        aria-label="Fight progress"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={doneCount}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={`loading-bar__seg${i < lit ? ' is-on' : ''}${i === lit ? ' is-next' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
