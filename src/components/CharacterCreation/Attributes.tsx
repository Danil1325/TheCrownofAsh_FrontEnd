import attributesMenu from '../../assets/CharacterCreation/UI/AttributesMenu.png'
import AttributeBar from './AttributeBar'
import type { AttributeKey } from '../../pages/CharacterCreation/characterCreationData'

type AttributesProps = { attributes: Record<AttributeKey, number> }
const attributeBars: Array<{ attribute: AttributeKey; label: string; top: string }> = [
  { attribute: 'health', label: 'Health', top: '18.5%' },
  { attribute: 'strength', label: 'Strength', top: '28.7%' },
  { attribute: 'dexterity', label: 'Dexterity', top: '39.2%' },
  { attribute: 'intelligence', label: 'Intelligence', top: '49.6%' },
  { attribute: 'charisma', label: 'Charisma', top: '60.1%' },
]

function Attributes({ attributes }: AttributesProps) {
  const derived = { 'Attack Damage': `${Math.round(attributes.strength / 7) + 5}-${Math.round(attributes.strength / 5) + 10}`, 'Dodge Chance': `${Math.round(attributes.dexterity / 20)}%`, 'Mana Pool': `${Math.round(attributes.intelligence * 0.65)}`, 'Escape Chance': `${Math.max(2, Math.round(attributes.dexterity / 25))}%` }
  return <aside className="attributes-panel" style={{ backgroundImage: `url("${attributesMenu}")` }} aria-label="Attributes">
    <div className="attribute-labels" aria-label="Core attributes">{attributeBars.map(({ attribute, label }) => <span key={attribute}>{label}</span>)}</div>
    {attributeBars.map(({ attribute, label, top }) => <AttributeBar key={attribute} attribute={attribute} label={label} value={attributes[attribute]} top={top} />)}
    <div className="derived-stats">{Object.entries(derived).map(([label, value]) => <div className="derived-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
  </aside>
}

export default Attributes
