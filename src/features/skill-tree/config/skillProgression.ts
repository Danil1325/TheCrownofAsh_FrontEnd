import type {
  ActiveSkillTreeCharacter,
  SkillBuild,
} from '../types/skillTree'

export const SKILL_POINTS_PER_LEVEL_GAINED = 1
export const LEVEL_WITHOUT_GAINED_SKILL_POINTS = 1
export const STANDARD_SKILL_COST = 1
export const TERMINAL_SKILL_COST = 2

// TODO: Use this only until active character/backend progression state is available.
export const SKILL_TREE_FALLBACK_ACTIVE_CHARACTER: ActiveSkillTreeCharacter = {
  race: 'Human',
  className: 'Mage',
  level: 3,
}

export function getTotalSkillPointsForLevel(level: number) {
  return (
    Math.max(0, level - LEVEL_WITHOUT_GAINED_SKILL_POINTS) *
    SKILL_POINTS_PER_LEVEL_GAINED
  )
}

export function getSkillBuildForCharacter(
  builds: SkillBuild[],
  character: ActiveSkillTreeCharacter,
) {
  return builds.find((build) => {
    return (
      build.race === character.race &&
      build.className === character.className
    )
  })
}
