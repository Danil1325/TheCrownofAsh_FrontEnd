import { useState } from 'react'
import '../../styles/game-ui.css'
import './MainMenu.css'
import OptionsMenu from '../../components/OptionsMenu/OptionsMenu'

import background from '../../assets/MainMenu/Main Menu Background.png'
import logo from '../../assets/MainMenu/The Crown Of Ash Logo.png'
import newGame from '../../assets/MainMenu/Buttons/New Game.png'
import loadGame from '../../assets/MainMenu/Buttons/Load Game.png'
import credits from '../../assets/MainMenu/Buttons/Credits.png'
import logOut from '../../assets/Buttons/Log Out.png'
import options from '../../assets/Icons/Options.png'

type MenuAction = 'new-game' | 'load-game' | 'credits' | 'options' | 'log-out'

const menuItems: Array<{ action: MenuAction; image: string; label: string }> = [
  { action: 'new-game', image: newGame, label: 'New Game' },
  { action: 'load-game', image: loadGame, label: 'Load Game' },
  { action: 'credits', image: credits, label: 'Credits' },
]

function MainMenu() {
  const [selectedAction, setSelectedAction] = useState<MenuAction | null>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  return (
    <main className="main-menu" style={{ backgroundImage: 'url("' + background + '")' }}>
      <div className="menu-content">
        <img className="game-logo" src={logo} alt="The Crown of Ash" />

        <nav className="main-actions" aria-label="Main menu">
          {menuItems.map((item) => (
            <button
              className="game-button menu-button"
              key={item.action}
              type="button"
              aria-label={item.label}
              onClick={() => setSelectedAction(item.action)}
            >
              <img src={item.image} alt="" />
            </button>
          ))}
        </nav>
      </div>

      <div className="corner-actions">
        <button
          className="game-button options-button"
          type="button"
          aria-label="Options"
          aria-expanded={isOptionsOpen}
          onClick={() => setIsOptionsOpen((isOpen) => !isOpen)}
        >
          <img src={options} alt="" />
        </button>

        <button
          className="game-button logout-button"
          type="button"
          aria-label="Log out"
          onClick={() => setSelectedAction('log-out')}
        >
          <img src={logOut} alt="" />
        </button>
      </div>

      {selectedAction && selectedAction !== 'options' && (
        <div className="action-feedback" role="status" aria-live="polite">
          {selectedAction === 'new-game' && 'New Game selected'}
          {selectedAction === 'load-game' && 'Load Game selected'}
          {selectedAction === 'credits' && 'Credits selected'}
          {selectedAction === 'log-out' && 'Log Out selected'}
        </div>
      )}

      {isOptionsOpen && (
        <OptionsMenu onClose={() => setIsOptionsOpen(false)} />
      )}
    </main>
  )
}

export default MainMenu
