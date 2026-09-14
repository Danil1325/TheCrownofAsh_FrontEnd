import { FantasyIcon } from './FantasyIcon'
import type {
  Skill,
  SkillBuild,
  SkillCategory,
} from '../types/skillTree'

const UNKNOWN_RULE_TEXT = 'Not defined yet'

interface SkillDetailsPanelProps {
  activeCategory: SkillCategory
  build: SkillBuild
  selectedSkill?: Skill
  statusLabel: string
}

export function SkillDetailsPanel({
  activeCategory,
  build,
  selectedSkill,
  statusLabel,
}: SkillDetailsPanelProps) {
  const panelTitle = selectedSkill?.name ?? `${activeCategory.label} Path`
  const panelIcon = selectedSkill?.icon ?? activeCategory.icon
  const description =
    selectedSkill?.description ??
    'No abilities from this path are available for the current build.'

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
          <FantasyIcon icon={panelIcon} className="fantasy-icon" />
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

      <div className="skill-details__separator" />

      <div className="skill-details__property">
        <strong>Archetype:</strong>
        <span>{build.archetype}</span>
      </div>

      <div className="skill-details__property">
        <strong>Status:</strong>
        <span>{statusLabel}</span>
      </div>

      <div className="skill-details__property-grid">
        <div className="skill-details__property">
          <strong>Ranks:</strong>
          <span>{UNKNOWN_RULE_TEXT}</span>
        </div>

        <div className="skill-details__property">
          <strong>Cost:</strong>
          <span>{UNKNOWN_RULE_TEXT}</span>
        </div>
      </div>

      <div className="skill-details__property">
        <strong>Prerequisite:</strong>
        <span>{UNKNOWN_RULE_TEXT}</span>
      </div>

      <button type="button" className="unlock-button" disabled>
        UNLOCK
      </button>

      <p className="skill-details__quote">
        "Skills turn potential into power."
      </p>
    </aside>
  )
}
