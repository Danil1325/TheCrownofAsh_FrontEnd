import SkillTree from '../../features/skill-tree/SkillTree'

type SkillTreePageProps = {
  onBackToMainMenu: () => void
}

function SkillTreePage({ onBackToMainMenu }: SkillTreePageProps) {
  return (
    <div className="skill-tree-screen">
      <SkillTree onBackToMap={onBackToMainMenu} />
    </div>
  )
}

export default SkillTreePage
