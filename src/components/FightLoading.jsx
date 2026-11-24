// Stage 8: loading UI shown in the Arena while a fight runs.
// Two face-down card slots (one per fighter's art) and a verdict row, each with
// its own status, so you can see what's still pending. Art stays hidden here;
// the reveal happens in Stage 10 once everything is ready.

function Check() {
  return (
    <svg className="loading-check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  )
}

function ArtSlot({ name, done }) {
  return (
    <div className={`loading-slot${done ? ' is-done' : ''}`}>
      <div className="card-back loading-slot__card" aria-hidden="true">
        <span className="card-back__mark loading-slot__mark" />
      </div>
      <p className="loading-slot__name" title={name}>{name}</p>
      <p className="loading-status">
        {done ? <><Check /> Art ready</> : 'Painting art…'}
      </p>
    </div>
  )
}

export default function FightLoading({ names, progress }) {
  const doneCount = [progress.verdict, progress.a, progress.b].filter(Boolean).length

  return (
    <div className="fight-loading">
      <div className="fight-loading__cards">
        <ArtSlot name={names[0]} done={progress.a} />
        <span className="vs-badge vs-badge--large vs-badge--pulse" aria-hidden="true"><span>VS</span></span>
        <ArtSlot name={names[1]} done={progress.b} />
      </div>

      <p className={`loading-verdict${progress.verdict ? ' is-done' : ''}`}>
        {progress.verdict ? (
          <><Check /> Verdict is in</>
        ) : (
          <>
            The judge is deciding
            <span className="loading-dots" aria-hidden="true"><i /><i /><i /></span>
          </>
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
        <span className="loading-bar__fill" style={{ '--progress': doneCount / 3 }} />
      </div>
    </div>
  )
}
