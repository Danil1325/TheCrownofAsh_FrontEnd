import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { MarketItem } from '../data/marketItems'

interface CardPreviewProps {
  item: MarketItem
  width: number
  onClose: () => void
}

export function CardPreview({ item, width, onClose }: CardPreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      className="card-preview"
      style={{ width: width * 3 }}
      aria-label={`${item.name} — card details`}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={onClose}
    >
      <button className="card-preview-dismiss" type="button" aria-label="Close card preview" autoFocus>
        <img src={item.backImage} alt={`${item.name} — reverse side`} />
      </button>
    </dialog>,
    document.body,
  )
}
