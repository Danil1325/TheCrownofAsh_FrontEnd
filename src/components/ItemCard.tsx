import type { MarketItem } from '../data/marketItems'
import { useState } from 'react'
import { CardPreview } from './CardPreview'
import coinIcon from '../assets/Icons/Coin.png'

interface ItemCardProps {
  item: MarketItem
  onBuy: (item: MarketItem) => void
}

/** Reusable Market item card; purchase handling is supplied by the parent. */
export function ItemCard({ item, onBuy }: ItemCardProps) {
  const [previewWidth, setPreviewWidth] = useState<number | null>(null)
  return (
    <article className="market-item-card">
      <button
        className="market-card-flip market-card-preview-trigger"
        type="button"
        aria-label={`View ${item.name} card details`}
        aria-haspopup="dialog"
        onClick={(event) => setPreviewWidth(event.currentTarget.getBoundingClientRect().width)}
      >
        <span className="market-card-flip-inner">
          <img className="market-card-face market-card-front" src={item.frontImage} alt={item.name} />
          <img className="market-card-face market-card-back" src={item.backImage} alt="" />
        </span>
      </button>
      <button className="buy-button" type="button" onClick={() => onBuy(item)}>
        Buy <img className="buy-coin-icon" src={coinIcon} alt="" /> {item.buyPrice}
      </button>
      {previewWidth !== null && (
        <CardPreview item={item} width={previewWidth} onClose={() => setPreviewWidth(null)} />
      )}
    </article>
  )
}
