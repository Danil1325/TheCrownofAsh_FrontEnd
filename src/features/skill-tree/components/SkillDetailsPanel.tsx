import { FantasyIcon } from './FantasyIcon'
import { SkillCardPreview } from './SkillCardPreview'
import type {
  Skill,
  SkillBuild,
  SkillCategory,
} from '../types/skillTree'
import type { SkillUnlockEvaluation } from '../hooks/useSkillProgression'

interface SkillDetailsPanelProps {
  activeCategory: SkillCategory
  build: SkillBuild
  selectedSkill?: Skill
  statusLabel: string
  unlockEvaluation: SkillUnlockEvaluation
  onUnlockSkill: (skill: Skill) => void
}

export function SkillDetailsPanel({
  activeCategory,
  build,
  selectedSkill,
  statusLabel,
  unlockEvaluation,
  onUnlockSkill,
}: SkillDetailsPanelProps) {
  const panelTitle = selectedSkill?.name ?? `${activeCategory.label} Path`
  const panelIcon = selectedSkill?.icon ?? activeCategory.icon
  const description =
    selectedSkill?.description ??
    'No abilities from this path are available for the current build.'
  const pointLabel = selectedSkill?.cost === 1 ? 'Skill Point' : 'Skill Points'

  return (
    <aside
      className={[
        'skill-details',
        selectedSkill ? '' : 'skill-details--empty',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="skill-details__header">
        <div className="skill-details__icon" aria-hidden="true">
          {selectedSkill?.iconImage ? (
            <img
              className="skill-details__icon-image"
              src={selectedSkill.iconImage}
              alt=""
            />
          ) : (
            <FantasyIcon icon={panelIcon} className="fantasy-icon" />
          )}
        </div>

        <div>
          <h2>{panelTitle}</h2>

          <span>
            {build.race} {build.className} / {activeCategory.label}
          </span>
        </div>
      </div>

      <div className="skill-details__description">
        <p>{description}</p>
      </div>

      {selectedSkill && (
        <SkillCardPreview
          card={selectedSkill.card}
          skillName={selectedSkill.name}
        />
      )}

      <div className="skill-details__separator" />

      <section className="skill-details__metadata" aria-label="Skill details">
        <div className="skill-details__property skill-details__property--wide">
          <strong>Archetype</strong>
          <span>{build.archetype}</span>
        </div>

        <div className="skill-details__property-grid">
          <div
            className={[
              'skill-details__property',
              'skill-details__property--status',
              `skill-details__property--${unlockEvaluation.progressionState}`,
            ].join(' ')}
          >
            <strong>Status</strong>
            <span>{statusLabel}</span>
          </div>

          <div className="skill-details__property">
            <strong>Category</strong>
            <span>{activeCategory.label}</span>
          </div>
        </div>

        {selectedSkill && (
          <>
            <div className="skill-details__property skill-details__property--wide skill-details__property--cost">
              <strong>Cost</strong>
              <span>
                {selectedSkill.cost} {pointLabel}
              </span>
            </div>

            {selectedSkill.requiredLevel !== undefined && (
              <div className="skill-details__property skill-details__property--wide">
                <strong>Required Level</strong>
                <span>{selectedSkill.requiredLevel}</span>
              </div>
            )}
          </>
        )}

        {selectedSkill?.prerequisiteSkillId && (
          <div className="skill-details__property skill-details__property--wide">
            <strong>Prerequisite</strong>
            <span>
              {unlockEvaluation.prerequisiteSkillName ??
                selectedSkill.prerequisiteSkillId}
            </span>
          </div>
        )}
      </section>

      {unlockEvaluation.disabledReason && (
        <p className="skill-details__reason" role="status">
          {unlockEvaluation.disabledReason}
        </p>
      )}

      <button
        type="button"
        className="unlock-button"
        disabled={!selectedSkill || !unlockEvaluation.canUnlock}
        title={unlockEvaluation.disabledReason}
        onClick={() => {
          if (selectedSkill) {
            onUnlockSkill(selectedSkill)
          }
        }}
      >
        {unlockEvaluation.buttonLabel}
      </button>

      <p className="skill-details__quote">
        "Skills turn potential into power."
      </p>
    </aside>
  )
}
