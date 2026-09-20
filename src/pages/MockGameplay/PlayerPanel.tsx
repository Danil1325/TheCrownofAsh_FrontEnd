import { useState } from 'react'
import orcCard from '../../assets/Battle/characters/orc_card.png'
import itemFrame from '../../assets/Battle/ui/frame_portrait.png'
import barFrame from '../../assets/Battle/ui/bar_frame.png'
import healthFill from '../../assets/Battle/ui/health_fill.png'
import manaFill from '../../assets/Battle/ui/mana_fill.png'
import potion from '../../assets/Battle/items/potion.png'
import ring from '../../assets/Battle/items/ring.png'
import skull from '../../assets/Battle/items/skull.png'
import hood from '../../assets/Battle/items/hood.png'
import helmet from '../../assets/Battle/items/helmet.png'
import hammer from '../../assets/Battle/items/hammer.png'
import boots from '../../assets/Battle/items/boots.png'
import fireball from '../../assets/Battle/items/fireball.png'
import armor from '../../assets/Battle/items/armor.png'
import crystal from '../../assets/Battle/items/crystal.png'
import shield from '../../assets/Battle/items/shield.png'
import './PlayerPanel.css'

const equipment = [
  { name: 'Helmet', icon: helmet, tone: 'blue' },
  { name: 'Armor', icon: armor, tone: 'green' },
  { name: 'Hammer', icon: hammer, tone: 'blue' },
  { name: 'Boots', icon: boots, tone: 'blue' },
]

const potions = [
  { name: 'Health Potion 1', icon: potion, tone: 'violet' },
  { name: 'Mana Potion 1', icon: potion, tone: 'blue' },
  { name: 'Health Potion 2', icon: potion, tone: 'violet' },
  { name: 'Mana Potion 2', icon: potion, tone: 'blue' },
  { name: 'Health Potion 3', icon: potion, tone: 'violet' },
  { name: 'Mana Potion 3', icon: potion, tone: 'blue' },
  { name: 'Health Potion 4', icon: potion, tone: 'violet' },
  { name: 'Mana Potion 4', icon: potion, tone: 'blue' },
]

function PlayerMeter({ value, maximum, type }: { value: number; maximum: number; type: 'health' | 'mana' }) {
  const percentage = Math.max(0, Math.min(100, value / maximum * 100))
  return (
    <div className="player-meter" role="progressbar" aria-label={type === 'health' ? 'HP' : 'Mana'} aria-valuenow={value} aria-valuemin={0} aria-valuemax={maximum}>
      <svg viewBox="32 35 466 98" preserveAspectRatio="none" aria-hidden="true">
        <image href={barFrame} width="512" height="199" />
      </svg>
      <div className="player-meter-fill" style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }}>
        <svg viewBox="32 57 451 56" preserveAspectRatio="none" aria-hidden="true">
          <image href={type === 'health' ? healthFill : manaFill} width="512" height="199" />
        </svg>
      </div>
    </div>
  )
}

export default function PlayerPanel({ health, mana }: { health: number; mana: number }) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  return (
    <section className="battle-left parchment-panel player-panel" aria-label="Hero and inventory">
      <div className="hero-overview">
        <div className="hero-portrait">
          <img src={orcCard} alt="The Orc character portrait" />
          <span className="hero-level">II</span>
          <strong className="hero-name">THE ORC</strong>
        </div>
        <div className="hero-stats">
          <b className="health-text">{health}/200 HP</b>
          <PlayerMeter value={health} maximum={200} type="health" />
          <b className="mana-text">{mana}/50 MANA</b>
          <PlayerMeter value={mana} maximum={50} type="mana" />
          <div className="hero-gems" aria-hidden="true">
            <img src={crystal} alt="" /><img src={crystal} alt="" /><img src={crystal} alt="" />
          </div>
          <p>Aura: Damage Shield<br /><strong>Status Effects:</strong><br />-20% Damage</p>
        </div>
      </div>
      <section className="player-inventory" aria-labelledby="player-equipment-heading">
        <h2 id="player-equipment-heading">Equipment</h2>
        <div className="inventory-grid equipment-grid">
          {equipment.map((item) => (
            <button
              className={`inventory-item inventory-tone-${item.tone}`}
              key={item.name}
              type="button"
              aria-label={`${item.name}, level 2`}
              aria-pressed={selectedItem === item.name}
              onClick={() => setSelectedItem(item.name)}
            >
              <svg className="inventory-slot-frame" viewBox="76 14 361 408" aria-hidden="true">
                <image href={itemFrame} width="512" height="435" />
              </svg>
              <img className="inventory-slot-icon" src={item.icon} alt="" />
              <span>LvL 2</span>
            </button>
          ))}
        </div>
        <h2 id="player-potions-heading">Potions</h2>
        <div className="inventory-grid potions-grid">
          {potions.map((item) => (
            <button
              className={`inventory-item inventory-tone-${item.tone}`}
              key={item.name}
              type="button"
              aria-label={`${item.name}, level 2`}
              aria-pressed={selectedItem === item.name}
              onClick={() => setSelectedItem(item.name)}
            >
              <svg className="inventory-slot-frame" viewBox="76 14 361 408" aria-hidden="true">
                <image href={itemFrame} width="512" height="435" />
              </svg>
              <img className="inventory-slot-icon" src={item.icon} alt="" />
              <span>LvL 2</span>
            </button>
          ))}
        </div>
      </section>
      <button type="button" className="details-button"><span aria-hidden="true">▥</span> STATS &amp; DETAILS</button>
    </section>
  )
}
