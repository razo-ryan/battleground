// Fighter name rules from the brief. Kept out of components so the same rules
// can be reused (e.g. re-fights from the BattleDex in Phase 4).

export const NAME_MIN = 3
export const NAME_MAX = 20

// Lowercased key used for every case-insensitive comparison (validation and BattleDex lookup).
export function nameKey(name) {
  return name.trim().toLowerCase()
}

// Returns an error message for a single name, or null if it's valid.
export function validateName(raw) {
  // Count characters, not UTF-16 units, so an emoji counts as one.
  const length = [...raw.trim()].length
  if (length === 0) return 'Enter a fighter name.'
  if (length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters.`
  if (length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer.`
  return null
}

export const SAME_FIGHTER_ERROR = "A fighter can't fight itself. Pick someone else."

// Validates both fighters together. Returns { a, b, same, valid }: a/b are the
// per-field error messages (or null), same is true when both names match
// case-insensitively.
export function validateFighters(rawA, rawB) {
  const a = validateName(rawA)
  const b = validateName(rawB)
  const same = !a && !b && nameKey(rawA) === nameKey(rawB)

  return { a, b, same, valid: !a && !b && !same }
}
