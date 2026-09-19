import type { CSSProperties } from 'react'
import type { AttributeKey } from '../../pages/CharacterCreation/characterCreationData'

type AttributeBarProps = {
  attribute: AttributeKey
  label: string
  value: number
  top: string
}

function AttributeBar({ attribute, label, value, top }: AttributeBarProps) {
  return (
    <div
      className={`attribute-bar attribute-bar--${attribute}`}
      style={{ '--attribute-bar-top': top } as CSSProperties}
      role="progressbar"
      aria-label={`${label} ${value}%`}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="attribute-bar__fill" style={{ width: `${value}%` }} />
    </div>
  )
}

export default AttributeBar
