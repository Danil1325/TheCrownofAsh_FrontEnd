import { FantasyIcon } from './FantasyIcon'
import type {
  Skill,
  SkillDisplayState,
  SkillTreeNode as SkillTreeNodeData,
} from '../types/skillTree'

interface SkillNodeProps {
  skill?: Skill
  node: SkillTreeNodeData
  progressionState: SkillDisplayState
  isSelected: boolean
  isRoot?: boolean
  onSelect: (skillId: Skill['id']) => void
}

export function SkillNode({
  skill,
  node,
  progressionState,
  isSelected,
  isRoot = false,
  onSelect,
}: SkillNodeProps) {
  const isPlaceholder = !skill

  return (
    <button
      type="button"
      className={[
        'tree-node',
        `tree-node--${progressionState}`,
        isSelected ? 'tree-node--selected' : '',
        isRoot ? 'tree-node--root' : '',
        isPlaceholder ? 'tree-node--placeholder' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
      aria-label={
        skill
          ? `${skill.name}: ${skill.description}`
          : 'Locked visual skill slot. Ability data pending.'
      }
      aria-pressed={skill ? isSelected : undefined}
      disabled={isPlaceholder}
      onClick={skill ? () => onSelect(skill.id) : undefined}
    >
      <span className="tree-node__circle">
        <span className="tree-node__rim" aria-hidden="true" />
        <span className="tree-node__bezel" aria-hidden="true" />
        <span className="tree-node__texture" aria-hidden="true" />
        <span className="tree-node__engraving" aria-hidden="true" />
        <span className="tree-node__sigils" aria-hidden="true" />
        <span className="tree-node__notch" aria-hidden="true" />
        <FantasyIcon
          icon={skill?.icon ?? 'lock'}
          className="fantasy-icon tree-node__icon"
          variant="node"
        />
        <span className="tree-node__glint" aria-hidden="true" />
      </span>

      <span className="tree-node__label">
        <span>{skill?.name}</span>
      </span>
    </button>
  )
}
