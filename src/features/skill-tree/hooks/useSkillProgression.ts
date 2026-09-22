import { useCallback, useMemo, useState } from 'react'
import { getTotalSkillPointsForLevel } from '../config/skillProgression'
import type {
  ActiveSkillTreeCharacter,
  Skill,
  SkillBuild,
  SkillDisplayState,
} from '../types/skillTree'

export interface SkillUnlockEvaluation {
  progressionState: SkillDisplayState
  canUnlock: boolean
  buttonLabel: string
  disabledReason?: string
  prerequisiteSkillName?: string
}

interface SkillUnlockEvaluationParams {
  availableSkillPoints: number
  characterLevel: number
  skillById: Map<Skill['id'], Skill>
  unlockedSkillIds: Set<Skill['id']>
}

function getSkillPointLabel(points: number) {
  return points === 1 ? 'Skill Point' : 'Skill Points'
}

function getSpentSkillPoints(
  unlockedSkillIds: Set<Skill['id']>,
  skillById: Map<Skill['id'], Skill>,
) {
  return Array.from(unlockedSkillIds).reduce((spent, skillId) => {
    return spent + (skillById.get(skillId)?.cost ?? 0)
  }, 0)
}

export function evaluateSkillUnlock(
  skill: Skill | undefined,
  {
    availableSkillPoints,
    characterLevel,
    skillById,
    unlockedSkillIds,
  }: SkillUnlockEvaluationParams,
): SkillUnlockEvaluation {
  if (!skill) {
    return {
      progressionState: 'locked',
      canUnlock: false,
      buttonLabel: 'LOCKED',
      disabledReason: 'No approved abilities in this path.',
    }
  }

  if (unlockedSkillIds.has(skill.id)) {
    return {
      progressionState: 'unlocked',
      canUnlock: false,
      buttonLabel: 'UNLOCKED',
      disabledReason: 'Already unlocked.',
    }
  }

  if (
    skill.requiredLevel !== undefined &&
    characterLevel < skill.requiredLevel
  ) {
    return {
      progressionState: 'locked',
      canUnlock: false,
      buttonLabel: 'LOCKED',
      disabledReason: `Requires level ${skill.requiredLevel}.`,
    }
  }

  const prerequisiteSkill = skill.prerequisiteSkillId
    ? skillById.get(skill.prerequisiteSkillId)
    : undefined

  if (
    skill.prerequisiteSkillId &&
    !unlockedSkillIds.has(skill.prerequisiteSkillId)
  ) {
    return {
      progressionState: 'locked',
      canUnlock: false,
      buttonLabel: 'LOCKED',
      disabledReason: `Requires ${prerequisiteSkill?.name ?? 'another skill'}.`,
      prerequisiteSkillName: prerequisiteSkill?.name,
    }
  }

  if (availableSkillPoints < skill.cost) {
    return {
      progressionState: 'locked',
      canUnlock: false,
      buttonLabel: 'LOCKED',
      disabledReason: `Requires ${skill.cost} ${getSkillPointLabel(skill.cost)}.`,
      prerequisiteSkillName: prerequisiteSkill?.name,
    }
  }

  return {
    progressionState: 'available',
    canUnlock: true,
    buttonLabel: 'UNLOCK',
    prerequisiteSkillName: prerequisiteSkill?.name,
  }
}

export function useSkillProgression(
  build: SkillBuild,
  character: ActiveSkillTreeCharacter,
) {
  const skillById = useMemo(() => {
    return new Map(build.skills.map((skill) => [skill.id, skill]))
  }, [build.skills])

  const totalSkillPoints = useMemo(() => {
    return getTotalSkillPointsForLevel(character.level)
  }, [character.level])

  const [unlockedSkillIds, setUnlockedSkillIds] = useState<
    Set<Skill['id']>
  >(() => new Set())

  const spentSkillPoints = useMemo(() => {
    return getSpentSkillPoints(unlockedSkillIds, skillById)
  }, [skillById, unlockedSkillIds])

  const availableSkillPoints = Math.max(0, totalSkillPoints - spentSkillPoints)

  const getUnlockEvaluation = useCallback(
    (skill: Skill | undefined) => {
      return evaluateSkillUnlock(skill, {
        availableSkillPoints,
        characterLevel: character.level,
        skillById,
        unlockedSkillIds,
      })
    },
    [availableSkillPoints, character.level, skillById, unlockedSkillIds],
  )

  const unlockSkill = useCallback(
    (skill: Skill | undefined) => {
      setUnlockedSkillIds((currentUnlockedSkillIds) => {
        const currentSpentSkillPoints = getSpentSkillPoints(
          currentUnlockedSkillIds,
          skillById,
        )
        const currentAvailableSkillPoints = Math.max(
          0,
          totalSkillPoints - currentSpentSkillPoints,
        )
        const evaluation = evaluateSkillUnlock(skill, {
          availableSkillPoints: currentAvailableSkillPoints,
          characterLevel: character.level,
          skillById,
          unlockedSkillIds: currentUnlockedSkillIds,
        })

        if (!skill || !evaluation.canUnlock) {
          return currentUnlockedSkillIds
        }

        const nextUnlockedSkillIds = new Set(currentUnlockedSkillIds)
        nextUnlockedSkillIds.add(skill.id)

        return nextUnlockedSkillIds
      })
    },
    [character.level, skillById, totalSkillPoints],
  )

  return {
    availableSkillPoints,
    getUnlockEvaluation,
    skillById,
    totalSkillPoints,
    unlockSkill,
    unlockedSkillIds,
  }
}
