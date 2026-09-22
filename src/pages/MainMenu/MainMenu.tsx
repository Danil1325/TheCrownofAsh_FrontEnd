import { useState } from 'react'
import '../../styles/game-ui.css'
import './MainMenu.css'
import OptionsMenu from '../../components/OptionsMenu/OptionsMenu'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import Map from '../Map/Map'
import Shop from '../Shop/Shop'
import type { StoryScene } from '../../types/scenario'
import Collection from '../Collection/Collection'
import Achievements from '../Achievements/Achievements'

import background from '../../assets/MainMenu/Main Menu Background.png'
import logo from '../../assets/MainMenu/The Crown Of Ash Logo.png'
import newGame from '../../assets/MainMenu/Buttons/New Game.png'
import loadGame from '../../assets/MainMenu/Buttons/Load Game.png'
import skills from '../../assets/MainMenu/Buttons/Skills.png'
import options from '../../assets/Icons/Options.png'

import achievementsBtn from '../../assets/MainMenu/Buttons/Achievements.png'
import collectionBtn from '../../assets/MainMenu/Buttons/Collection.png'
import shopBtn from '../../assets/MainMenu/Buttons/Shop.png'
import logOutBtn from '../../assets/MainMenu/Buttons/LogOut.png'

type MenuAction = 'new-game' | 'load-game' | 'shop' | 'skills' | 'options' | 'collection' | 'achievements'

const menuItems: Array<{ action: MenuAction; image: string; label: string }> = [
  { action: 'new-game', image: newGame, label: 'New Game' },
  { action: 'load-game', image: loadGame, label: 'Load Game' },
  { action: 'skills', image: skills, label: 'Skills' },
]

type MainMenuProps = {
  playerId: number
  musicVolume: number
  sfxVolume: number
  onMusicVolumeChange: (value: number) => void
  onSfxVolumeChange: (value: number) => void
  onPlayButtonSound: () => void
  onOpenSkills: () => void
  onNewGame: () => void
  onLoadGame: (scene: StoryScene) => void
  onLogout: () => void
}

function MainMenu({ playerId, musicVolume, sfxVolume, onMusicVolumeChange, onSfxVolumeChange, onPlayButtonSound, onNewGame, onLoadGame, onLogout }: MainMenuProps) {
function MainMenu({
  musicVolume,
  sfxVolume,
  onMusicVolumeChange,
  onSfxVolumeChange,
  onPlayButtonSound,
  onOpenSkills,
  onNewGame,
  onLogout,
}: MainMenuProps) {
  const [selectedAction, setSelectedAction] = useState<MenuAction | null>(null)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const [mapMode, setMapMode] = useState<'new' | 'load' | null>(null)

  if (selectedAction === 'new-game' || selectedAction === 'load-game') {
    return <LoadingScreen musicVolume={musicVolume} onComplete={onNewGame} />
  }

  if (mapMode) {
    return (
      <Map
        mode={mapMode}
        playerId={playerId}
        onClose={() => setMapMode(null)}
        onStartGameplay={onNewGame}
        onLoadGame={onLoadGame}
      />
    )
  }

  if (selectedAction === 'shop') {
    return <Shop onBack={() => setSelectedAction(null)} onPlayButtonSound={onPlayButtonSound} />
  }

  if (selectedAction === 'collection') {
    return <Collection onBack={() => setSelectedAction(null)} onPlayButtonSound={onPlayButtonSound} />
  }

  if (selectedAction === 'achievements') {
    return <Achievements onBack={() => setSelectedAction(null)} onPlayButtonSound={onPlayButtonSound} />
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
                if (item.action === 'new-game') {
                  setMapMode('new')
                } else if (item.action === 'load-game') {
                  setMapMode('load')
                } else {
                  setSelectedAction(item.action)
                  onNewGame()
                  return
                }

                if (item.action === 'load-game') {
                  setIsMapOpen(true)
                  return
                }

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

        <div className="corner-actions-right">
          <button
            className="game-button collection-button"
            type="button"
            aria-label="Achievements"
            onClick={() => {
              onPlayButtonSound()
              setSelectedAction('achievements')
            }}
          >
            <img src={achievementsBtn} alt="Achievements" />
          </button>

          <button
            className="game-button collection-button"
            type="button"
            aria-label="Collection"
            onClick={() => {
              onPlayButtonSound()
              setSelectedAction('collection')
            }}
          >
            <img src={collectionBtn} alt="Collection" />
          </button>

          <button
            className="game-button shop-button"
            type="button"
            aria-label="Shop"
            onClick={() => {
              onPlayButtonSound()
              setSelectedAction('shop')
            }}
          >
            <img src={shopBtn} alt="Shop" />
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
            <img src={logOutBtn} alt="Log Out" />
          </button>
        </div>
      </div>

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
