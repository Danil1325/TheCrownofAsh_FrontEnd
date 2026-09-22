import type {
  FantasyIconId,
  Race,
  CharacterClass,
  Skill,
  SkillBuild,
  SkillCategory,
  SkillCategoryId,
  SkillTreeConnection,
  SkillTreeNode,
} from '../types/skillTree'
import { STANDARD_SKILL_COST } from '../config/skillProgression'
import { getSkillTreeAssets } from './skillTreeAssets'

type SkillDefinition = Omit<Skill, 'cost'> & {
  category: SkillCategoryId
}

type SkillBuildDefinition = {
  race: Race
  className: CharacterClass
  archetype: string
  activeCategory: SkillCategoryId
  quote: string
  skills: SkillDefinition[]
  categorySkillIds?: SkillBuild['categorySkillIds']
  skillSlots?: SkillBuild['skillSlots']
}

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

const EMPTY_CATEGORY_SKILL_IDS = skillCategories.reduce(
  (categorySkillIds, category) => {
    categorySkillIds[category.id] = []

    return categorySkillIds
  },
  {} as SkillBuild['categorySkillIds'],
)

const EMPTY_SKILL_SLOTS = skillCategories.reduce((skillSlots, category) => {
  skillSlots[category.id] = {}

  return skillSlots
}, {} as SkillBuild['skillSlots'])

const TEMPLATE_NODES: SkillTreeNode[] = [
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
]

const TEMPLATE_CONNECTIONS: SkillTreeConnection[] = [
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
]

const CATEGORY_SLOT_ORDER: SkillTreeNode['id'][] = [
  'root',
  'left-a',
  'center-a',
  'right-a',
  'left-1',
  'center-2',
  'right-2',
]

function getEmptyCategorySkillIds() {
  return {
    combat: [...EMPTY_CATEGORY_SKILL_IDS.combat],
    defense: [...EMPTY_CATEGORY_SKILL_IDS.defense],
    magic: [...EMPTY_CATEGORY_SKILL_IDS.magic],
    survival: [...EMPTY_CATEGORY_SKILL_IDS.survival],
    utility: [...EMPTY_CATEGORY_SKILL_IDS.utility],
  }
}

function getEmptySkillSlots() {
  return {
    combat: { ...EMPTY_SKILL_SLOTS.combat },
    defense: { ...EMPTY_SKILL_SLOTS.defense },
    magic: { ...EMPTY_SKILL_SLOTS.magic },
    survival: { ...EMPTY_SKILL_SLOTS.survival },
    utility: { ...EMPTY_SKILL_SLOTS.utility },
  }
}

function getCategorySkillIds(skills: SkillDefinition[]) {
  return skills.reduce((categorySkillIds, skill) => {
    categorySkillIds[skill.category].push(skill.id)

    return categorySkillIds
  }, getEmptyCategorySkillIds())
}

function getSkillSlots(categorySkillIds: SkillBuild['categorySkillIds']) {
  return skillCategories.reduce((skillSlots, category) => {
    const slots = CATEGORY_SLOT_ORDER.slice(
      0,
      categorySkillIds[category.id].length,
    )

    skillSlots[category.id] = slots.reduce((categorySlots, slotId, index) => {
      const skillId = categorySkillIds[category.id][index]

      if (skillId) {
        categorySlots[slotId] = skillId
      }

      return categorySlots
    }, {} as Partial<Record<SkillTreeNode['id'], Skill['id']>>)

    return skillSlots
  }, getEmptySkillSlots())
}

function createSkill({
  category: _category,
  ...skill
}: SkillDefinition): Skill {
  return withSkillAssets({
    ...skill,
    cost: STANDARD_SKILL_COST,
  })
}

function createSkillBuild(definition: SkillBuildDefinition): SkillBuild {
  const categorySkillIds =
    definition.categorySkillIds ?? getCategorySkillIds(definition.skills)
  const skillSlots = definition.skillSlots ?? getSkillSlots(categorySkillIds)

  return {
    race: definition.race,
    className: definition.className,
    archetype: definition.archetype,
    activeCategory: definition.activeCategory,
    quote: definition.quote,
    categorySkillIds,
    skillSlots,
    skills: definition.skills.map(createSkill),
    nodes: TEMPLATE_NODES,
    connections: TEMPLATE_CONNECTIONS,
  }
}

function skill(
  id: Skill['id'],
  name: Skill['name'],
  icon: FantasyIconId,
  category: SkillCategoryId,
  description: Skill['description'],
): SkillDefinition {
  return {
    id,
    name,
    icon,
    category,
    description,
  }
}

const skillBuildDefinitions: SkillBuildDefinition[] = [
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
      skill(
        'human-mage-arcane-adaptation',
        'Arcane Adaptation',
        'arcane-star',
        'magic',
        'At the beginning of combat, choose one bonus: +15% Spell Damage, +15% Mana Regen, or +10% Dodge.',
      ),
      skill(
        'human-mage-quick-study',
        'Quick Study',
        'open-book',
        'magic',
        'After using a spell for the first time, the next spell of the same type costs 1 less Mana.',
      ),
      skill(
        'human-mage-mana-reserve',
        'Mana Reserve',
        'mana-drop',
        'utility',
        'Can preserve up to 2 unused Mana for the next turn.',
      ),
      skill(
        'human-mage-improvised-spell',
        'Improvised Spell',
        'mirror',
        'magic',
        'Copies the effect of the last spell used by an enemy at 70% power.',
      ),
      skill(
        'human-mage-arcane-shield',
        'Arcane Shield',
        'ward',
        'defense',
        'Creates a shield equal to 20% of Max HP.',
      ),
      skill(
        'human-mage-overcharge',
        'Overcharge',
        'flame',
        'magic',
        'The next spell deals +50% damage but costs +2 Mana.',
      ),
      skill(
        'human-mage-master-of-none',
        'Master of None',
        'crown',
        'magic',
        'Gain +5% efficiency with all types of magic, but specializations of +25% or higher cannot be obtained.',
      ),
    ],
  },
  {
    race: 'Human',
    className: 'Warrior',
    archetype: 'Battle Tactician',
    activeCategory: 'combat',
    quote: 'A true warrior knows when to strike and when to stand.',
    skills: [
      skill(
        'human-warrior-adaptive-stance',
        'Adaptive Stance',
        'shield',
        'defense',
        'At the beginning of combat, choose Offensive (+15% Damage) or Defensive (+15% Armor).',
      ),
      skill(
        'human-warrior-human-determination',
        'Human Determination',
        'ward',
        'defense',
        'The first debuff received in battle lasts 1 turn less.',
      ),
      skill(
        'human-warrior-tactical-strike',
        'Tactical Strike',
        'crossed-swords',
        'combat',
        'Deal +20% damage when attacking an enemy that has already been attacked by an ally during the same turn.',
      ),
      skill(
        'human-warrior-counterattack',
        'Counterattack',
        'crossed-swords',
        'combat',
        'After blocking an attack, automatically counter-attack for 50% damage.',
      ),
      skill(
        'human-warrior-second-wind',
        'Second Wind',
        'claw',
        'survival',
        'Recover 20% HP once per battle.',
      ),
      skill(
        'human-warrior-battle-experience',
        'Battle Experience',
        'open-book',
        'utility',
        'After every 3 hits dealt, gain +5% Attack, stacking up to 3 times.',
      ),
      skill(
        'human-warrior-last-stand',
        'Last Stand',
        'crown',
        'survival',
        'Below 25% HP, gain +30% Damage and +20% Armor.',
      ),
    ],
  },
  {
    race: 'Human',
    className: 'Bard',
    archetype: 'Jack of All Songs',
    activeCategory: 'utility',
    quote: 'A little of everything makes a greater whole.',
    skills: [
      skill(
        'human-bard-inspiring-tune',
        'Inspiring Tune',
        'staff',
        'utility',
        'An ally gains +15% Damage for 2 turns.',
      ),
      skill(
        'human-bard-quick-melody',
        'Quick Melody',
        'gear',
        'utility',
        'Can use a buff and an attack in the same turn.',
      ),
      skill(
        'human-bard-encore',
        'Encore',
        'mirror',
        'utility',
        'Repeats the last buff used at 50% efficiency.',
      ),
      skill(
        'human-bard-lucky-performance',
        'Lucky Performance',
        'arcane-star',
        'utility',
        'A buff has a 15% chance to have no cooldown.',
      ),
      skill(
        'human-bard-rally-cry',
        'Rally Cry',
        'staff',
        'utility',
        'All allies gain +10% Movement for 1 turn.',
      ),
      skill(
        'human-bard-versatile-performer',
        'Versatile Performer',
        'gear',
        'utility',
        'Can switch melody type between Offensive, Defensive, and Recovery.',
      ),
      skill(
        'human-bard-jack-of-all-trades',
        'Jack of All Trades',
        'crown',
        'utility',
        '+5% to all stats, but cannot exceed the specialization bonuses of other Bards.',
      ),
    ],
  },
  {
    race: 'Human',
    className: 'Healer',
    archetype: 'Field Medic',
    activeCategory: 'survival',
    quote: 'A healer is never far behind and never standing still.',
    skills: [
      skill(
        'human-healer-healing-touch',
        'Healing Touch',
        'ward',
        'survival',
        'Healing on targets below 30% HP is 30% more potent.',
      ),
      skill(
        'human-healer-first-aid',
        'First Aid',
        'gear',
        'survival',
        'Removes Bleeding, Poison, or Burn.',
      ),
      skill(
        'human-healer-emergency-heal',
        'Emergency Heal',
        'ward',
        'survival',
        'Heals an ally for 25% HP.',
      ),
      skill(
        'human-healer-protective-prayer',
        'Protective Prayer',
        'shield',
        'defense',
        'Target takes 20% less damage for 2 turns.',
      ),
      skill(
        'human-healer-battle-medic',
        'Battle Medic',
        'gear',
        'utility',
        'Can heal and move during the same turn.',
      ),
      skill(
        'human-healer-adaptable-healing',
        'Adaptable Healing',
        'ward',
        'survival',
        'Heals more if the target has a debuff, but the base heal is 10% weaker.',
      ),
      skill(
        'human-healer-second-chance',
        'Second Chance',
        'crown',
        'survival',
        'When an ally would die, keeps them at 1 HP and heals them for 15%.',
      ),
    ],
  },
  {
    race: 'Orc',
    className: 'Mage',
    archetype: 'Blood Sorcerer',
    activeCategory: 'magic',
    quote: 'Blood remembers what the mind forgets.',
    skills: [
      skill(
        'orc-mage-blood-magic',
        'Blood Magic',
        'mana-drop',
        'magic',
        'Can pay 10% HP instead of 1 Mana.',
      ),
      skill(
        'orc-mage-brutal-spell',
        'Brutal Spell',
        'flame',
        'magic',
        '+20% Spell Damage, but -10% Spell Accuracy.',
      ),
      skill(
        'orc-mage-rage-casting',
        'Rage Casting',
        'flame',
        'magic',
        'Below 40% HP, spells deal +25% damage.',
      ),
      skill(
        'orc-mage-unstable-magic',
        'Unstable Magic',
        'arcane-star',
        'magic',
        'Spells have a 10% chance to deal 50% additional damage.',
      ),
      skill(
        'orc-mage-forbidden-overload',
        'Forbidden Overload',
        'mana-drop',
        'magic',
        'Sacrifice 25% HP so the next spell costs 0 Mana.',
      ),
      skill(
        'orc-mage-internal-burst',
        'Infernal Burst',
        'flame',
        'magic',
        'Area-of-effect magic attack that applies Burning.',
      ),
      skill(
        'orc-mage-shamans-curse',
        "Shaman's Curse",
        'staff',
        'magic',
        'An enemy deals 20% less damage, but cannot be healed for 2 turns.',
      ),
    ],
  },
  {
    race: 'Orc',
    className: 'Warrior',
    archetype: 'Berserker',
    activeCategory: 'combat',
    quote: 'The closer to death, the truer the strength.',
    skills: [
      skill(
        'orc-warrior-blood-rage',
        'Blood Rage',
        'claw',
        'combat',
        'Gains +20% Damage when below 50% HP.',
      ),
      skill(
        'orc-warrior-brutal-strike',
        'Brutal Strike',
        'crossed-swords',
        'combat',
        'Attacks ignore 20% Armor.',
      ),
      skill(
        'orc-warrior-savage-momentum',
        'Savage Momentum',
        'claw',
        'combat',
        'Gains +20% Movement for 1 turn after a kill.',
      ),
      skill(
        'orc-warrior-battle-strike',
        'Battle Strike',
        'crossed-swords',
        'utility',
        'Removes Fear and Stun from an ally.',
      ),
      skill(
        'orc-warrior-berserkers-frenzy',
        "Berserker's Frenzy",
        'flame',
        'combat',
        'Gain +40% Damage for 2 turns, but cannot use Defense during this time.',
      ),
      skill(
        'orc-warrior-executioner',
        'Executioner',
        'crossed-swords',
        'combat',
        'Gain +30% Damage against enemies below 25% HP.',
      ),
      skill(
        'orc-warrior-pain-is-power',
        'Pain Is Power',
        'claw',
        'combat',
        'Each 10% HP lost grants +3% Attack.',
      ),
    ],
  },
  {
    race: 'Orc',
    className: 'Bard',
    archetype: 'War Chanter',
    activeCategory: 'utility',
    quote: 'The strongest voices rise from pain.',
    skills: [
      skill(
        'orc-bard-war-drum',
        'War Drum',
        'staff',
        'utility',
        'All allies gain +15% Attack.',
      ),
      skill(
        'orc-bard-blood-song',
        'Blood Song',
        'staff',
        'utility',
        'Allies below 50% HP gain +20% Damage.',
      ),
      skill(
        'orc-bard-fury-chorus',
        'Fury Chorus',
        'staff',
        'utility',
        'When an ally kills an enemy, all allies gain +5% Damage for 2 turns.',
      ),
      skill(
        'orc-bard-savage-rhythm',
        'Savage Rhythm',
        'staff',
        'utility',
        'Each consecutive attack by an ally increases Damage by 5%.',
      ),
      skill(
        'orc-bard-last-song',
        'Last Song',
        'crown',
        'utility',
        'If the Bard dies, all allies gain +25% Damage for the next 2 turns.',
      ),
      skill(
        'orc-bard-death-march',
        'Death March',
        'claw',
        'utility',
        '+20% Movement and -10% Defense for the entire team.',
      ),
      skill(
        'orc-bard-intimidating-roar',
        'Intimidating Roar',
        'claw',
        'utility',
        'Nearby enemies suffer -15% Attack for 1 turn.',
      ),
    ],
  },
  {
    race: 'Orc',
    className: 'Healer',
    archetype: 'Blood Shaman',
    activeCategory: 'survival',
    quote: 'Pain given frees another soul.',
    skills: [
      skill(
        'orc-healer-blood-heal',
        'Blood Heal',
        'ward',
        'survival',
        'Heals an ally for 25% of their HP, but the caster loses 10% of their own HP.',
      ),
      skill(
        'orc-healer-blood-ritual',
        'Blood Ritual',
        'ward',
        'survival',
        'Sacrifices 15% HP to remove all debuffs from an ally.',
      ),
      skill(
        'orc-healer-pain-transfer',
        'Pain Transfer',
        'shield',
        'defense',
        'Transfers 30% of the damage taken by an ally to the Orc.',
      ),
      skill(
        'orc-healer-pain-amplification',
        'Pain Amplification',
        'flame',
        'magic',
        '+5% Spell Damage for every 10% HP lost.',
      ),
      skill(
        'orc-healer-savage-recovery',
        'Savage Recovery',
        'claw',
        'survival',
        'When an ally kills an enemy, the Orc recovers 5% HP.',
      ),
      skill(
        'orc-healer-spirit-of-battle',
        'Spirit of Battle',
        'ward',
        'survival',
        "Heals more effectively the lower the target's HP is.",
      ),
      skill(
        'orc-healer-warriors-blessing',
        "Warrior's Blessing",
        'crossed-swords',
        'utility',
        'The target gains +20% Damage for 2 turns.',
      ),
    ],
  },
  {
    race: 'Dwarf',
    className: 'Mage',
    archetype: 'Runic Mage',
    activeCategory: 'magic',
    quote: 'True power is not in motion, but in conviction.',
    skills: [
      skill(
        'dwarf-mage-heavy-casting',
        'Heavy Casting',
        'staff',
        'magic',
        'Spells are 15% more powerful, but the Dwarf cannot move during the same turn.',
      ),
      skill(
        'dwarf-mage-mana-forge',
        'Mana Forge',
        'mana-drop',
        'magic',
        'Regenerates 1 Mana every 3 turns.',
      ),
      skill(
        'dwarf-mage-rune-of-power',
        'Rune of Power',
        'flame',
        'magic',
        'The next spell deals +30% damage.',
      ),
      skill(
        'dwarf-mage-stone-barrier',
        'Stone Barrier',
        'ward',
        'defense',
        'Creates a shield equal to 25% of Max HP.',
      ),
      skill(
        'dwarf-mage-ancient-rune',
        'Ancient Rune',
        'arcane-star',
        'magic',
        'Places a rune on the battlefield that explodes when an enemy steps on it.',
      ),
      skill(
        'dwarf-mage-war-forge',
        'War Forge',
        'shield',
        'defense',
        'An ally gains +25% Armor for 2 turns.',
      ),
      skill(
        'dwarf-mage-runic-fortress',
        'Runic Fortress',
        'ward',
        'defense',
        '+30% Armor and +30% Magic Resistance for 2 turns, but Movement becomes 0.',
      ),
    ],
  },
  {
    race: 'Dwarf',
    className: 'Warrior',
    archetype: 'Iron Guardian',
    activeCategory: 'defense',
    quote: 'A Dwarf endures. That is victory.',
    skills: [
      skill(
        'dwarf-warrior-dwarven-constitution',
        'Dwarven Constitution',
        'claw',
        'survival',
        '+15% Max HP.',
      ),
      skill(
        'dwarf-warrior-mountain-stance',
        'Mountain Stance',
        'shield',
        'defense',
        'Cannot be pushed or pulled.',
      ),
      skill(
        'dwarf-warrior-shield-bash',
        'Shield Bash',
        'shield',
        'combat',
        'An attack with a chance to inflict Stun.',
      ),
      skill(
        'dwarf-warrior-iron-wall',
        'Iron Wall',
        'shield',
        'defense',
        'Gain +20% Defense if the Dwarf did not move during the turn.',
      ),
      skill(
        'dwarf-warrior-runic-armor',
        'Runic Armor',
        'ward',
        'defense',
        '+20% Magic Resistance.',
      ),
      skill(
        'dwarf-warrior-fortress',
        'Fortress',
        'shield',
        'defense',
        'Reduces the next incoming attack by 40%.',
      ),
      skill(
        'dwarf-warrior-unbreakable',
        'Unbreakable',
        'crown',
        'survival',
        'The first time it reaches 0 HP, it remains at 1 HP.',
      ),
    ],
  },
  {
    race: 'Dwarf',
    className: 'Bard',
    archetype: 'Battle Smith',
    activeCategory: 'utility',
    quote: 'Same rhythm, stronger tomorrow.',
    skills: [
      skill(
        'dwarf-bard-anvil-beat',
        'Anvil Beat',
        'staff',
        'utility',
        'Nearby enemies suffer -10% Movement.',
      ),
      skill(
        'dwarf-bard-hammer-rhythm',
        'Hammer Rhythm',
        'shield',
        'defense',
        'Allies gain +10% Armor.',
      ),
      skill(
        'dwarf-bard-forge-song',
        'Forge Song',
        'shield',
        'defense',
        "Repairs 15% of an ally's Armor.",
      ),
      skill(
        'dwarf-bard-drums-of-the-mountain',
        'Drums of the Mountain',
        'staff',
        'utility',
        'Allies cannot be pushed or slowed for 1 turn.',
      ),
      skill(
        'dwarf-bard-iron-chorus',
        'Iron Chorus',
        'staff',
        'utility',
        'Each ally gains +5% Damage and +5% Armor.',
      ),
      skill(
        'dwarf-bard-unyielding-melody',
        'Unyielding Melody',
        'ward',
        'defense',
        'When an ally takes fatal damage, they remain at 1 HP, but the Bard loses 20% HP.',
      ),
      skill(
        'dwarf-bard-living-fortress',
        'Living Fortress',
        'shield',
        'defense',
        'The Dwarf cannot heal during this turn, but all nearby allies gain +25% Armor for 2 turns.',
      ),
    ],
  },
  {
    race: 'Dwarf',
    className: 'Healer',
    archetype: 'Runic Priest',
    activeCategory: 'survival',
    quote: 'Stone mends what time breaks.',
    skills: [
      skill(
        'dwarf-healer-stone-heal',
        'Stone Heal',
        'ward',
        'survival',
        'Heals 20% HP and grants +10% Armor.',
      ),
      skill(
        'dwarf-healer-healing-ground',
        'Healing Ground',
        'ward',
        'survival',
        'Creates an area that heals 5% HP/turn.',
      ),
      skill(
        'dwarf-healer-mountain-blessing',
        'Mountain Blessing',
        'shield',
        'defense',
        'The ally cannot be Stunned for 2 turns.',
      ),
      skill(
        'dwarf-healer-rune-of-protection',
        'Rune of Protection',
        'ward',
        'defense',
        'The target receives a shield.',
      ),
      skill(
        'dwarf-healer-ancient-protection',
        'Ancient Protection',
        'shield',
        'defense',
        'Reduces the next incoming hit by 30%.',
      ),
      skill(
        'dwarf-healer-purifying-rune',
        'Purifying Rune',
        'gear',
        'survival',
        'Removes Poison, Bleed, and Curse.',
      ),
      skill(
        'dwarf-healer-stone-skin',
        'Stone Skin',
        'shield',
        'defense',
        '+20% Armor.',
      ),
    ],
  },
  {
    race: 'Elf',
    className: 'Mage',
    archetype: 'Arcane Elven',
    activeCategory: 'magic',
    quote: 'Magic finds its mark in the hands of a focused mind.',
    skills: [
      skill(
        'elf-mage-arcane-precision',
        'Arcane Precision',
        'arcane-star',
        'magic',
        '+15% Spell Accuracy.',
      ),
      skill(
        'elf-mage-blink',
        'Blink',
        'mirror',
        'utility',
        'Teleport a short distance.',
      ),
      skill(
        'elf-mage-fey-focus',
        'Fey Focus',
        'mana-drop',
        'magic',
        'If the unit has not moved, the next spell costs 1 less Mana.',
      ),
      skill(
        'elf-mage-fey-illusion',
        'Fey Illusion',
        'mirror',
        'magic',
        'Create a clone that draws enemy attacks.',
      ),
      skill(
        'elf-mage-mana-bloom',
        'Mana Bloom',
        'mana-drop',
        'magic',
        'Recover 1 Mana after a critical spell hit.',
      ),
      skill(
        'elf-mage-moonlight-spell',
        'Moonlight Spell',
        'staff',
        'magic',
        'The next spell has +30% Range.',
      ),
      skill(
        'elf-mage-arcane-perfection',
        'Arcane Perfection',
        'crown',
        'magic',
        'The next spell deals +50% Damage, but the Elf cannot use magic on the following turn.',
      ),
    ],
  },
  {
    race: 'Elf',
    className: 'Warrior',
    archetype: 'Blade Dancer',
    activeCategory: 'combat',
    quote: 'The first strike is the one they did not see coming.',
    skills: [
      skill(
        'elf-warrior-elven-grace',
        'Elven Grace',
        'claw',
        'defense',
        '+15% Dodge.',
      ),
      skill(
        'elf-warrior-swift-blade',
        'Swift Blade',
        'crossed-swords',
        'combat',
        '+15% Attack Speed.',
      ),
      skill(
        'elf-warrior-dance-of-blades',
        'Dance of Blades',
        'claw',
        'defense',
        '+30% Dodge for 1 turn.',
      ),
      skill(
        'elf-warrior-glass-blade',
        'Glass Blade',
        'crossed-swords',
        'combat',
        '+25% Damage, but -15% Armor.',
      ),
      skill(
        'elf-warrior-perfect-counter',
        'Perfect Counter',
        'crossed-swords',
        'combat',
        'If an attack is successfully dodged, can counterattack for 75% Damage.',
      ),
      skill(
        'elf-warrior-whirling-blades',
        'Whirling Blades',
        'crossed-swords',
        'combat',
        'Attacks all adjacent enemies.',
      ),
      skill(
        'elf-warrior-graceful-step',
        'Graceful Step',
        'claw',
        'combat',
        'After dodging an attack, gains +20% Damage for the next attack.',
      ),
    ],
  },
  {
    race: 'Elf',
    className: 'Bard',
    archetype: 'Fey Minstrel',
    activeCategory: 'utility',
    quote: 'Many melodies, one song. Together, we go farther.',
    skills: [
      skill(
        'elf-bard-charming-tune',
        'Charming Tune',
        'staff',
        'utility',
        'Can prevent an enemy from attacking for 1 turn.',
      ),
      skill(
        'elf-bard-fey-melody',
        'Fey Melody',
        'staff',
        'utility',
        'Allies gain +10% Dodge.',
      ),
      skill(
        'elf-bard-song-of-speed',
        'Song of Speed',
        'claw',
        'utility',
        '+20% Movement for the entire team.',
      ),
      skill(
        'elf-bard-moonlight-ballad',
        'Moonlit Ballad',
        'ward',
        'survival',
        'Regenerates 5% HP/turn for 3 turns.',
      ),
      skill(
        'elf-bard-fey-illusion',
        'Fey Illusion',
        'mirror',
        'utility',
        'Creates an illusory copy of an ally for 1 turn.',
      ),
      skill(
        'elf-bard-elven-harmony',
        'Elven Harmony',
        'staff',
        'utility',
        'When two different buffs are active on the same ally, they gain +10% effectiveness.',
      ),
      skill(
        'elf-bard-eternal-performance',
        'Eternal Performance',
        'crown',
        'utility',
        'The last buff used does not expire at the end of the turn, but the Bard cannot attack during that turn.',
      ),
    ],
  },
  {
    race: 'Elf',
    className: 'Healer',
    archetype: "Nature's Grace",
    activeCategory: 'survival',
    quote: 'From the last spark, new life can grow.',
    skills: [
      skill(
        'elf-healer-healing-light',
        'Healing Light',
        'ward',
        'survival',
        'Heals 25% HP.',
      ),
      skill(
        'elf-healer-life-bloom',
        'Life Bloom',
        'ward',
        'survival',
        'If the target is below 25% HP, the heal is doubled.',
      ),
      skill(
        'elf-healer-moon-heal',
        'Moon Heal',
        'ward',
        'survival',
        'Healing is 30% stronger at night.',
      ),
      skill(
        'elf-healer-natures-touch',
        "Nature's Touch",
        'ward',
        'survival',
        'Heals 10% HP over 3 turns.',
      ),
      skill(
        'elf-healer-purifying-leaves',
        'Purifying Leaves',
        'gear',
        'survival',
        'Removes Poison and Bleeding.',
      ),
      skill(
        'elf-healer-rebirth-of-nature',
        'Rebirth of Nature',
        'crown',
        'survival',
        'Revives an ally with 20% HP, but the Elf loses 30% of their own HP.',
      ),
      skill(
        'elf-healer-fey-protection',
        'Fey Protection',
        'claw',
        'defense',
        '+20% Dodge for the healed target.',
      ),
    ],
  },
]

export const skillTreeData: SkillBuild[] = skillBuildDefinitions.map(
  createSkillBuild,
)
