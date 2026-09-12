import type { Inventory, InventoryEntry } from './inventory'

const marketPlayerStorageKey = 'the-crown-of-ash.market-player.v1'

export interface PersistedMarketPlayer {
  gold: number
  inventory: Inventory
}

function isInventoryEntry(value: unknown): value is InventoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const entry = value as Record<string, unknown>
  return (
    typeof entry.itemId === 'string' &&
    Number.isInteger(entry.quantity) &&
    typeof entry.quantity === 'number' &&
    entry.quantity > 0
  )
}

/** Loads only durable player data; UI state is intentionally not persisted. */
export function loadMarketPlayer(): PersistedMarketPlayer {
  const fallback: PersistedMarketPlayer = { gold: 1250, inventory: [] }

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const storedPlayer = window.localStorage.getItem(marketPlayerStorageKey)

    if (!storedPlayer) {
      return fallback
    }

    const parsedPlayer: unknown = JSON.parse(storedPlayer)

    if (typeof parsedPlayer !== 'object' || parsedPlayer === null) {
      return fallback
    }

    const player = parsedPlayer as Record<string, unknown>
    const gold = typeof player.gold === 'number' && Number.isFinite(player.gold) && player.gold >= 0
      ? player.gold
      : fallback.gold
    const inventory = Array.isArray(player.inventory)
      ? player.inventory.filter(isInventoryEntry)
      : fallback.inventory

    return { gold, inventory }
  } catch {
    return fallback
  }
}

export function saveMarketPlayer(player: PersistedMarketPlayer): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(marketPlayerStorageKey, JSON.stringify(player))
  } catch {
    // Storage can be unavailable in privacy-restricted browser sessions.
  }
}
