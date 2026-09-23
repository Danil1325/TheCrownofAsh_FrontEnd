import type { QuestObjective } from '../../types/scenario'

type QuestObjectiveListProps = {
  objectives?: QuestObjective[]
  progress?: Record<number, number>
}

function QuestObjectiveList({ objectives, progress = {} }: QuestObjectiveListProps) {
  if (!objectives?.length && !Object.keys(progress).length) {
    return <p className="quest-objectives-empty">No objectives recorded.</p>
  }

  const rows: QuestObjective[] = objectives?.length
    ? objectives
    : Object.entries(progress).map(([id, value]) => ({ id: Number(id), description: `Objective ${id}`, progress: value }))

  return <ul className="quest-objective-list">{rows.map((objective) => {
    const current = objective.progress ?? progress[objective.id] ?? 0
    const target = objective.target ?? 1
    const complete = objective.completed ?? current >= target
    return <li className={complete ? 'quest-objective is-complete' : 'quest-objective'} key={objective.id}><span className="quest-objective-check" aria-hidden="true">{complete ? '✓' : '○'}</span><span className="quest-objective-description">{objective.description}</span><span className="quest-objective-count">{current}/{target}</span></li>
  })}</ul>
}

export default QuestObjectiveList
