import { useCallback, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import buttonPressSound from './assets/Button Press.mp3'
import MockGameplay from './pages/MockGameplay/MockGameplay'

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(70)
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu')
  const finishInitialLoading = useCallback(() => setIsInitialLoading(false), [])
  const playButtonSound = useCallback(() => {
    if (sfxVolume === 0) return

    const sound = new Audio(buttonPressSound)
    sound.volume = sfxVolume / 100
    void sound.play().catch(() => undefined)
  }, [sfxVolume])

  if (isInitialLoading) {
    return <LoadingScreen onComplete={finishInitialLoading} musicVolume={musicVolume} />
  }

  if (gameState === 'playing') {
    return <MockGameplay />
  }

  return (
    <div className="app-page-enter">
      <MainMenu
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onMusicVolumeChange={setMusicVolume}
        onSfxVolumeChange={setSfxVolume}
        onPlayButtonSound={playButtonSound}
        onNewGame={() => setGameState('playing')}
      />
    </div>
  )
}

export default App
