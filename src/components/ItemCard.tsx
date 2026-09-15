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
      <div className="market-card-flip">
        <div className="market-card-flip-inner">
          <div className="market-card-face market-card-front">
            <img src={item.image} alt={item.name} />
          </div>

          <div className="market-card-face market-card-back">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <dl className="market-card-details">
              <div>
                <dt>Price</dt>
                <dd><span aria-hidden="true">◉</span> {item.buyPrice} gold</dd>
              </div>
              {item.quantity > 0 && (
                <div>
                  <dt>Stock</dt>
                  <dd>{item.quantity}</dd>
                </div>
              )}
              {ownedQuantity > 0 && (
                <div>
                  <dt>Owned</dt>
                  <dd>{ownedQuantity}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
      <button className="buy-button" type="button" onClick={() => onBuy(item)}>Buy</button>
    </article>
  )
}
