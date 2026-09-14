import type { ItemCategory } from '../data/marketItems'

interface CategoryMenuProps {
  categories: readonly ItemCategory[]
  selectedCategory: ItemCategory
  onSelect: (category: ItemCategory) => void
}

const categoryLabels: Record<ItemCategory, string> = {
  weapons: 'Weapons',
  armor: 'Armor',
  potions: 'Potions',
  artifacts: 'Artifacts',
}

export function CategoryMenu({ categories, selectedCategory, onSelect }: CategoryMenuProps) {
  return (
    <div className="category-menu" role="group" aria-label="Shop categories">
      {categories.map((category) => {
        const isSelected = category === selectedCategory

        return (
          <button
            className={isSelected ? 'category-button is-selected' : 'category-button'}
            type="button"
            key={category}
            aria-pressed={isSelected}
            onClick={() => onSelect(category)}
          >
            {categoryLabels[category]}
          </button>
        )
      })}
    </div>
  )
}
