import { useEffect } from 'react'
import './OptionsMenu.css'

import optionsBackground from '../../assets/Options/Options Menu Background.png'
import optionsFrame from '../../assets/Options/Options Menu Frame.png'

type OptionsMenuProps = {
  onClose: () => void
}

function OptionsMenu({ onClose }: OptionsMenuProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="options-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Options menu"
      onClick={onClose}
    >
      <div className="options-menu" onClick={(event) => event.stopPropagation()}>
        <img className="options-menu-background" src={optionsBackground} alt="" aria-hidden="true" />
        <img className="options-menu-frame" src={optionsFrame} alt="" aria-hidden="true" />
      </div>
    </div>
  )
}

export default OptionsMenu
