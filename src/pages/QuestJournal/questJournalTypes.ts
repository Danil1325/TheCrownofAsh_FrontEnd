import { QuestStatus } from '../../types/scenario'
import type { PlayerQuest, QuestObjective, QuestSummary, QuestType } from '../../types/scenario'

export type QuestRecord = (QuestSummary | PlayerQuest) & {
  id?: number
  questId?: number
  questType?: QuestType
  status?: QuestStatus | string
  description?: string
  recommendedLevel?: number
  location?: string | null
  questGiver?: string
  objectives?: QuestObjective[]
  experienceReward?: number
}

export function questKey(quest: QuestRecord): string {
  return String(quest.id ?? quest.questId ?? quest.code)
}

export function isLocked(quest: QuestRecord): boolean {
  return quest.status === QuestStatus.Locked || quest.status === 'Locked' || quest.status === 'locked'
}

export function statusLabel(status: QuestStatus | string | undefined): string {
  if (status === QuestStatus.Active || status === 'Active') return 'In Progress'
  if (status === QuestStatus.Completed || status === 'Completed') return 'Completed'
  if (status === QuestStatus.Locked || status === 'Locked' || status === 'locked') return 'Locked'
  if (status === QuestStatus.Failed || status === 'Failed') return 'Failed'
  return 'Available'
}
