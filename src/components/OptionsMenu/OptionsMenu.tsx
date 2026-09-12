import { useCallback, useEffect, useState } from 'react'
import './OptionsMenu.css'
import '../../styles/animations/overlay.css'
import '../../styles/game-ui.css'

import optionsBackground from '../../assets/Options/Options Menu Background.png'
import optionsFrame from '../../assets/Options/Options Menu Frame.png'
import optionsInscription from '../../assets/Options/Options Inscription.png'
import exitIcon from '../../assets/Icons/Exit Icon.png'

type OptionsMenuProps = {
  onClose: () => void
}

function OptionsMenu({ onClose }: OptionsMenuProps) {
  const [isClosing, setIsClosing] = useState(false)

  const closeMenu = useCallback(() => {
    if (isClosing) return

    setIsClosing(true)
    window.setTimeout(onClose, 260)
  }, [isClosing, onClose])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [closeMenu])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Options menu"
      className={`options-overlay ui-overlay${isClosing ? ' ui-overlay--closing' : ''}`}
    >
      <div
        className={`options-menu ui-panel${isClosing ? ' ui-panel--closing' : ''}`}
      >
        <img className="options-menu-background" src={optionsBackground} alt="" aria-hidden="true" />
        <img className="options-menu-frame" src={optionsFrame} alt="" aria-hidden="true" />
        <img className="options-inscription" src={optionsInscription} alt="Options" />
        <button
          className="game-button options-exit-button"
          type="button"
          aria-label="Exit options menu"
          onClick={closeMenu}
        >
          <img src={exitIcon} alt="" />
        </button>
      </div>
    </div>
  )
}

export default OptionsMenu
