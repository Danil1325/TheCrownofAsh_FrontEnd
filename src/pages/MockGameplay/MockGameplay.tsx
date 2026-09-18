import { useMemo, useState } from 'react'
import BattleMenuButton from './BattleMenuButton'
import ActionCard from './ActionCard'
import PlayerPanel from './PlayerPanel'
import Inventory from '../../components/Inventory/Inventory'
import './MockGameplay.css'
import './BattleMenuSizing.css'
import './SectionPanelFrame.css'
import './PanelLayoutSizing.css'
import './FrameContentFit.css'
import './ReferenceLayout.css'
import './BattleArena.css'
import landscape from '../../assets/Battle/backgrounds/battle_landscape.png'
import goblin from '../../assets/Battle/characters/goblin.png'
import sectionPanelFrame from '../../assets/Battle/ui/section_panel_frame.png'
import enemyBanner from '../../assets/Battle/ui/panel_information.png'
import barFrame from '../../assets/Battle/ui/bar_frame.png'
import healthFill from '../../assets/Battle/ui/health_fill.png'
import manaFill from '../../assets/Battle/ui/mana_fill.png'
import activeMenuFrame from '../../assets/Battle/ui/menu_active.png'
import normalMenuFrame from '../../assets/Battle/ui/menu_normal.png'
import rollDiceButton from '../../assets/Battle/ui/button_roll_dice.png'
import endTurnButton from '../../assets/Battle/ui/button_end_turn.png'
import crossedSwords from '../../assets/Battle/items/crossed_swords.png'
import hammer from '../../assets/Battle/items/hammer.png'
import slashSword from '../../assets/Battle/icons/slash_sword.png'
import healChalice from '../../assets/Battle/icons/heal_chalice.png'
import shieldGauntlet from '../../assets/Battle/icons/shield_gauntlet.png'
import talentsTree from '../../assets/Battle/icons/talents_tree.png'
import companions from '../../assets/Battle/icons/companions.png'
import inventoryBag from '../../assets/Battle/icons/inventory_bag.png'
import map from '../../assets/Battle/icons/map.png'
import settings from '../../assets/Battle/icons/settings.png'
import diceRed from '../../assets/Battle/icons/dice_red.png'
import diceBlue from '../../assets/Battle/icons/dice_blue.png'
import diceGreen from '../../assets/Battle/icons/dice_green.png'

type MenuKey = 'combat' | 'talents' | 'companions' | 'inventory' | 'map' | 'settings'
const actionCards = [
  { title: 'SLASH', detail: 'Deal 16 Damage', icon: slashSword, tag: '2' },
  { title: 'HEAL', detail: 'Restore 20 Health', icon: healChalice, tag: '2' },
  { title: 'POWER STRIKE', detail: 'Deal 32 Damage\nRoll: +10% Crit', icon: hammer, tag: '2' },
  { title: 'SHIELD UP', detail: 'Gain 18 Block', icon: shieldGauntlet, tag: '2' },
]
const menuItems: Array<{ id: MenuKey; label: string; subtitle: string; icon: string }> = [
  { id: 'combat', label: 'COMBAT', subtitle: 'Fight enemies', icon: crossedSwords }, { id: 'talents', label: 'TALENTS', subtitle: 'Upgrade your hero', icon: talentsTree }, { id: 'companions', label: 'COMPANIONS', subtitle: 'Recruit allies', icon: companions }, { id: 'inventory', label: 'INVENTORY', subtitle: 'Manage your items', icon: inventoryBag }, { id: 'map', label: 'MAP', subtitle: 'Explore the world', icon: map }, { id: 'settings', label: 'SETTINGS', subtitle: 'Game options', icon: settings },
]
function Meter({ value, type }: { value: number; type: 'health' | 'mana' }) { return <div className={`meter meter-${type}`}><img className="meter-frame" src={barFrame} alt="" /><div className="meter-clip"><img src={type === 'health' ? healthFill : manaFill} alt="" style={{ width: `${value}%` }} /></div></div> }

type MockGameplayProps = {
  onBackToMenu?: () => void
}

function MockGameplay({ onBackToMenu }: MockGameplayProps = {}) {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('combat'); const [selectedCard, setSelectedCard] = useState(0); const [health, setHealth] = useState(150); const [mana, setMana] = useState(50); const [turn, setTurn] = useState(3); const [dice, setDice] = useState([6, 5, 4]); const [page, setPage] = useState(1)
  const selectedAction = actionCards[selectedCard]; const message = useMemo(() => selectedAction.title === 'HEAL' ? 'Health restored.' : `${selectedAction.title} selected.`, [selectedAction])
  function handlePlayAction(index: number) { setSelectedCard(index); const action = actionCards[index]; if (action.title === 'HEAL') setHealth((current) => Math.min(200, current + 20)); else if (action.title !== 'SHIELD UP') setMana((current) => Math.max(0, current - 5)) }
  function rollDice() { setDice(dice.map(() => Math.floor(Math.random() * 6) + 1)) }

  if (activeMenu === 'inventory') {
    return <Inventory onClose={() => setActiveMenu('combat')} />
  }
  return <main className="battle-screen" style={{ backgroundImage: `url(${landscape})` }}>
    <PlayerPanel health={health} mana={mana} />
    <section className="battle-main" aria-label="Battle arena">
      <div className="battle-scene">
        <div className="top-hud">
          <div className="enemy-info" style={{ backgroundImage: `url(${enemyBanner})` }}>
            <span aria-hidden="true">☠</span>
            <div className="enemy-info-content">
              <h1>Goblin</h1><p>Info: P M P P R R N</p>
              <Meter value={64} type="health" /><Meter value={64} type="mana" />
              <b>Talent - Coin Steal</b>
            </div>
          </div>
          <div className="turn-scroll">TURN {turn}</div>
        </div>
        <img className="enemy-character" src={goblin} alt="Goblin opponent" />
        <div className="battle-toast" role="status" aria-live="polite">{message}</div>
      </div>
      <div className="battle-hand">
        <div className="mana-orb"><span>3/5</span><b>MANA</b><div>♦ ♦ ♦</div></div>
        <section className="actions" aria-label="Action cards">
          {actionCards.map((card, index) => (
            <ActionCard
              key={card.title}
              title={card.title}
              detail={card.detail}
              icon={card.icon}
              cost={card.tag}
              selected={selectedCard === index}
              onPlay={() => handlePlayAction(index)}
            />
          ))}
        </section>
      </div>
      <div className="card-controls">
        <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))}>←</button>
        <span>{page}/3</span>
        <button type="button" onClick={() => setPage((current) => Math.min(3, current + 1))}>→</button>
      </div>
    </section>
    <aside className="battle-right parchment-panel" style={{ backgroundImage: `url(${sectionPanelFrame})` }} aria-label="Game menu and dice controls"><h2 className="menu-heading">✦ &nbsp; MENIU &nbsp; ✦</h2><nav className="battle-menu" aria-label="Game areas">{menuItems.map((item) => <BattleMenuButton key={item.id} label={item.label} subtitle={item.subtitle} icon={item.icon} frame={activeMenu === item.id ? activeMenuFrame : normalMenuFrame} active={activeMenu === item.id} onSelect={() => setActiveMenu(item.id)} />)}</nav><section className="dice-system"><h2>DICE SYSTEM</h2><div className="dice-row">{[diceRed, diceBlue, diceGreen].map((die, index) => <button key={die} type="button" className="die"><img src={die} alt={`Dice ${dice[index]}`} /><b>{dice[index]}</b></button>)}</div><p>Choose dice to keep, then roll again!</p><button className="image-button roll-button" type="button" onClick={rollDice} style={{ backgroundImage: `url(${rollDiceButton})` }}>ROLL DICE<small>3 REROLLS LEFT</small></button><button className="image-button end-button" type="button" onClick={() => setTurn((current) => current + 1)} style={{ backgroundImage: `url(${endTurnButton})` }}>END TURN</button></section></aside>
  </main>
}
export default MockGameplay
