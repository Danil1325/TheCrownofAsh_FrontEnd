import { FantasyIcon } from './FantasyIcon'
import type {
  SkillCategory,
  SkillCategoryId,
} from '../types/skillTree'

interface CategoryMenuProps {
  categories: SkillCategory[]
  activeCategoryId: SkillCategoryId
  categorySkillCounts: Map<SkillCategoryId, number>
  onSelectCategory: (categoryId: SkillCategoryId) => void
}

export function CategoryMenu({
  categories,
  activeCategoryId,
  categorySkillCounts,
  onSelectCategory,
}: CategoryMenuProps) {
  return (
    <nav className="skill-categories" aria-label="Skill categories">
      {categories.map((category) => {
        const hasSkills = (categorySkillCounts.get(category.id) ?? 0) > 0
        const isActive = category.id === activeCategoryId

        return (
          <button
            key={category.id}
            type="button"
            className={[
              'category-button',
              isActive ? 'category-button--active' : '',
              hasSkills ? '' : 'category-button--awaiting',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={isActive}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelectCategory(category.id)}
          >
            <span className="category-button__icon" aria-hidden="true">
              <FantasyIcon icon={category.icon} className="fantasy-icon" />
            </span>

            <span className="category-button__label">{category.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
