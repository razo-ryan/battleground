// Image compression for the BattleDex. Every image is center-cropped to the
// trading card ratio (5:7), resized to 300×420 and encoded as WebP (JPEG where
// WebP encoding isn't supported), so each one is roughly 20–40KB in localStorage.

const TARGET_W = 300
const TARGET_H = 420
const MAX_BYTES = 40 * 1024
const QUALITIES = [0.82, 0.72, 0.62, 0.52] // tried in order until the image fits under MAX_BYTES

// Approximate decoded size of a data URL in bytes.
export function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.floor((base64.length * 3) / 4) - padding
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous' // needed for remote URLs so the canvas can be exported
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image for compression.'))
    img.src = src
  })
}

let webpSupported
function supportsWebp() {
  if (webpSupported === undefined) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    // Browsers that can't encode WebP silently fall back to PNG.
    webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp')
  }
  return webpSupported
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  return { canvas, ctx }
}

// Crops the largest 5:7 area from the center of the image, then scales it down
// in halving steps, which looks noticeably sharper than one big downscale.
function cropAndResize(img) {
  const srcW = img.naturalWidth
  const srcH = img.naturalHeight
  const targetRatio = TARGET_W / TARGET_H

  let cropW = srcW
  let cropH = srcH
  if (srcW / srcH > targetRatio) cropW = Math.round(srcH * targetRatio) // too wide
  else cropH = Math.round(srcW / targetRatio) // too tall
  const cropX = Math.round((srcW - cropW) / 2)
  const cropY = Math.round((srcH - cropH) / 2)

  let w = cropW
  let h = cropH
  let { canvas, ctx } = makeCanvas(w, h)
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, w, h)

  while (w / 2 > TARGET_W) {
    w = Math.round(w / 2)
    h = Math.round(h / 2)
    const next = makeCanvas(w, h)
    next.ctx.drawImage(canvas, 0, 0, w, h)
    ;({ canvas, ctx } = next)
  }

  const final = makeCanvas(TARGET_W, TARGET_H)
  final.ctx.drawImage(canvas, 0, 0, TARGET_W, TARGET_H)
  return final.canvas
}

// Takes an image src (data URL or URL) and returns a compressed data URL.
export async function compressImage(src) {
  const img = await loadImage(src)
  const canvas = cropAndResize(img)
  const type = supportsWebp() ? 'image/webp' : 'image/jpeg'

  let dataUrl
  for (const quality of QUALITIES) {
    dataUrl = canvas.toDataURL(type, quality)
    if (dataUrlBytes(dataUrl) <= MAX_BYTES) break
  }

  if (import.meta.env.DEV) {
    const kb = (bytes) => `${(bytes / 1024).toFixed(1)}KB`
    const before = src.startsWith('data:') ? kb(dataUrlBytes(src)) : 'remote'
    console.info(
      `compressImage: ${img.naturalWidth}×${img.naturalHeight} ${before} → ` +
        `${TARGET_W}×${TARGET_H} ${type.slice(6)} ${kb(dataUrlBytes(dataUrl))}`,
    )
  }

  return dataUrl
}
