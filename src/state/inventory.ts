export interface InventoryEntry {
  itemId: string
  quantity: number
}

export type Inventory = readonly InventoryEntry[]

/** Adds one item by ID, retaining a compact inventory instead of item copies. */
export function addItemToInventory(inventory: Inventory, itemId: string): InventoryEntry[] {
  const existingEntry = inventory.find((entry) => entry.itemId === itemId)

  if (!existingEntry) {
    return [...inventory, { itemId, quantity: 1 }]
  }

  return inventory.map((entry) =>
    entry.itemId === itemId ? { ...entry, quantity: entry.quantity + 1 } : entry,
  )
}

export function getInventoryQuantity(inventory: Inventory, itemId: string): number {
  return inventory.find((entry) => entry.itemId === itemId)?.quantity ?? 0
}
