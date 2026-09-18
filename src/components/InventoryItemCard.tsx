import type { MarketItem } from '../data/marketItems'

interface InventoryItemCardProps {
  item: MarketItem
  quantity: number
  onSelect: (itemId: string) => void
}

/** Uses the Buy card's layout; each activation reserves one owned copy. */
export function InventoryItemCard({ item, quantity, onSelect }: InventoryItemCardProps) {
  return (
    <button
      className="market-item-card inventory-selection-card"
      type="button"
      aria-label={`Select one ${item.name} to sell, ${quantity} available`}
      onClick={() => onSelect(item.id)}
    >
      <span className="market-card-flip" aria-hidden="true">
        <span className="market-card-flip-inner">
          <img className="market-card-face market-card-front" src={item.frontImage} alt="" />
          <img className="market-card-face market-card-back" src={item.backImage} alt="" />
        </span>
        <span className="inventory-copy-count">×{quantity}</span>
      </span>
    </button>
  )
}
