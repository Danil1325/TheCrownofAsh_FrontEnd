import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Loader2, X } from 'lucide-react'
import * as scenarioApi from '../../api/scenarioApi'
import { ApiError } from '../../api/authApi'
import { QuestStatus, QuestType } from '../../types/scenario'
import type { PlayerQuest, QuestSummary } from '../../types/scenario'
import QuestCard from './QuestCard'
import type { QuestRecord } from './questJournalTypes'
import './QuestJournal.css'

type QuestTab = 'main' | 'side' | 'completed'
type QuestJournalModalProps = { playerId: number; onClose: () => void }

function QuestJournalModal({ playerId, onClose }: QuestJournalModalProps) {
  const [tab, setTab] = useState<QuestTab>('main')
  const [active, setActive] = useState<PlayerQuest[]>([])
  const [available, setAvailable] = useState<QuestSummary[]>([])
  const [completed, setCompleted] = useState<PlayerQuest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startingId, setStartingId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([scenarioApi.getActiveQuests(playerId), scenarioApi.getAvailableQuests(playerId), scenarioApi.getCompletedQuests(playerId)])
      .then(([nextActive, nextAvailable, nextCompleted]) => { if (mounted) { setActive(nextActive); setAvailable(nextAvailable); setCompleted(nextCompleted); setError(null) } })
      .catch((err) => { if (mounted) setError(err instanceof ApiError ? err.message : 'Unable to load quests.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [playerId])

  const mainQuests = useMemo(() => [...active, ...available].filter((quest) => quest.questType !== QuestType.Side), [active, available])
  const sideQuests = useMemo(() => [...active, ...available].filter((quest) => quest.questType === QuestType.Side), [active, available])
  const visibleQuests: QuestRecord[] = tab === 'completed' ? completed : tab === 'main' ? mainQuests : sideQuests

  async function handleStart(quest: QuestRecord) {
    if (quest.status === QuestStatus.Locked || quest.status === 'Locked' || quest.status === 'locked') return
    const questId = quest.id ?? quest.questId
    if (questId == null) return
    setStartingId(String(questId))
    try {
      const started = await scenarioApi.startQuest(playerId, questId)
      setActive((current) => [...current.filter((item) => item.questId !== started.questId), started])
      setAvailable((current) => current.filter((item) => item.id !== questId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to start this quest.')
    } finally { setStartingId(null) }
  }

  return <div className="quest-journal-modal"><button className="quest-modal-backdrop" type="button" aria-label="Close quest journal" onClick={onClose} /><aside className="quest-journal-panel" role="dialog" aria-modal="true" aria-label="Quest Journal">
    <header className="quest-journal-header"><BookOpen size={21} aria-hidden="true" /><h2>Quest Journal</h2><button className="quest-journal-close" type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></header>
    <nav className="quest-tabs" aria-label="Quest categories">{(['main', 'side', 'completed'] as QuestTab[]).map((item) => <button className={tab === item ? 'is-active' : ''} type="button" key={item} onClick={() => setTab(item)}>{item === 'main' ? 'Main Quests' : item === 'side' ? 'Side Quests' : 'Completed'}</button>)}</nav>
    {error && <p className="quest-journal-error" role="alert">{error}</p>}
    {loading ? <div className="quest-journal-loading"><Loader2 size={22} className="quest-journal-spinner" /> Loading quests…</div> : <div className="quest-journal-content"><section className={`quest-category quest-category--${tab}`}><h3>{tab === 'main' ? 'Main Quests' : tab === 'side' ? 'Side Quests' : 'Completed Quests'}</h3>{visibleQuests.length ? visibleQuests.map((quest) => <QuestCard key={`${quest.id ?? quest.questId}-${quest.code}`} quest={quest} questType={quest.questType ?? QuestType.Main} onStart={tab === 'completed' ? undefined : handleStart} starting={startingId === String(quest.id ?? quest.questId)} />) : <p className="quest-empty">No quests in this section.</p>}</section></div>}
  </aside></div>
}

export default QuestJournalModal
