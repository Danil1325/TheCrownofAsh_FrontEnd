import type { ReactNode } from 'react'
import displayMenu from '../../assets/CharacterCreation/UI/DisplayMenu.png'
import textBox from '../../assets/CharacterCreation/UI/TextBox.png'
import type { CharacterClass, Race } from '../../pages/CharacterCreation/characterCreationData'

type DisplayMenuProps = { race: Race; characterClass?: CharacterClass; name: string; onNameChange: (name: string) => void }

function DisplayMenu({ race, characterClass, name, onNameChange }: DisplayMenuProps) {
  return <section className="display-menu" style={{ backgroundImage: `url("${displayMenu}")` }} aria-label="Character summary">
    <div className="display-menu__portrait-wrap"><img className="display-menu__portrait" src={race.displayImage} alt={race.name} />{characterClass && <img className="display-menu__class-symbol" src={characterClass.symbol} alt={`${characterClass.name} symbol`} style={{ top: race.symbolPosition.top, left: race.symbolPosition.left, width: race.symbolPosition.size }} />}</div>
    <div className="display-menu__details">
      <DisplayField label="Name"><input value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Unnamed Hero" aria-label="Character name" /></DisplayField>
      <DisplayField label="Race"><span>{race.name}</span></DisplayField>
      <DisplayField label="Class"><span>{characterClass?.name ?? '—'}</span></DisplayField>
      <div className="display-menu__divider" aria-hidden="true" />
      <p className="display-menu__description">{race.description}</p>
    </div>
  </section>
}

function DisplayField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="display-field"><span className="display-field__label">{label}</span><div className="display-field__value" style={{ backgroundImage: `url("${textBox}")` }}>{children}</div></div>
}

export default DisplayMenu
