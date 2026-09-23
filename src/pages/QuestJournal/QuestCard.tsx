import type { QuestType } from '../../types/scenario'
import QuestObjectiveList from './QuestObjectiveList'
import QuestRewardView from './QuestRewardView'
import { isLocked, questKey, statusLabel, type QuestRecord } from './questJournalTypes'

type QuestCardProps = { quest: QuestRecord; questType: QuestType; onStart?: (quest: QuestRecord) => void; starting?: boolean }

function QuestCard({ quest, questType, onStart, starting = false }: QuestCardProps) {
  const locked = isLocked(quest)
  const progress = 'objectiveProgress' in quest ? quest.objectiveProgress : undefined
  return <article className={`quest-card quest-card--${questType === 0 ? 'main' : 'side'} ${locked ? 'is-locked' : ''}`}>
    <div className="quest-card-heading"><div><span className="quest-card-code">{quest.code}</span><h3>{quest.title}</h3></div><span className={`quest-status quest-status--${statusLabel(quest.status).toLowerCase().replace(' ', '-')}`}>{statusLabel(quest.status)}</span></div>
    <p className="quest-card-description">{quest.description || 'No description available.'}</p>
    <dl className="quest-card-meta"><div><dt>Recommended level</dt><dd>{quest.recommendedLevel ?? '—'}</dd></div><div><dt>Location</dt><dd>{quest.location || quest.questGiver || 'Unknown'}</dd></div></dl>
    <div className="quest-card-objectives"><h4>Objectives</h4><QuestObjectiveList objectives={quest.objectives} progress={progress} /></div>
    <div className="quest-card-footer"><QuestRewardView experience={quest.experienceReward} />{onStart && <button className="quest-start-button" disabled={locked || starting} type="button" onClick={() => onStart(quest)}>{locked ? 'Locked' : starting ? 'Starting…' : 'Start quest'}</button>}</div>
    <span className="quest-card-key" aria-hidden="true">{questKey(quest)}</span>
  </article>
}

export default QuestCard
