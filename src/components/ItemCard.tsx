import type { MarketItem } from '../data/marketItems'

interface ItemCardProps {
  item: MarketItem
}

/** Presentational Market item card. Purchase actions are intentionally not wired yet. */
export function ItemCard({ item }: ItemCardProps) {
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
      </div>
      <button className="buy-button" type="button">Buy</button>
    </article>
  )
}
