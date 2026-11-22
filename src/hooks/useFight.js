import { useCallback, useRef, useState } from 'react'
import { runFight } from '../lib/fight.js'

// Fight state machine: idle → loading → result (or error).
//   status:   'idle' | 'loading' | 'result' | 'error'
//   progress: which parts have finished ({ verdict, a, b }), for the loading UI
//   result:   { fighters, winner, reasoning } when status is 'result'
//   error:    the Error when status is 'error'
const INITIAL_PROGRESS = { verdict: false, a: false, b: false }

export function useFight() {
  const [state, setState] = useState({ status: 'idle', progress: INITIAL_PROGRESS, result: null, error: null })
  const running = useRef(false) // a ref, so a second click in the same tick is blocked too

  const fight = useCallback(async (nameA, nameB) => {
    if (running.current) return
    running.current = true
    setState({ status: 'loading', progress: INITIAL_PROGRESS, result: null, error: null })

    try {
      const result = await runFight(nameA, nameB, (part) =>
        setState((s) => ({ ...s, progress: { ...s.progress, [part]: true } })),
      )
      setState((s) => ({ ...s, status: 'result', result }))
    } catch (error) {
      setState((s) => ({ ...s, status: 'error', error }))
    } finally {
      running.current = false
    }
  }, [])

  return { ...state, fight, isLoading: state.status === 'loading' }
}
