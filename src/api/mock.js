// Phase 1 mock API. Same signatures and result shapes as the real /api/* functions
// will have, with realistic delays and a failure switch (see mockSettings.js).

import { VerdictError } from './errors.js'
import { mockSettings, shouldRefuseImage } from './mockSettings.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const between = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

/* --------------------------------------------------------------------------
   Verdict
   -------------------------------------------------------------------------- */

// {W} = winner, {L} = loser. Every template is exactly one sentence, so
// one opener + 0–2 middles + one closer = 2–4 sentences. No possessives on
// names, since "10 cows's" reads badly.
const OPENERS = [
  'Ladies and gentlemen, {W} takes this one, and it was never really close!',
  'What a clash, and {W} walks away with the win!',
  '{W} enters the ring looking calm and leaves it looking victorious.',
  'The crowd gasped, but the judges saw it coming: {W} wins.',
  'Ding ding ding, this bout belongs to {W}!',
]

const MIDDLES = [
  '{L} brought plenty of heart, but heart alone does not cover a gap that big in raw power.',
  '{W} is simply too quick, so {L} spends most of the fight swinging at empty air.',
  '{L} had a strong opening, then ran straight into a wall of pure stamina.',
  'Every trick {L} tried, {W} had already seen coming and had an answer for.',
  '{W} soaks up the best shots from {L} like they are a light breeze.',
  '{L} looked dangerous on paper, but {W} simply has more ways to win.',
]

const CLOSERS = [
  'Better luck next time, {L}, and maybe bring a bigger plan.',
  'A well-earned victory for {W}, and a story {L} will not be telling at parties.',
  '{W} takes the belt, and {L} takes a long nap.',
  'Sometimes the bigger toolbox wins, and today that toolbox belongs to {W}.',
  'Final score: {W}, everything; {L}, a valiant effort.',
]

function fill(template, winner, loser) {
  return template.replaceAll('{W}', winner).replaceAll('{L}', loser)
}

function mockReasoning(winner, loser) {
  const middles = [...MIDDLES].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3))
  return [pick(OPENERS), ...middles, pick(CLOSERS)].map((t) => fill(t, winner, loser)).join(' ')
}

// Returns { winner, reasoning }. `winner` is exactly fighterA or fighterB.
// Throws VerdictError on failure.
export async function getVerdict(fighterA, fighterB) {
  await wait(between(1000, 2000))
  if (mockSettings.failVerdict) throw new VerdictError()

  const aWins = Math.random() < 0.5
  const winner = aWins ? fighterA : fighterB
  const loser = aWins ? fighterB : fighterA
  return { winner, reasoning: mockReasoning(winner, loser) }
}

/* --------------------------------------------------------------------------
   Image
   -------------------------------------------------------------------------- */

// Same size as a typical AI portrait image (2:3), so Stage 6 has to crop it to 5:7.
const IMAGE_W = 1024
const IMAGE_H = 1536

function hashString(str) {
  let h = 2166136261
  for (const ch of str) {
    h ^= ch.codePointAt(0)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Small seeded random generator, so each image's pattern is reproducible from its seed.
function seededRandom(seed) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function initialsFor(name) {
  const words = name.trim().split(/\s+/)
  const letters = words.length > 1 ? words.slice(0, 2).map((w) => [...w][0]) : [...words[0]].slice(0, 2)
  return letters.join('').toUpperCase()
}

// Draws a trading card style portrait. Colours come from the name (so a fighter
// keeps its colours); the pattern varies on each call, like a fresh generation.
function drawCardArt(name) {
  const canvas = document.createElement('canvas')
  canvas.width = IMAGE_W
  canvas.height = IMAGE_H
  const ctx = canvas.getContext('2d')

  const hue = hashString(name.toLowerCase()) % 360
  const rand = seededRandom(hashString(name) ^ Math.floor(Math.random() * 2 ** 31))
  const cx = IMAGE_W / 2
  const cy = IMAGE_H * 0.45

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, IMAGE_W, IMAGE_H)
  bg.addColorStop(0, `hsl(${hue} 70% 45%)`)
  bg.addColorStop(1, `hsl(${(hue + 50) % 360} 65% 18%)`)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, IMAGE_W, IMAGE_H)

  // Starburst rays
  const rays = 18 + Math.floor(rand() * 14)
  const spin = rand() * Math.PI
  ctx.fillStyle = `hsl(${hue} 90% 75% / 0.12)`
  for (let i = 0; i < rays; i += 2) {
    const a1 = spin + (i / rays) * Math.PI * 2
    const a2 = spin + ((i + 1) / rays) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a1) * 2000, cy + Math.sin(a1) * 2000)
    ctx.lineTo(cx + Math.cos(a2) * 2000, cy + Math.sin(a2) * 2000)
    ctx.closePath()
    ctx.fill()
  }

  // Energy orbs
  for (let i = 0; i < 26; i++) {
    const r = 6 + rand() * 40
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
    glow.addColorStop(0, `hsl(${(hue + rand() * 60) % 360} 100% 85% / 0.9)`)
    glow.addColorStop(1, `hsl(${hue} 100% 70% / 0)`)
    ctx.save()
    ctx.translate(rand() * IMAGE_W, rand() * IMAGE_H)
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Emblem: glowing ring with the fighter's initials
  const radius = IMAGE_W * 0.3
  ctx.save()
  ctx.shadowColor = `hsl(${hue} 100% 70%)`
  ctx.shadowBlur = 80
  ctx.fillStyle = `hsl(${hue} 60% 12% / 0.85)`
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.lineWidth = 18
  ctx.strokeStyle = `hsl(${(hue + 30) % 360} 90% 70%)`
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.stroke()

  const initials = initialsFor(name)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${initials.length > 1 ? 260 : 340}px "Space Grotesk", system-ui, sans-serif`
  ctx.shadowColor = 'rgb(0 0 0 / 0.5)'
  ctx.shadowBlur = 24
  ctx.fillText(initials, cx, cy + 10)
  ctx.shadowBlur = 0

  // Vignette
  const vignette = ctx.createRadialGradient(cx, cy, IMAGE_W * 0.4, cx, cy, IMAGE_H * 0.8)
  vignette.addColorStop(0, 'rgb(0 0 0 / 0)')
  vignette.addColorStop(1, 'rgb(0 0 0 / 0.6)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, IMAGE_W, IMAGE_H)

  return canvas.toDataURL('image/png')
}

// Returns { status: 'ok', image } with a data URL, or { status: 'refused' }
// when the image API declines (the UI then shows placeholder art).
export async function generateImage(name) {
  await wait(between(3000, 5000))
  if (shouldRefuseImage(name)) return { status: 'refused' }
  return { status: 'ok', image: drawCardArt(name) }
}
