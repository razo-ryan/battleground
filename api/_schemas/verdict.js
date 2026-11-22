// Battleground — verdict output contract (server-side).
// Kept separate from api/_prompts/judge.js so importing the schema never pulls
// in the system prompt. The prompt deliberately has no JSON formatting rules;
// this schema is what enforces the shape (via structured outputs in Stage 16).

import { z } from 'zod'

// Built per fight, so `winner` can only be one of the two fighter names.
// Pass the SAME cleaned names that are sent to Claude (after buildJudgeUserMessage
// strips `<` and `>`), or a correct verdict could fail validation.
export function verdictSchema(fighterA, fighterB) {
  return z.object({
    winner: z.enum([fighterA, fighterB]),
    reasoning: z.string().trim().min(1),
  })
}
