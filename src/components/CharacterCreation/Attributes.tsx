import attributesMenu from '../../assets/CharacterCreation/UI/AttributesMenu.png'
import type { AttributeKey } from '../../pages/CharacterCreation/characterCreationData'

type AttributesProps = { attributes: Record<AttributeKey, number> }
const attributeNames = ['Health', 'Strength', 'Dexterity', 'Intelligence', 'Charisma']

function Attributes({ attributes }: AttributesProps) {
  const derived = { 'Attack Damage': `${Math.round(attributes.strength / 7) + 5}-${Math.round(attributes.strength / 5) + 10}`, 'Dodge Chance': `${Math.round(attributes.dexterity / 20)}%`, 'Mana Pool': `${Math.round(attributes.intelligence * 0.65)}`, 'Escape Chance': `${Math.max(2, Math.round(attributes.dexterity / 25))}%` }
  return <aside className="attributes-panel" style={{ backgroundImage: `url("${attributesMenu}")` }} aria-label="Attributes">
    <div className="attribute-labels" aria-label="Core attributes">{attributeNames.map((name) => <span key={name}>{name}</span>)}</div>
    <div className="health-bar" role="progressbar" aria-label={`Health ${attributes.health}%`} aria-valuenow={attributes.health} aria-valuemin={0} aria-valuemax={100}>
      <div className="health-bar__fill" key={attributes.health} style={{ width: `${attributes.health}%` }} />
    </div>
    <div className="strength-bar" role="progressbar" aria-label={`Strength ${attributes.strength}%`} aria-valuenow={attributes.strength} aria-valuemin={0} aria-valuemax={100}>
      <div className="strength-bar__fill" key={attributes.strength} style={{ width: `${attributes.strength}%` }} />
    </div>
    <div className="dexterity-bar" role="progressbar" aria-label={`Dexterity ${attributes.dexterity}%`} aria-valuenow={attributes.dexterity} aria-valuemin={0} aria-valuemax={100}>
      <div className="dexterity-bar__fill" key={attributes.dexterity} style={{ width: `${Math.min(attributes.dexterity, 52)}%` }} />
    </div>
    <div className="intelligence-bar" role="progressbar" aria-label={`Intelligence ${attributes.intelligence}%`} aria-valuenow={attributes.intelligence} aria-valuemin={0} aria-valuemax={100}>
      <div className="intelligence-bar__fill" key={attributes.intelligence} style={{ width: `${attributes.intelligence}%` }} />
    </div>
    <div className="charisma-bar" role="progressbar" aria-label={`Charisma ${attributes.charisma}%`} aria-valuenow={attributes.charisma} aria-valuemin={0} aria-valuemax={100}>
      <div className="charisma-bar__fill" key={attributes.charisma} style={{ width: `${attributes.charisma}%` }} />
    </div>
    <div className="derived-stats">{Object.entries(derived).map(([label, value]) => <div className="derived-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
  </aside>
}

export default Attributes
