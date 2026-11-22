// Quick check that the verdict schema accepts valid verdicts and rejects bad ones.
// Run with: npm run check:schema

import { verdictSchema } from '../api/_schemas/verdict.js'

const schema = verdictSchema('Goku', 'Superman')

const cases = [
  { label: 'valid verdict', input: { winner: 'Goku', reasoning: 'Goku is fast.' }, expect: true },
  { label: 'wrong winner name', input: { winner: 'Batman', reasoning: 'Batman has a plan.' }, expect: false },
  { label: 'wrong casing', input: { winner: 'goku', reasoning: 'Goku is fast.' }, expect: false },
  { label: 'tie', input: { winner: 'tie', reasoning: 'Too close to call.' }, expect: false },
  { label: 'empty reasoning', input: { winner: 'Superman', reasoning: '   ' }, expect: false },
  { label: 'missing reasoning', input: { winner: 'Superman' }, expect: false },
]

let failed = 0
for (const { label, input, expect } of cases) {
  const ok = schema.safeParse(input).success
  const pass = ok === expect
  if (!pass) failed++
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label} (${ok ? 'accepted' : 'rejected'})`)
}

if (failed) {
  console.error(`\n${failed} check(s) failed`)
  process.exit(1)
}
console.log('\nAll schema checks passed')
