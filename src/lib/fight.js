// Runs one fight end to end: BattleDex lookup, then the verdict and any missing
// images in parallel. The result lives in memory only. Nothing is saved here;
// the user saves fighters individually from the result (Stage 11).

import { getVerdict, generateImage } from '../api/index.js'
import { findCharacter } from './storage.js'

// Gets the art for one fighter. Saved fighters reuse their stored image (no API
// call). Returns { image, imageSource } where imageSource is 'saved', 'generated'
// or 'refused'. Any image failure counts as a refusal, so the fight still completes.
async function resolveArt(fighter) {
  if (fighter.saved) {
    // A saved fighter with placeholder art keeps its placeholder until regenerated from the BattleDex.
    return { image: fighter.saved.image, imageSource: fighter.saved.image ? 'saved' : 'refused' }
  }
  try {
    const result = await generateImage(fighter.name)
    if (result.status === 'ok') return { image: result.image, imageSource: 'generated' }
  } catch (err) {
    console.warn(`Image generation failed for "${fighter.name}"`, err)
  }
  return { image: null, imageSource: 'refused' }
}

// onProgress(part) is called as each part finishes: 'verdict', 'a' or 'b'.
// Resolves to { fighters: [a, b], winner, reasoning }. Rejects if the verdict fails.
export async function runFight(nameA, nameB, onProgress = () => {}) {
  const fighters = [nameA, nameB].map((typed) => {
    const saved = findCharacter(typed)
    // Use the saved name's casing when the fighter is already in the BattleDex.
    return { name: saved ? saved.name : typed.trim(), saved }
  })

  const track = (part, promise) => promise.then((value) => (onProgress(part), value))

  const [verdict, artA, artB] = await Promise.all([
    track('verdict', getVerdict(fighters[0].name, fighters[1].name)),
    track('a', resolveArt(fighters[0])),
    track('b', resolveArt(fighters[1])),
  ])

  return {
    fighters: fighters.map((f, i) => ({
      name: f.name,
      isSaved: Boolean(f.saved),
      ...(i === 0 ? artA : artB),
    })),
    winner: verdict.winner,
    reasoning: verdict.reasoning,
  }
}
