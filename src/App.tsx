import { useCallback, useEffect, useRef, useState } from 'react'
import MainMenu from './pages/MainMenu/MainMenu'
import SkillTreePage from './pages/SkillTree/SkillTreePage'
import LoadingScreen from './pages/LoadingScreen/LoadingScreen'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import buttonPressSound from './assets/Button Press.mp3'
import CharacterCreation from './pages/CharacterCreation/CharacterCreation'
import type { CreatedCharacterIdentity } from './pages/CharacterCreation/CharacterCreation'
import ScenarioPage from './pages/Scenario/ScenarioPage'
import Map from './pages/Map/Map'
import { getCurrentUser, logout } from './api/authApi'
import type { CurrentUser } from './api/authApi'
import type { StoryScene } from './types/scenario'
import type {
  ActiveSkillTreeCharacterInput,
  CharacterClass as SkillTreeCharacterClass,
  Race as SkillTreeRace,
} from './features/skill-tree/types/skillTree'

type ApplicationPage = 'main-menu' | 'skill-tree'

const CHARACTER_CREATION_RACE_TO_SKILL_TREE_RACE: Record<string, SkillTreeRace> = {
  Human: 'Human',
  Orc: 'Orc',
  Dwarf: 'Dwarf',
  Elf: 'Elf',
}

const CHARACTER_CREATION_CLASS_TO_SKILL_TREE_CLASS: Record<
  string,
  SkillTreeCharacterClass
> = {
  Warrior: 'Warrior',
  Bard: 'Bard',
  Magician: 'Mage',
  Healer: 'Healer',
}

function toSkillTreeCharacter(
  character: CreatedCharacterIdentity,
): ActiveSkillTreeCharacterInput | null {
  const race = CHARACTER_CREATION_RACE_TO_SKILL_TREE_RACE[character.race]
  const className =
    CHARACTER_CREATION_CLASS_TO_SKILL_TREE_CLASS[character.className]

  if (!race || !className) {
    return null
  }

  return { race, className }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [activeCharacter, setActiveCharacter] = useState<CreatedCharacterIdentity | null>(null)
  const [activeSkillTreeCharacter, setActiveSkillTreeCharacter] =
    useState<ActiveSkillTreeCharacterInput | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [authenticationPage, setAuthenticationPage] = useState<'login' | 'signup'>('login')
  const [applicationPage, setApplicationPage] = useState<ApplicationPage>('main-menu')
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
  const openGameplayMap = useCallback(() => setIsGameplayMapOpen(true), [])
  const closeGameplayMap = useCallback(() => setIsGameplayMapOpen(false), [])
  const handleGameplayTravel = useCallback((scene: StoryScene) => {
    nextTravelScenarioSceneId.current += 1
    setTravelScenarioScene({ id: nextTravelScenarioSceneId.current, scene })
    setIsGameplayMapOpen(false)
  }, [])
  const ignoreMapStartGameplay = useCallback(() => undefined, [])
  const backToMenu = useCallback(() => {
    setInitialScenarioScene(null)
    setTravelScenarioScene(null)
    setIsGameplayMapOpen(false)
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
      setActiveCharacter(null)
      setInitialScenarioScene(null)
      setTravelScenarioScene(null)
      setIsGameplayMapOpen(false)
      setActiveSkillTreeCharacter(null)
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
            setActiveCharacter(null)
            setActiveSkillTreeCharacter(null)
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
          setActiveCharacter(null)
          setActiveSkillTreeCharacter(null)
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
        <SkillTreePage
          activeCharacter={activeSkillTreeCharacter ?? undefined}
          onBackToMainMenu={() => setApplicationPage('main-menu')}
        />
      </div>
    )
  }

  const activePlayerId = activeCharacter?.playerId ?? (currentUser?.id ?? 0)

  if (gameState === 'character-creation') {
    return (
      <CharacterCreation
        onComplete={(character) => {
          setActiveCharacter(character)
          setActiveSkillTreeCharacter(toSkillTreeCharacter(character))
          setGameState('playing')
        }}
      />
    )
  }

  if (gameState === 'playing') {
    return currentUser ? (
      <>
        <ScenarioPage
          key={currentUser.id}
          playerId={activePlayerId}
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
              playerId={activePlayerId}
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
        playerId={activePlayerId}
        musicVolume={musicVolume}
        sfxVolume={sfxVolume}
        onMusicVolumeChange={setMusicVolume}
        onSfxVolumeChange={setSfxVolume}
        onPlayButtonSound={playButtonSound}
        onNewGame={startNewGame}
        onLoadGame={startGameplay}
        onOpenSkills={() => setApplicationPage('skill-tree')}
        onLogout={handleLogout}
      />
    </div>
  ) : null
}

export default App
