// BattleDex storage. This is the ONLY module that touches localStorage, so it can
// be swapped for a real backend in Phase 3 without changing any components.
//
// The BattleDex stores fighters only. Fights and verdicts are never saved.
//
// Character shape:
//   {
//     id:        string   unique id
//     name:      string   display name, trimmed, original casing
//     nameKey:   string   lowercased name, used for case-insensitive lookup
//     image:     string | null   compressed image data URL, or null for placeholder art
//     createdAt: string   ISO date
//     updatedAt: string   ISO date
//   }

import { nameKey, validateName } from './validation.js'

const STORAGE_KEY = 'battleground.battledex.v1'

export class BattleDexFullError extends Error {
  constructor() {
    super('BattleDex is full. Delete some fighters to make room.')
    this.name = 'BattleDexFullError'
  }
}

function isQuotaError(err) {
  return (
    err instanceof DOMException &&
    (err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED' || // Firefox
      err.code === 22)
  )
}

function readAll() {
  let raw
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return [] // storage blocked (e.g. some private modes)
  }
  if (!raw) return []
  try {
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch {
    console.warn('BattleDex data is corrupted; starting empty.')
    return []
  }
}

function writeAll(characters) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters))
  } catch (err) {
    if (isQuotaError(err)) throw new BattleDexFullError()
    throw err
  }
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

// All saved fighters, newest first.
export function getCharacters() {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

// Case-insensitive lookup by name. Returns the character or null.
export function findCharacter(name) {
  const key = nameKey(name)
  return readAll().find((c) => c.nameKey === key) ?? null
}

// Saves a fighter. If one with the same name (case-insensitive) already exists,
// its image is updated instead of adding a duplicate (used for regenerating art).
// Returns the saved character. Throws BattleDexFullError if storage is full.
export function saveCharacter({ name, image = null }) {
  const error = validateName(name)
  if (error) throw new Error(error)

  const characters = readAll()
  const key = nameKey(name)
  const now = new Date().toISOString()
  const index = characters.findIndex((c) => c.nameKey === key)

  let character
  if (index >= 0) {
    character = { ...characters[index], image, updatedAt: now }
    characters[index] = character
  } else {
    character = { id: newId(), name: name.trim(), nameKey: key, image, createdAt: now, updatedAt: now }
    characters.push(character)
  }

  writeAll(characters)
  return character
}

// Deletes a fighter by id. Returns true if something was deleted.
export function deleteCharacter(id) {
  const characters = readAll()
  const remaining = characters.filter((c) => c.id !== id)
  if (remaining.length === characters.length) return false
  writeAll(remaining)
  return true
}
