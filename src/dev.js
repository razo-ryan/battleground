// Dev-only console helpers. Loaded from main.jsx only when import.meta.env.DEV is true,
// so none of this ends up in production builds.
//
//   battledex   the storage layer (getCharacters, findCharacter, saveCharacter, deleteCharacter)
//   battleapi   the API layer (getVerdict, generateImage, mockSettings) plus:
//     battleapi.preview(name)   generates an image, compresses it, and shows both
//                               side by side at the bottom of the page

import * as storage from './lib/storage.js'
import * as api from './api/index.js'
import { compressImage, dataUrlBytes } from './lib/image.js'

const kb = (dataUrl) => `${(dataUrlBytes(dataUrl) / 1024).toFixed(1)}KB`

function figure(src, caption) {
  const fig = document.createElement('figure')
  fig.style.cssText = 'margin:0;text-align:center;font:12px monospace;color:#8a929d'
  const img = new Image()
  img.src = src
  img.style.cssText = 'display:block;width:300px;height:auto;margin-bottom:6px'
  fig.append(img, caption)
  return fig
}

async function preview(name) {
  const result = await api.generateImage(name)
  if (result.status !== 'ok') return result

  const compressed = await compressImage(result.image)
  const row = document.createElement('div')
  row.style.cssText = 'display:flex;flex-wrap:wrap;gap:16px;justify-content:center;padding:16px'
  row.append(
    figure(result.image, `original ${kb(result.image)}`),
    figure(compressed, `compressed 300×420 ${kb(compressed)}`),
  )
  document.body.append(row)
  row.scrollIntoView({ behavior: 'smooth' })
  return { ...result, compressed }
}

window.battledex = storage
window.battleapi = { ...api, compressImage, preview }
