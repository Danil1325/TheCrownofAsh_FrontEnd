import { useState } from 'react'
import '../../styles/game-ui.css'
import './MainMenu.css'
import OptionsMenu from '../../components/OptionsMenu/OptionsMenu'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

import background from '../../assets/MainMenu/Main Menu Background.png'
import logo from '../../assets/MainMenu/The Crown Of Ash Logo.png'
import newGame from '../../assets/MainMenu/Buttons/New Game.png'
import loadGame from '../../assets/MainMenu/Buttons/Load Game.png'
import skills from '../../assets/MainMenu/Buttons/Skills.png'
import logOut from '../../assets/Buttons/Log Out.png'
import options from '../../assets/Icons/Options.png'

type MenuAction = 'new-game' | 'load-game' | 'skills'
type SelectedAction = Exclude<MenuAction, 'skills'> | 'log-out'

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
  onOpenSkills: () => void
  onNewGame: () => void
}

function MainMenu({
  musicVolume,
  sfxVolume,
  onMusicVolumeChange,
  onSfxVolumeChange,
  onPlayButtonSound,
  onOpenSkills,
  onNewGame,
}: MainMenuProps) {
  const [selectedAction, setSelectedAction] = useState<SelectedAction | null>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  if (selectedAction === 'new-game' || selectedAction === 'load-game') {
    return <LoadingScreen musicVolume={musicVolume} onComplete={onNewGame} />
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
                if (item.action === 'skills') {
                  onOpenSkills()
                  return
                }

                setSelectedAction(item.action)
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

        <button
          className="game-button logout-button"
          type="button"
          aria-label="Log out"
          onClick={() => {
            onPlayButtonSound()
            setSelectedAction('log-out')
          }}
        >
          <img src={logOut} alt="" />
        </button>
      </div>

      {selectedAction === 'log-out' && (
        <div className="action-feedback" role="status" aria-live="polite">
          Log Out selected
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
