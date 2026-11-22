// The API layer the UI calls. Components import from here only, so the mocks can
// be swapped for the real /api/* functions (Stage 18) without touching the UI.
//
//   getVerdict(fighterA, fighterB) -> Promise<{ winner, reasoning }>   throws VerdictError
//   generateImage(name)            -> Promise<{ status: 'ok', image } | { status: 'refused' }>

export { getVerdict, generateImage } from './mock.js'
export { VerdictError } from './errors.js'
export { mockSettings } from './mockSettings.js'
