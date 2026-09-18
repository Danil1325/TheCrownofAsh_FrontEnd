import { useCallback, useEffect, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import buttonPressSound from './assets/Button Press.mp3'
import MockGameplay from './pages/MockGameplay/MockGameplay'
import { getCurrentUser, logout } from './api/authApi'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [authenticationPage, setAuthenticationPage] = useState<'login' | 'signup'>('login')
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

  // On load, ask the backend whether the HttpOnly session cookie (if any) is
  // still valid — without this, a real login would appear to work but not
  // survive a page refresh. Rejects (401, no useful body) simply means "not
  // logged in", not an error worth showing.
  useEffect(() => {
    let isMounted = true
    getCurrentUser()
      .then(() => {
        if (isMounted) setIsAuthenticated(true)
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
          onSignUp={() => { setIsAuthenticated(true); setIsInitialLoading(true) }}
          onBackToLogin={() => setAuthenticationPage('login')}
        />
      )
    }

    return (
      <Login
        onLogin={() => { setIsAuthenticated(true); setIsInitialLoading(true) }}
        onCreateAccount={() => setAuthenticationPage('signup')}
      />
    )
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
        onLogout={handleLogout}
      />
    </div>
  )
}

export default App
