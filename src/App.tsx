import { useCallback, useEffect, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import buttonPressSound from './assets/Button Press.mp3'
import MockGameplay from './pages/MockGameplay/MockGameplay'
import CharacterCreation from './pages/CharacterCreation/CharacterCreation'
import ScenarioPage from './pages/Scenario/ScenarioPage'
import { getCurrentUser, logout } from './api/authApi'
import type { CurrentUser } from './api/authApi'
import type { StoryScene } from './types/scenario'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [authenticationPage, setAuthenticationPage] = useState<'login' | 'signup'>('login')
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(70)
  const [gameState, setGameState] = useState<'menu' | 'character-creation' | 'playing'>('menu')
  const [initialScenarioScene, setInitialScenarioScene] = useState<StoryScene | null>(null)
  const finishInitialLoading = useCallback(() => setIsInitialLoading(false), [])
  const clearInitialScenarioScene = useCallback(() => setInitialScenarioScene(null), [])
  const startGameplay = useCallback((initialScene: StoryScene | null = null) => {
    setInitialScenarioScene(initialScene)
    setGameState('playing')
    setIsInitialLoading(initialScene == null)
  }, [])
  const startNewGame = useCallback(() => {
    setInitialScenarioScene(null)
    setGameState('character-creation')
  }, [])
  const backToMenu = useCallback(() => {
    setInitialScenarioScene(null)
    setGameState('menu')
  }, [])
  const playButtonSound = useCallback(() => {
    if (sfxVolume === 0) return

    const sound = new Audio(buttonPressSound)
    sound.volume = sfxVolume / 100
    void sound.play().catch(() => undefined)
  }, [sfxVolume])

  // On load, ask the backend whether the HttpOnly session cookie (if any) is
  // still valid — without this, a real login would appear to work but not
  // survive a page refresh. Rejects (401, no useful body) simply means "not
  // logged in", not an error worth showing.
  useEffect(() => {
    let isMounted = true
    getCurrentUser()
      .then((user) => {
        if (isMounted) {
          setCurrentUser(user)
          setIsAuthenticated(true)
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
      setInitialScenarioScene(null)
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
          onSignUp={(user) => { setCurrentUser(user); setIsAuthenticated(true); setIsInitialLoading(true) }}
          onBackToLogin={() => setAuthenticationPage('login')}
        />
      )
    }

    return (
      <Login
        onLogin={(user) => { setCurrentUser(user); setIsAuthenticated(true); setIsInitialLoading(true) }}
        onCreateAccount={() => setAuthenticationPage('signup')}
      />
    )
  }

  if (gameState === 'character-creation') {
    return <CharacterCreation onComplete={startGameplay} />
  }

  if (gameState === 'playing') {
    return currentUser ? (
      <ScenarioPage
        key={currentUser.id}
        playerId={currentUser.id}
        initialScene={initialScenarioScene}
        onInitialSceneConsumed={clearInitialScenarioScene}
        onBackToMenu={backToMenu}
      />
    ) : null
  }

  return currentUser ? (
    <div className="app-page-enter">
      <MainMenu
        playerId={currentUser.id}
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onMusicVolumeChange={setMusicVolume}
        onSfxVolumeChange={setSfxVolume}
        onPlayButtonSound={playButtonSound}
        onNewGame={startNewGame}
        onLoadGame={startGameplay}
        onLogout={handleLogout}
      />
    </div>
  ) : null
}

export default App
