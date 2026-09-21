import { useCallback, useEffect, useRef, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import buttonPressSound from './assets/Button Press.mp3'
import MockGameplay from './pages/MockGameplay/MockGameplay'
import CharacterCreation from './pages/CharacterCreation/CharacterCreation'
import ScenarioPage from './pages/Scenario/ScenarioPage'
import Map from './pages/Map/Map'
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
  const [travelScenarioScene, setTravelScenarioScene] = useState<{ id: number; scene: StoryScene } | null>(null)
  const [isGameplayMapOpen, setIsGameplayMapOpen] = useState(false)
  const nextTravelScenarioSceneId = useRef(0)
  const finishInitialLoading = useCallback(() => setIsInitialLoading(false), [])
  const clearInitialScenarioScene = useCallback(() => setInitialScenarioScene(null), [])
  const clearTravelScenarioScene = useCallback(() => setTravelScenarioScene(null), [])
  const startGameplay = useCallback((initialScene: StoryScene | null = null) => {
    setInitialScenarioScene(initialScene)
    setTravelScenarioScene(null)
    setIsGameplayMapOpen(false)
    setGameState('playing')
    setIsInitialLoading(initialScene == null)
  }, [])
  const startNewGame = useCallback(() => {
    setInitialScenarioScene(null)
    setTravelScenarioScene(null)
    setIsGameplayMapOpen(false)
    setGameState('character-creation')
  }, [])
  const backToMenu = useCallback(() => {
    setInitialScenarioScene(null)
    setTravelScenarioScene(null)
    setIsGameplayMapOpen(false)
    setGameState('menu')
  }, [])
  const openGameplayMap = useCallback(() => setIsGameplayMapOpen(true), [])
  const closeGameplayMap = useCallback(() => setIsGameplayMapOpen(false), [])
  const handleGameplayTravel = useCallback((scene: StoryScene) => {
    nextTravelScenarioSceneId.current += 1
    setTravelScenarioScene({ id: nextTravelScenarioSceneId.current, scene })
    setIsGameplayMapOpen(false)
  }, [])
  const ignoreMapStartGameplay = useCallback(() => undefined, [])
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
      setTravelScenarioScene(null)
      setIsGameplayMapOpen(false)
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
      <>
        <ScenarioPage
          key={currentUser.id}
          playerId={currentUser.id}
          initialScene={initialScenarioScene}
          travelScene={travelScenarioScene?.scene ?? null}
          travelSceneId={travelScenarioScene?.id ?? null}
          onInitialSceneConsumed={clearInitialScenarioScene}
          onTravelSceneConsumed={clearTravelScenarioScene}
          onBackToMenu={backToMenu}
          onViewMap={openGameplayMap}
        />
        {isGameplayMapOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
            <Map
              mode="load"
              playerId={currentUser.id}
              closeLabel="Return to game"
              onClose={closeGameplayMap}
              onStartGameplay={ignoreMapStartGameplay}
              onLoadGame={handleGameplayTravel}
            />
          </div>
        )}
      </>
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
