import type { MarketItem } from '../data/marketItems'

interface InventoryItemCardProps {
  item: MarketItem
  quantity: number
  selected: boolean
  onSelect: (itemId: string) => void
}

/** A selectable full-size card for one owned item stack. */
export function InventoryItemCard({ item, quantity, selected, onSelect }: InventoryItemCardProps) {
  return (
    <button
      className={selected ? 'inventory-item-card is-selected' : 'inventory-item-card'}
      type="button"
      aria-pressed={selected}
      aria-label={selected ? `Return ${item.name} to your items` : `Select ${item.name} to sell`}
      onClick={() => onSelect(item.id)}
    >
      <span className="inventory-card-flip" aria-hidden="true">
        <span className="inventory-card-flip-inner">
          <img className="inventory-card-face" src={item.frontImage} alt="" />
          <img className="inventory-card-face inventory-card-back" src={item.backImage} alt="" />
        </span>
      </span>
      <span className="inventory-item-quantity">×{quantity}</span>
    </button>
  )
}
