import { useEffect, useState } from 'react'
import { BookOpen, Loader2, ScrollText, X } from 'lucide-react'
import * as scenarioApi from '../../api/scenarioApi'
import { ApiError } from '../../api/authApi'
import { QuestStatus } from '../../types/scenario'
import type { PlayerQuest, QuestSummary } from '../../types/scenario'
import './QuestJournal.css'

interface QuestJournalProps {
  /** The player whose quests are listed — everything is fetched from the backend. */
  playerId: number
  onClose: () => void
}

interface QuestJournalState {
  active: PlayerQuest[]
  available: QuestSummary[]
  completed: PlayerQuest[]
}

const STATUS_LABEL: Partial<Record<QuestStatus, string>> = {
  [QuestStatus.Active]: 'In Progress',
  [QuestStatus.Completed]: 'Completed',
  [QuestStatus.Available]: 'Available',
}

const STATUS_CLASS: Partial<Record<QuestStatus, string>> = {
  [QuestStatus.Active]: 'quest-journal-badge--active',
  [QuestStatus.Completed]: 'quest-journal-badge--completed',
  [QuestStatus.Available]: 'quest-journal-badge--available',
}

/**
 * Quest Journal drawer. Opens to the right side of the scenario and lists the
 * player's active, available and completed quests. All data comes from the
 * backend quest endpoints — the frontend only renders what the API returns.
 */
function QuestJournal({ playerId, onClose }: QuestJournalProps) {
  const [state, setState] = useState<QuestJournalState | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      scenarioApi.getActiveQuests(playerId),
      scenarioApi.getCompletedQuests(playerId),
      scenarioApi.getAvailableQuests(playerId),
    ])
      .then(([active, completed, available]) => {
        if (isMounted) {
          setState({ active, available, completed })
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof ApiError ? err.message : 'Unable to load the journal. Please try again.',
          )
        }
      })

    return () => {
      isMounted = false
    }
  }, [playerId])

  const renderPlayerQuest = (quest: PlayerQuest) => (
    <li className="quest-journal-item" key={`${quest.questId}-${quest.status}`} role="listitem">
      <div className="quest-journal-item-head">
        <h4 className="quest-journal-item-title">{quest.title}</h4>
        <span className={`quest-journal-badge ${STATUS_CLASS[quest.status] ?? ''}`}>
          {STATUS_LABEL[quest.status] ?? `Status ${quest.status}`}
        </span>
      </div>
      <p className="quest-journal-item-code">{quest.code}</p>
      {quest.currentObjectiveDescription != null && (
        <p className="quest-journal-objective">
          Objective {quest.currentObjectiveIndex + 1} — {quest.currentObjectiveDescription}
        </p>
      )}
      {Object.keys(quest.objectiveProgress).length > 0 && (
        <p className="quest-journal-progress">
          {Object.entries(quest.objectiveProgress)
            .map(([objectiveId, count]) => `Show ${objectiveId}: ${count}`)
            .join(' · ')}
        </p>
      )}
    </li>
  )

  const renderSummary = (quest: QuestSummary) => (
    <li className="quest-journal-item" key={quest.id} role="listitem">
      <div className="quest-journal-item-head">
        <h4 className="quest-journal-item-title">{quest.title}</h4>
        <span className="quest-journal-badge quest-journal-badge--available">Available</span>
      </div>
      <p className="quest-journal-item-code">{quest.code}</p>
      <p className="quest-journal-item-description">{quest.description}</p>
      <div className="quest-journal-rewards">
        {quest.experienceReward > 0 && (
          <span className="quest-journal-reward">+{quest.experienceReward} EXP</span>
        )}
        {quest.recommendedLevel != null && (
          <span className="quest-journal-reward">Level {quest.recommendedLevel}</span>
        )}
        {quest.questGiver != null && quest.questGiver.length > 0 && (
          <span className="quest-journal-reward">{quest.questGiver}</span>
        )}
      </div>
    </li>
  )

  const entriesActive = state?.active ?? []
  const entriesAvailable = state?.available ?? []
  const entriesCompleted = state?.completed ?? []

  return (
    <>
      <div className="quest-journal-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="quest-journal" role="dialog" aria-modal="true" aria-label="Quest Journal">
        <header className="quest-journal-head">
          <span className="quest-journal-head-icon" aria-hidden="true">
            <BookOpen size={20} strokeWidth={2.2} />
          </span>
          <h2 className="quest-journal-title">Quest Journal</h2>
          <button
            type="button"
            className="quest-journal-close"
            aria-label="Close quest journal"
            onClick={onClose}
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </header>

        {error != null && (
          <p className="quest-journal-error" role="alert">
            {error}
          </p>
        )}

        {state == null && error == null && (
          <div className="quest-journal-loading" role="status">
            <Loader2 className="quest-journal-spinner" size={22} aria-hidden="true" />
            <span>Opening the journal…</span>
          </div>
        )}

        {state != null && (
          <div className="quest-journal-body">
            <section className="quest-journal-section" aria-labelledby="quest-active-heading">
              <h3 id="quest-active-heading" className="quest-journal-section-title">
                In Progress
              </h3>
              {entriesActive.length === 0 ? (
                <p className="quest-journal-empty">No active quests.</p>
              ) : (
                <ul className="quest-journal-list" role="list">
                  {entriesActive.map(renderPlayerQuest)}
                </ul>
              )}
            </section>

            <section className="quest-journal-section" aria-labelledby="quest-available-heading">
              <h3 id="quest-available-heading" className="quest-journal-section-title">
                Available
              </h3>
              {entriesAvailable.length === 0 ? (
                <p className="quest-journal-empty">
                  <ScrollText size={14} aria-hidden="true" /> No quests to start right now.
                </p>
              ) : (
                <ul className="quest-journal-list" role="list">
                  {entriesAvailable.map(renderSummary)}
                </ul>
              )}
            </section>

            <section className="quest-journal-section" aria-labelledby="quest-completed-heading">
              <h3 id="quest-completed-heading" className="quest-journal-section-title">
                Completed
              </h3>
              {entriesCompleted.length === 0 ? (
                <p className="quest-journal-empty">Nothing completed yet.</p>
              ) : (
                <ul className="quest-journal-list" role="list">
                  {entriesCompleted.map(renderPlayerQuest)}
                </ul>
              )}
            </section>
          </div>
        )}
      </aside>
    </>
  )
}

export default QuestJournal
