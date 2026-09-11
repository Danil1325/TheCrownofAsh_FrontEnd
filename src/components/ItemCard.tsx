import type { MarketItem } from '../data/marketItems'

interface ItemCardProps {
  item: MarketItem
  ownedQuantity: number
  onBuy: (item: MarketItem) => void
}

/** Reusable Market item card; purchase handling is supplied by the parent. */
export function ItemCard({ item, ownedQuantity, onBuy }: ItemCardProps) {
  return (
    <article className="market-item-card">
      <div className="item-image-frame">
        <img src={item.image} alt={item.name} />
      </div>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="item-card-footer">
        <span className="item-price"><b aria-hidden="true">◉</b> {item.buyPrice} gold</span>
        {item.quantity > 0 && <span className="item-stock">{item.quantity} in stock</span>}
        {ownedQuantity > 0 && <span className="item-owned">Owned: {ownedQuantity}</span>}
      </div>
      <button className="buy-button" type="button" onClick={() => onBuy(item)}>Buy</button>
    </article>
  )
}
