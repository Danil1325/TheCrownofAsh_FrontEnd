import { useCallback, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import LoginPage from './pages/Login/LoginPage'
import buttonPressSound from './assets/Button Press.mp3'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(70)
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

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => { setIsAuthenticated(true); setIsInitialLoading(true) }} />
  }

  return (
    <div className="app-page-enter">
      <MainMenu
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onMusicVolumeChange={setMusicVolume}
        onSfxVolumeChange={setSfxVolume}
        onPlayButtonSound={playButtonSound}
      />
    </div>
  )
}

export default App
