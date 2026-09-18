import frame from '../../assets/Battle/ui/frame_action_card_reference.png'
import './ActionCard.css'

type ActionCardProps = {
  title: string
  detail: string
  icon: string
  cost: string
  selected: boolean
  onPlay: () => void
}

export default function ActionCard({ title, detail, icon, cost, selected, onPlay }: ActionCardProps) {
  return (
    <button
      className={`action-card${selected ? ' selected' : ''}`}
      type="button"
      aria-pressed={selected}
      onClick={onPlay}
    >
      <img className="action-card-frame" src={frame} alt="" />
      <em className="action-card-cost">{cost}</em>
      <img className="action-card-icon" src={icon} alt="" />
      <strong className="action-card-title">{title}</strong>
      <span className="action-card-detail">{detail}</span>
    </button>
  )
}
