import attributesMenu from '../../assets/CharacterCreation/UI/AttributesMenu.png'
import blankBar from '../../assets/CharacterCreation/UI/BlankBar.png'
import charismaBar from '../../assets/CharacterCreation/UI/CharismaBar.png'
import dexterityBar from '../../assets/CharacterCreation/UI/DexterityBar.png'
import healthBar from '../../assets/CharacterCreation/UI/HealthBar.png'
import intelligenceBar from '../../assets/CharacterCreation/UI/IntelligenceBar.png'
import strengthBar from '../../assets/CharacterCreation/UI/StrengthBar.png'
import { attributeLabels, type AttributeKey } from '../../pages/CharacterCreation/characterCreationData'

type AttributesProps = { attributes: Record<AttributeKey, number> }
const attributeBarImages: Record<AttributeKey, string> = { health: healthBar, strength: strengthBar, dexterity: dexterityBar, intelligence: intelligenceBar, charisma: charismaBar }

function Attributes({ attributes }: AttributesProps) {
  const derived = { 'Attack Damage': `${Math.round(attributes.strength / 7) + 5}-${Math.round(attributes.strength / 5) + 10}`, 'Dodge Chance': `${Math.round(attributes.dexterity / 20)}%`, 'Mana Pool': `${Math.round(attributes.intelligence * 0.65)}`, 'Escape Chance': `${Math.max(2, Math.round(attributes.dexterity / 25))}%` }
  return <aside className="attributes-panel" style={{ backgroundImage: `url("${attributesMenu}")` }} aria-label="Attributes">
    <div className="attribute-bars">{(Object.keys(attributeLabels) as AttributeKey[]).map((key) => <div className="attribute-row" key={key}><img className="attribute-row__asset" src={attributeBarImages[key]} alt="" /><div className="attribute-row__fill" style={{ width: `${attributes[key]}%` }} /><span className="attribute-row__label">{attributeLabels[key]}</span></div>)}</div>
    <img className="attributes-panel__blank-bar" src={blankBar} alt="" />
    <div className="derived-stats">{Object.entries(derived).map(([label, value]) => <div className="derived-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
  </aside>
}

export default Attributes
