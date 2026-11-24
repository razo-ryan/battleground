import { useSyncExternalStore } from 'react'
import { getSnapshot, subscribe } from '../lib/storage.js'

// The saved fighters, newest first. Re-renders whenever the BattleDex changes,
// whether from the winner card, the BattleDex grid or another tab.
export function useBattleDex() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
