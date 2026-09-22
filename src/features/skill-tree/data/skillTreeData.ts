import type { Skill, SkillBuild, SkillCategory } from '../types/skillTree'
import { STANDARD_SKILL_COST } from '../config/skillProgression'
import { getSkillTreeAssets } from './skillTreeAssets'

function withSkillAssets(skill: Skill): Skill {
  const assets = getSkillTreeAssets(skill.id)

  if (!assets) {
    return skill
  }

  return {
    ...skill,
    iconImage: assets.icon,
    card:
      assets.cardFront || assets.cardBack
        ? {
            front: assets.cardFront,
            back: assets.cardBack,
          }
        : skill.card,
  }
}

export const skillCategories: SkillCategory[] = [
  { id: 'combat', label: 'COMBAT', icon: 'crossed-swords' },
  { id: 'defense', label: 'DEFENSE', icon: 'shield' },
  { id: 'magic', label: 'MAGIC', icon: 'staff' },
  { id: 'survival', label: 'SURVIVAL', icon: 'claw' },
  { id: 'utility', label: 'UTILITY', icon: 'gear' },
]

export const skillTreeData: SkillBuild[] = [
  {
    race: 'Human',
    className: 'Mage',
    archetype: 'Versatile Arcanist',
    activeCategory: 'magic',
    quote: 'Knowledge shapes destiny.',
    // Provisional frontend presentation metadata only. These groupings are
    // intentionally separated from skill mechanics until official rules exist.
    categorySkillIds: {
      combat: [],
      defense: ['human-mage-arcane-shield'],
      magic: [
        'human-mage-arcane-adaptation',
        'human-mage-quick-study',
        'human-mage-improvised-spell',
        'human-mage-overcharge',
        'human-mage-master-of-none',
      ],
      survival: [],
      utility: ['human-mage-mana-reserve'],
    },
    // Visual-only pending game data: these slots reproduce the approved board
    // topology without inventing new skill names, costs, or rules.
    skillSlots: {
      combat: {},
      defense: {
        root: 'human-mage-arcane-shield',
      },
      magic: {
        root: 'human-mage-arcane-adaptation',
        'left-a': 'human-mage-quick-study',
        'center-a': 'human-mage-improvised-spell',
        'right-a': 'human-mage-overcharge',
        'center-2': 'human-mage-master-of-none',
      },
      survival: {},
      utility: {
        root: 'human-mage-mana-reserve',
      },
    },
    skills: [
      withSkillAssets({
        id: 'human-mage-arcane-adaptation',
        name: 'Arcane Adaptation',
        icon: 'arcane-star',
        cost: STANDARD_SKILL_COST,
        description:
          'At the beginning of combat, choose one bonus: +15% Spell Damage, +15% Mana Regen, or +10% Dodge.',
      }),
      withSkillAssets({
        id: 'human-mage-quick-study',
        name: 'Quick Study',
        icon: 'open-book',
        cost: STANDARD_SKILL_COST,
        description:
          'After using a spell for the first time, the next spell of the same type costs 1 less Mana.',
      }),
      withSkillAssets({
        id: 'human-mage-mana-reserve',
        name: 'Mana Reserve',
        icon: 'mana-drop',
        cost: STANDARD_SKILL_COST,
        description:
          'Can preserve up to 2 unused Mana for the next turn.',
      }),
      withSkillAssets({
        id: 'human-mage-improvised-spell',
        name: 'Improvised Spell',
        icon: 'mirror',
        cost: STANDARD_SKILL_COST,
        description:
          'Copies the effect of the last spell used by an enemy at 70% power.',
      }),
      withSkillAssets({
        id: 'human-mage-arcane-shield',
        name: 'Arcane Shield',
        icon: 'ward',
        cost: STANDARD_SKILL_COST,
        description:
          'Creates a shield equal to 20% of Max HP.',
      }),
      withSkillAssets({
        id: 'human-mage-overcharge',
        name: 'Overcharge',
        icon: 'flame',
        cost: STANDARD_SKILL_COST,
        description:
          'The next spell deals +50% damage but costs +2 Mana.',
      }),
      withSkillAssets({
        id: 'human-mage-master-of-none',
        name: 'Master of None',
        icon: 'crown',
        cost: STANDARD_SKILL_COST,
        description:
          'Gain +5% efficiency with all types of magic, but specializations of +25% or higher cannot be obtained.',
      }),
    ],
    // Presentation-only tree layout. Gameplay prerequisites stay optional
    // skill metadata and are intentionally not inferred from visual branches.
    nodes: [
      { id: 'root', x: 50, y: 3.4, displayState: 'available' },
      { id: 'left-a', x: 29, y: 29, displayState: 'unlocked' },
      { id: 'center-a', x: 50, y: 29, displayState: 'locked' },
      { id: 'right-a', x: 71, y: 29, displayState: 'locked' },
      { id: 'left-1', x: 12, y: 51.5, displayState: 'locked' },
      { id: 'left-2', x: 27.5, y: 51.5, displayState: 'locked' },
      { id: 'center-1', x: 42.5, y: 51.5, displayState: 'locked' },
      { id: 'center-2', x: 57.5, y: 51.5, displayState: 'locked' },
      { id: 'right-1', x: 72.5, y: 51.5, displayState: 'locked' },
      { id: 'right-2', x: 88, y: 51.5, displayState: 'locked' },
      { id: 'left-3', x: 20, y: 75, displayState: 'locked' },
      { id: 'left-4', x: 35, y: 75, displayState: 'locked' },
      { id: 'right-3', x: 70, y: 75, displayState: 'locked' },
      { id: 'right-4', x: 85, y: 75, displayState: 'locked' },
    ],
    connections: [
      { from: 'root', to: 'left-a' },
      { from: 'root', to: 'center-a' },
      { from: 'root', to: 'right-a' },
      { from: 'left-a', to: 'left-1' },
      { from: 'left-a', to: 'left-2' },
      { from: 'left-2', to: 'left-3' },
      { from: 'left-2', to: 'left-4' },
      { from: 'center-a', to: 'center-1' },
      { from: 'center-a', to: 'center-2' },
      { from: 'right-a', to: 'right-1' },
      { from: 'right-a', to: 'right-2' },
      { from: 'right-1', to: 'right-3' },
      { from: 'right-2', to: 'right-4' },
    ],
  },
]
