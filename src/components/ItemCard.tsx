import type { MarketItem } from '../data/marketItems'

interface ItemCardProps {
  item: MarketItem
  onBuy: (item: MarketItem) => void
}

/** Reusable Market item card; purchase handling is supplied by the parent. */
export function ItemCard({ item, onBuy }: ItemCardProps) {
  return (
    <article className="market-item-card">
      <div className="market-card-flip">
        <div className="market-card-flip-inner">
          <img className="market-card-face market-card-front" src={item.frontImage} alt={item.name} />
          <img className="market-card-face market-card-back" src={item.backImage} alt="" />
        </div>
      </div>
      <button className="buy-button" type="button" onClick={() => onBuy(item)}>
        Buy <span aria-hidden="true">◉</span> {item.buyPrice}
      </button>
    </article>
  )
}
