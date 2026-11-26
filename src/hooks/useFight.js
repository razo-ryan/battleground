import { useCallback, useRef, useState } from 'react'
import { VerdictError } from '../api/index.js'
import { runFight } from '../lib/fight.js'

// Fight state machine: idle → loading → result (or error).
//   status:   'idle' | 'loading' | 'result' | 'error'
//   names:    [nameA, nameB] of the current/last fight (trimmed), or null when idle
//   progress: which parts have finished ({ verdict, a, b }), for the loading UI
//   result:   { fighters, winner, reasoning } when status is 'result'
//   error:    the Error when status is 'error'
//   retry():  runs the last fight again (used by the Try again button)
const INITIAL_PROGRESS = { verdict: false, a: false, b: false }

// Anything that isn't a VerdictError is unexpected (a bug or a network blip), so
// show a friendly message instead of a technical one. Try again still works.
function toUserError(error) {
  if (error instanceof VerdictError) return error
  console.error('Fight failed unexpectedly', error)
  return new VerdictError('Something went wrong during the fight. Try again.')
}

export function useFight() {
  const [state, setState] = useState({
    status: 'idle',
    names: null,
    progress: INITIAL_PROGRESS,
    result: null,
    error: null,
  })
  const running = useRef(false) // a ref, so a second click in the same tick is blocked too

  const fight = useCallback(async (nameA, nameB) => {
    if (running.current) return
    running.current = true
    const names = [nameA.trim(), nameB.trim()]
    setState({ status: 'loading', names, progress: INITIAL_PROGRESS, result: null, error: null })

    try {
      const result = await runFight(names[0], names[1], (part) =>
        setState((s) => ({ ...s, progress: { ...s.progress, [part]: true } })),
      )
      setState((s) => ({ ...s, status: 'result', result }))
    } catch (error) {
      setState((s) => ({ ...s, status: 'error', error: toUserError(error) }))
    } finally {
      running.current = false
    }
  }, [])

  const retry = useCallback(() => {
    if (state.names) fight(state.names[0], state.names[1])
  }, [fight, state.names])

  return { ...state, fight, retry, isLoading: state.status === 'loading' }
}
