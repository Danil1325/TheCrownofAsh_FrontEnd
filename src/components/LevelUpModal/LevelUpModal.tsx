import continueButton from '../../assets/Buttons/Continue.png'
import './LevelUpModal.css'

type LevelUpModalProps = { level: number; onContinue: () => void }

function LevelUpModal({ level, onContinue }: LevelUpModalProps) {
  return <div className="level-up-overlay" role="dialog" aria-modal="true" aria-label="Level up"><div className="level-up-modal"><span className="level-up-spark" aria-hidden="true">✦</span><p className="level-up-kicker">A new chapter begins</p><h2>LEVEL UP!</h2><p className="level-up-message">You reached Level <strong>{level}</strong>.<br />You received 3 Skill Points.</p><button className="level-up-continue" type="button" onClick={onContinue}><img src={continueButton} alt="Continue" /></button></div></div>
}

export default LevelUpModal
