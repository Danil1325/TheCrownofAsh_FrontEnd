import type { MarketItem } from '../data/marketItems'

interface InventoryItemCardProps {
  item: MarketItem
  quantity: number
  selected: boolean
  onSelect: (itemId: string) => void
}

/** A selectable, presentational card for one owned item stack. */
export function InventoryItemCard({ item, quantity, selected, onSelect }: InventoryItemCardProps) {
  return (
    <button
      className={selected ? 'inventory-item-card is-selected' : 'inventory-item-card'}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(item.id)}
    >
      <span className="inventory-item-art">
        <img src={item.frontImage} alt="" />
      </span>
      <span className="inventory-item-name">{item.name}</span>
      <span className="inventory-item-quantity">×{quantity}</span>
    </button>
  )
}
