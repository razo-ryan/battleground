// Failure switch for the mock API, so the error paths can be tested.
//
// Set from the URL:
//   ?failVerdict             every verdict fails
//   ?refuse=all              every image is refused
//   ?refuse=Goku,10 cows     only these fighters' images are refused (case-insensitive)
//
// Or change it live from the browser console in dev:
//   battleapi.mockSettings.failVerdict = true
//   battleapi.mockSettings.refuseImages = ['goku']

function fromUrl() {
  const params = new URLSearchParams(typeof location === 'undefined' ? '' : location.search)
  const refuse = params.get('refuse')
  return {
    failVerdict: params.has('failVerdict'),
    // false = never refuse, true = always refuse, array = refuse only these names
    refuseImages:
      refuse === null ? false
      : refuse === 'all' || refuse === '' ? true
      : refuse.split(',').map((n) => n.trim()).filter(Boolean),
  }
}

export const mockSettings = fromUrl()

export function shouldRefuseImage(name) {
  const { refuseImages } = mockSettings
  if (Array.isArray(refuseImages)) {
    const key = name.trim().toLowerCase()
    return refuseImages.some((n) => n.trim().toLowerCase() === key)
  }
  return Boolean(refuseImages)
}
