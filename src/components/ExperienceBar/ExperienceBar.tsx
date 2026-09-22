import type { LevelProgress } from '../../types/scenario'
import './ExperienceBar.css'

type ExperienceBarProps = { progression: LevelProgress | null; onPreviewLevelUp?: () => void }

function ExperienceBar({ progression, onPreviewLevelUp }: ExperienceBarProps) {
  if (!progression) return null
  const percent = Math.max(0, Math.min(100, progression.experienceProgressPercentage))
  return <section className="experience-bar" aria-label="Character experience">
    <div className="experience-bar__level">Level <strong>{progression.level}</strong></div>
    <div className="experience-bar__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}><span style={{ width: `${percent}%` }} /></div>
    <div className="experience-bar__numbers"><b>{progression.currentExperience} EXP</b><span>{progression.experienceForNextLevel == null ? 'MAX' : `${progression.experienceForNextLevel} EXP`}</span></div>
    {onPreviewLevelUp && <button className="experience-bar__preview" type="button" onClick={onPreviewLevelUp}>Test level up</button>}
  </section>
}

export default ExperienceBar
