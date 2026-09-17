import { useCallback, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import SkillTreePage from './pages/SkillTree/SkillTreePage'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import buttonPressSound from './assets/Button Press.mp3'
import MockGameplay from './pages/MockGameplay/MockGameplay'

type ApplicationPage = 'main-menu' | 'skill-tree'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authenticationPage, setAuthenticationPage] = useState<'login' | 'signup'>('login')
  const [applicationPage, setApplicationPage] = useState<ApplicationPage>('main-menu')
  const [isInitialLoading, setIsInitialLoading] = useState(false)
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

  if (!isAuthenticated) {
    if (authenticationPage === 'signup') {
      return (
        <SignUp
          onSignUp={() => {
            setIsAuthenticated(true)
            setApplicationPage('main-menu')
            setGameState('menu')
            setIsInitialLoading(true)
          }}
          onBackToLogin={() => setAuthenticationPage('login')}
        />
      )
    }

    return (
      <Login
        onLogin={() => {
          setIsAuthenticated(true)
          setApplicationPage('main-menu')
          setGameState('menu')
          setIsInitialLoading(true)
        }}
        onCreateAccount={() => setAuthenticationPage('signup')}
      />
    )
  }

  const authenticatedPage =
    applicationPage === 'skill-tree' ? (
      <SkillTreePage onBackToMainMenu={() => setApplicationPage('main-menu')} />
    ) : gameState === 'playing' ? (
      <MockGameplay />
    ) : (
      <MainMenu
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onMusicVolumeChange={setMusicVolume}
        onSfxVolumeChange={setSfxVolume}
        onPlayButtonSound={playButtonSound}
        onOpenSkills={() => setApplicationPage('skill-tree')}
        onNewGame={() => setGameState('playing')}
      />
    )

  return (
    <div className="app-page-enter">
      {authenticatedPage}
    </div>
  )
}

export default App
