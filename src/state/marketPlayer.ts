import { addItemToInventory, type Inventory } from './inventory'

export interface MarketTransactionItem {
  id: string
  name: string
  buyPrice: number
  sellPrice: number
}

export type MarketMessage = { tone: 'success' | 'error'; text: string } | null
export type ResolvedInventoryItem = { item: MarketTransactionItem; quantity: number }

export interface PlayerState {
  gold: number
  inventory: Inventory
  marketMessage: MarketMessage
}

export type PlayerAction =
  | { type: 'buy'; item: MarketTransactionItem }
  | { type: 'sell'; items: Inventory }

export function calculateSellValue(items: readonly ResolvedInventoryItem[]): number {
  return items.reduce((total, { item, quantity }) => total + item.sellPrice * quantity, 0)
}

/** Creates atomic buy/sell state transitions against the supplied item catalog. */
export function createPlayerReducer(items: readonly MarketTransactionItem[]) {
  return function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
    if (action.type === 'sell') {
      const quantitiesToSell = action.items.reduce<Map<string, number>>((quantities, entry) => {
        quantities.set(entry.itemId, (quantities.get(entry.itemId) ?? 0) + entry.quantity)
        return quantities
      }, new Map())

      const itemsToSell: ResolvedInventoryItem[] = []

      for (const [itemId, quantity] of quantitiesToSell) {
        const ownedEntry = state.inventory.find((entry) => entry.itemId === itemId)
        const item = items.find((marketItem) => marketItem.id === itemId)

        if (!ownedEntry || !item || quantity <= 0 || quantity > ownedEntry.quantity) {
          return state
        }

        itemsToSell.push({ item, quantity })
      }

      const totalValue = calculateSellValue(itemsToSell)

      if (totalValue === 0) {
        return state
      }

      return {
        gold: state.gold + totalValue,
        inventory: state.inventory.flatMap((entry) => {
          const soldQuantity = quantitiesToSell.get(entry.itemId) ?? 0
          const remainingQuantity = entry.quantity - soldQuantity
          return remainingQuantity > 0 ? [{ ...entry, quantity: remainingQuantity }] : []
        }),
        marketMessage: { tone: 'success', text: `Items sold successfully! +${totalValue} gold` },
      }
    }

    const { item } = action

    if (state.gold < item.buyPrice) {
      return { ...state, marketMessage: { tone: 'error', text: 'Not enough gold' } }
    }

    return {
      gold: state.gold - item.buyPrice,
      inventory: addItemToInventory(state.inventory, item.id),
      marketMessage: { tone: 'success', text: `${item.name} added to your inventory.` },
    }
  }
}
