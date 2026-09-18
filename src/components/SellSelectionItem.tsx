import type { MarketItem } from '../data/marketItems'
import coinIcon from '../assets/Icons/Coin.png'

interface SellSelectionItemProps {
  item: MarketItem
  quantity: number
  onRemove: (itemId: string) => void
}

export function SellSelectionItem({ item, quantity, onRemove }: SellSelectionItemProps) {
  return (
    <button
      className="sell-selection-item"
      type="button"
      aria-label={`Return one ${item.name} to your items, selected quantity ${quantity}, sell value ${item.sellPrice * quantity} gold`}
      onClick={() => onRemove(item.id)}
    >
      <img className="sell-selection-thumbnail" src={item.frontImage} alt="" />
      <span className="sell-selection-details">
        <span className="sell-selection-name">{item.name}</span>
        <span className="sell-selection-value">×{quantity} · <img className="buy-coin-icon" src={coinIcon} alt="" /> {item.sellPrice * quantity}</span>
      </span>
    </button>
  )
}
