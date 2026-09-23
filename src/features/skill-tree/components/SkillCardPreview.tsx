import { useState } from 'react'
import type { Skill } from '../types/skillTree'

interface SkillCardPreviewProps {
  card: Skill['card']
  skillName: string
}

export function SkillCardPreview({ card, skillName }: SkillCardPreviewProps) {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front')
  const hasFront = Boolean(card?.front)
  const hasBack = Boolean(card?.back)

  if (!hasFront && !hasBack) {
    return null
  }

  const fallbackSide = hasFront ? 'front' : 'back'
  let visibleSide: 'front' | 'back' = fallbackSide

  if (activeSide === 'front' && hasFront) {
    visibleSide = 'front'
  }

  if (activeSide === 'back' && hasBack) {
    visibleSide = 'back'
  }
  const visibleSource = visibleSide === 'front' ? card?.front : card?.back
  const visibleLabel = visibleSide === 'front' ? 'Front' : 'Back'

  if (!visibleSource) {
    return null
  }

  return (
    <section className="skill-card-preview" aria-label={`${skillName} card`}>
      <div className="skill-card-preview__header">
        <span>Skill Card</span>

        {hasFront && hasBack && (
          <div className="skill-card-preview__toggle" aria-label="Card side">
            <button
              type="button"
              className={
                visibleSide === 'front'
                  ? 'skill-card-preview__toggle-button skill-card-preview__toggle-button--active'
                  : 'skill-card-preview__toggle-button'
              }
              aria-pressed={visibleSide === 'front'}
              onClick={() => setActiveSide('front')}
            >
              Front
            </button>

            <button
              type="button"
              className={
                visibleSide === 'back'
                  ? 'skill-card-preview__toggle-button skill-card-preview__toggle-button--active'
                  : 'skill-card-preview__toggle-button'
              }
              aria-pressed={visibleSide === 'back'}
              onClick={() => setActiveSide('back')}
            >
              Back
            </button>
          </div>
        )}
      </div>

      <img
        className="skill-card-preview__image"
        src={visibleSource}
        alt={`${skillName} skill card ${visibleLabel.toLowerCase()}`}
      />
    </section>
  )
}
