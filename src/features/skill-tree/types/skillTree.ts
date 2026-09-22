export type Race = 'Human' | 'Orc' | 'Dwarf' | 'Elf'

export type CharacterClass = 'Mage' | 'Warrior' | 'Bard' | 'Healer'

export type SkillCategoryId =
  | 'combat'
  | 'defense'
  | 'magic'
  | 'survival'
  | 'utility'

export type SkillDisplayState = 'unlocked' | 'available' | 'locked'

export type RenderedSkillState = SkillDisplayState | 'selected'

export type FantasyIconId =
  | 'arcane-star'
  | 'claw'
  | 'crown'
  | 'crossed-swords'
  | 'flame'
  | 'gear'
  | 'lock'
  | 'mana-drop'
  | 'mirror'
  | 'open-book'
  | 'shield'
  | 'staff'
  | 'ward'

export interface SkillCategory {
  id: SkillCategoryId
  label: string
  icon: FantasyIconId
}

export interface Skill {
  id: string
  name: string
  description: string
  icon: FantasyIconId
  iconImage?: string
  cost: number
  card?: SkillCardAssets
  requiredLevel?: number
  prerequisiteSkillId?: Skill['id']
}

export interface SkillCardAssets {
  front?: string
  back?: string
}

export interface SkillTreeNode {
  id: string
  x: number
  y: number
  displayState: SkillDisplayState
}

export interface SkillTreeConnection {
  from: SkillTreeNode['id']
  to: SkillTreeNode['id']
}

export interface SkillBuild {
  race: Race
  className: CharacterClass
  archetype: string
  activeCategory: SkillCategoryId
  quote: string
  categorySkillIds: Record<SkillCategoryId, Skill['id'][]>
  skillSlots: Record<SkillCategoryId, Partial<Record<SkillTreeNode['id'], Skill['id']>>>
  skills: Skill[]
  nodes: SkillTreeNode[]
  connections: SkillTreeConnection[]
}

export interface ActiveSkillTreeCharacter {
  race: Race
  className: CharacterClass
  level: number
}

export type ActiveSkillTreeCharacterInput = Pick<
  ActiveSkillTreeCharacter,
  'race' | 'className'
> &
  Partial<Pick<ActiveSkillTreeCharacter, 'level'>>
