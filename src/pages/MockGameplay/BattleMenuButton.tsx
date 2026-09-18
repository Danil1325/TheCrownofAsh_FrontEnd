type BattleMenuButtonProps = {
  label: string
  subtitle: string
  icon: string
  frame: string
  active: boolean
  onSelect: () => void
}

export default function BattleMenuButton({ label, subtitle, icon, frame, active, onSelect }: BattleMenuButtonProps) {
  return (
    <button
      type="button"
      className={`battle-menu-button${active ? ' active' : ''}`}
      aria-pressed={active}
      onClick={onSelect}
    >
      {/* Extend only the middle of the original frame. The end ornaments keep
          their proportions; only empty transparent rows are excluded. */}
      <div className="battle-menu-frame" aria-hidden="true">
        {['0 44 92 146', '92 44 328 146', '420 44 92 146'].map((viewBox) => (
          <svg key={viewBox} viewBox={viewBox} preserveAspectRatio="none" focusable="false">
            <image href={frame} width="512" height="210" />
          </svg>
        ))}
      </div>
      <div className="battle-menu-content">
        <img className="battle-menu-icon" src={icon} alt="" />
        <span className="battle-menu-copy">
          <b>{label}</b>
          <small>{subtitle}</small>
        </span>
      </div>
    </button>
  )
}
