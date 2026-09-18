import { useState } from 'react'
import '../../styles/game-ui.css'
import './MainMenu.css'
import OptionsMenu from '../../components/OptionsMenu/OptionsMenu'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import Shop from '../Shop/Shop'

import background from '../../assets/MainMenu/Main Menu Background.png'
import logo from '../../assets/MainMenu/The Crown Of Ash Logo.png'
import newGame from '../../assets/MainMenu/Buttons/New Game.png'
import loadGame from '../../assets/MainMenu/Buttons/Load Game.png'
import market from '../../assets/MainMenu/Buttons/Market.png'
import skills from '../../assets/MainMenu/Buttons/Skills.png'
import logOut from '../../assets/Buttons/Log Out.png'
import options from '../../assets/Icons/Options.png'

type MenuAction = 'new-game' | 'load-game' | 'shop' | 'skills' | 'options'

const menuItems: Array<{ action: MenuAction; image: string; label: string }> = [
  { action: 'new-game', image: newGame, label: 'New Game' },
  { action: 'load-game', image: loadGame, label: 'Load Game' },
  { action: 'skills', image: skills, label: 'Skills' },
]

type MainMenuProps = {
  musicVolume: number
  sfxVolume: number
  onMusicVolumeChange: (value: number) => void
  onSfxVolumeChange: (value: number) => void
  onPlayButtonSound: () => void
  onNewGame: () => void
  onLogout: () => void
}

function MainMenu({ musicVolume, sfxVolume, onMusicVolumeChange, onSfxVolumeChange, onPlayButtonSound, onNewGame, onLogout }: MainMenuProps) {
  const [selectedAction, setSelectedAction] = useState<MenuAction | null>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  if (selectedAction === 'new-game' || selectedAction === 'load-game') {

    return <LoadingScreen musicVolume={musicVolume} onComplete={onNewGame} />
  }

  if (isMapOpen) {
    return <Map onClose={() => setIsMapOpen(false)} />
  }

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
              onClick={() => {
                onPlayButtonSound()
                if (item.action === 'new-game' || item.action === 'load-game') {
                  setIsMapOpen(true)
                } else {
                  setSelectedAction(item.action)
                }
              }}
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
          onClick={() => {
            onPlayButtonSound()
            setIsOptionsOpen((isOpen) => !isOpen)
          }}
        >
          <img src={options} alt="" />
        </button>

        <div className="corner-actions-right">
          <button
            className="game-button shop-button"
            type="button"
            aria-label="Shop"
            onClick={() => {
              onPlayButtonSound()
              setSelectedAction('shop')
            }}
          >
            <img src={market} alt="" />
          </button>

          <button
            className="game-button logout-button"
            type="button"
            aria-label="Log out"
            onClick={() => {
              onPlayButtonSound()
              onLogout()
            }}
          >
            <img src={logOut} alt="" />
          </button>
        </div>
      </div>

      {selectedAction && selectedAction !== 'options' && (
        <div className="action-feedback" role="status" aria-live="polite">
          {selectedAction === 'skills' && 'Skills selected'}
        </div>
      )}

      {isOptionsOpen && (
        <OptionsMenu
          musicVolume={musicVolume}
          sfxVolume={sfxVolume}
          onMusicVolumeChange={onMusicVolumeChange}
          onSfxVolumeChange={onSfxVolumeChange}
          onPlayButtonSound={onPlayButtonSound}
          onClose={() => setIsOptionsOpen(false)}
        />
      )}
    </main>
  )
}

export default MainMenu
