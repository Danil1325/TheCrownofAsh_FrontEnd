type QuestRewardViewProps = { experience?: number }

function QuestRewardView({ experience = 0 }: QuestRewardViewProps) {
  return <div className="quest-reward-view" aria-label={`${experience} experience reward`}><span aria-hidden="true">✦</span><strong>+{experience} EXP</strong></div>
}

export default QuestRewardView
