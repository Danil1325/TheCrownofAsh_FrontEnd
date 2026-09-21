import { useCallback, useEffect, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import SkillTreePage from './pages/SkillTree/SkillTreePage'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import buttonPressSound from './assets/Button Press.mp3'
import CharacterCreation from './pages/CharacterCreation/CharacterCreation'
import ScenarioPage from './pages/Scenario/ScenarioPage'
import { getCurrentUser, logout } from './api/authApi'
import type { CurrentUser } from './api/authApi'

type ApplicationPage = 'main-menu' | 'skill-tree'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [authenticationPage, setAuthenticationPage] = useState<'login' | 'signup'>('login')
  const [applicationPage, setApplicationPage] = useState<ApplicationPage>('main-menu')
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(70)
  const [gameState, setGameState] = useState<'menu' | 'character-creation' | 'playing'>('menu')
  const finishInitialLoading = useCallback(() => setIsInitialLoading(false), [])
  const backToMenu = useCallback(() => {
    setApplicationPage('main-menu')
    setGameState('menu')
  }, [])
  const playButtonSound = useCallback(() => {
    if (sfxVolume === 0) return

    const sound = new Audio(buttonPressSound)
    sound.volume = sfxVolume / 100
    void sound.play().catch(() => undefined)
  }, [sfxVolume])

  // On load, ask the backend whether the HttpOnly session cookie (if any) is
  // still valid - without this, a real login would appear to work but not
  // survive a page refresh. Rejects (401, no useful body) simply means "not
  // logged in", not an error worth showing.
  useEffect(() => {
    let isMounted = true
    getCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user)
          setIsAuthenticated(true)
          setApplicationPage('main-menu')
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false)
      })
      .finally(() => {
        if (isMounted) setIsCheckingSession(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = useCallback(() => {
    void logout().finally(() => {
      setIsAuthenticated(false)
      setCurrentUser(null)
      setApplicationPage('main-menu')
      setGameState('menu')
    })
  }, [])

  if (isCheckingSession) {
    return null
  }

  if (isInitialLoading) {
    return <LoadingScreen onComplete={finishInitialLoading} musicVolume={musicVolume} />
  }

  if (!isAuthenticated) {
    if (authenticationPage === 'signup') {
      return (
        <SignUp
          onSignUp={(user) => {
            setCurrentUser(user)
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
        onLogin={(user) => {
          setCurrentUser(user)
          setIsAuthenticated(true)
          setApplicationPage('main-menu')
          setGameState('menu')
          setIsInitialLoading(true)
        }}
        onCreateAccount={() => setAuthenticationPage('signup')}
      />
    )
  }

  if (applicationPage === 'skill-tree') {
    return (
      <div className="app-page-enter">
        <SkillTreePage onBackToMainMenu={() => setApplicationPage('main-menu')} />
      </div>
    )
  }

  if (gameState === 'character-creation') {
    return <CharacterCreation onComplete={() => setGameState('playing')} />
  }

  if (gameState === 'playing') {
    return currentUser ? (
      <ScenarioPage key={currentUser.id} playerId={currentUser.id} onBackToMenu={backToMenu} />
    ) : null
  }

  return (
    <div className="app-page-enter">
      <MainMenu
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onMusicVolumeChange={setMusicVolume}
        onSfxVolumeChange={setSfxVolume}
        onPlayButtonSound={playButtonSound}
        onOpenSkills={() => setApplicationPage('skill-tree')}
        onNewGame={() => setGameState('character-creation')}
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App
