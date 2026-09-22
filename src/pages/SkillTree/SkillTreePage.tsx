import SkillTree from '../../features/skill-tree/SkillTree'
import type { ActiveSkillTreeCharacterInput } from '../../features/skill-tree/types/skillTree'

type SkillTreePageProps = {
  activeCharacter?: ActiveSkillTreeCharacterInput
  onBackToMainMenu: () => void
}

function SkillTreePage({
  activeCharacter,
  onBackToMainMenu,
}: SkillTreePageProps) {
  return (
    <div className="skill-tree-screen">
      <SkillTree
        activeCharacter={activeCharacter}
        onBackToMap={onBackToMainMenu}
      />
    </div>
  )
}

export default SkillTreePage
