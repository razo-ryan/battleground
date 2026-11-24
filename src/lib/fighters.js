// BattleDex actions the UI triggers: saving a fighter from a fight result
// (Stage 11) and regenerating a saved fighter's art (Stage 12).

import { generateImage } from '../api/index.js'
import { compressImage } from './image.js'
import { findCharacter, saveCharacter } from './storage.js'

// Saves one fighter from a fight result. New art is compressed first; a fighter
// with no art (refused image) is saved with image: null so it shows the
// placeholder and can be regenerated later. If the fighter is already in the
// BattleDex its stored art is left untouched.
// Returns the saved character. Throws BattleDexFullError if storage is full.
export async function saveFighter(fighter) {
  const existing = findCharacter(fighter.name)
  if (existing) return existing

  let image = null
  if (fighter.image) {
    image = fighter.imageSource === 'saved' ? fighter.image : await compressImage(fighter.image)
  }
  return saveCharacter({ name: fighter.name, image })
}

// Generates new art for a saved fighter, compresses it and saves it.
// Resolves to:
//   'ok'       new art saved
//   'refused'  the image was refused; the current art is kept
//   'deleted'  the fighter was deleted while the art was generating; nothing saved
// Throws if generation fails or BattleDexFullError if storage is full.
export async function regenerateFighter(character) {
  const result = await generateImage(character.name)
  if (result.status !== 'ok') return 'refused'

  const image = await compressImage(result.image)
  if (!findCharacter(character.name)) return 'deleted'
  saveCharacter({ name: character.name, image })
  return 'ok'
}
