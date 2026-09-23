import { Home, Loader2, RotateCcw, Swords } from 'lucide-react'
import './CharacterGate.css'

export type CharacterGateStatus = 'loading' | 'no-character' | 'error'

type CharacterGateProps = {
  status: CharacterGateStatus
  /** Overrides the default message (used for the error detail). */
  message?: string
  onRetry?: () => void
  onCreateCharacter?: () => void
  onBackToMenu?: () => void
}

const DEFAULT_MESSAGES: Record<Exclude<CharacterGateStatus, 'loading'>, string> = {
  'no-character':
    'No character found. Start a new game to forge your hero before resuming your adventure.',
  error: 'Unable to load your character at the moment.',
}

function CharacterGate({
  status,
  message,
  onRetry,
  onCreateCharacter,
  onBackToMenu,
}: CharacterGateProps) {
  if (status === 'loading') {
    return (
      <main className="character-gate" role="status">
        <section className="character-gate-card">
          <Loader2 className="character-gate-spinner" size={26} aria-hidden="true" />
          <p className="character-gate-text">Loading your character…</p>
        </section>
      </main>
    )
  }

  return (
    <main className="character-gate" role="alert">
      <section className={`character-gate-card character-gate-card--${status}`}>
        {status === 'no-character' && (
          <Swords className="character-gate-icon" size={30} aria-hidden="true" />
        )}
        <p className="character-gate-text">{message ?? DEFAULT_MESSAGES[status]}</p>
        {(status === 'no-character' ? onCreateCharacter != null : onRetry != null) && (
          <div className="character-gate-actions">
            {status === 'no-character' && onCreateCharacter != null && (
              <button type="button" className="character-gate-button" onClick={onCreateCharacter}>
                <Swords size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>New Game</span>
              </button>
            )}
            {status === 'error' && onRetry != null && (
              <button type="button" className="character-gate-button" onClick={onRetry}>
                <RotateCcw size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>Try again</span>
              </button>
            )}
            {onBackToMenu != null && (
              <button type="button" className="character-gate-button" onClick={onBackToMenu}>
                <Home size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>Back to menu</span>
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default CharacterGate