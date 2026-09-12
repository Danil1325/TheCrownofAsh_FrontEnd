import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import './OptionsMenu.css'
import '../../styles/animations/overlay.css'
import '../../styles/game-ui.css'

import optionsBackground from '../../assets/Options/Options Menu Background.png'
import optionsFrame from '../../assets/Options/Options Menu Frame.png'
import optionsInscription from '../../assets/Options/Options Inscription.png'
import exitIcon from '../../assets/Icons/Exit Icon.png'
import soundBarDisabled from '../../assets/Options/Sound Bar Disabled.png'
import soundBarEnabled from '../../assets/Options/Sound Bar Enabled.png'
import soundBarSwitcher from '../../assets/Options/Sound Bar Swicher.png'
import fullscreenOn from '../../assets/Options/On.png'
import fullscreenOff from '../../assets/Options/Off.png'

type OptionsMenuProps = {
  onClose: () => void
}

type VolumeSliderProps = {
  label: string
  value: number
  onChange: (value: number) => void
}

function VolumeSlider({ label, value, onChange }: VolumeSliderProps) {
  const updateFromPointer = (clientX: number, element: HTMLElement) => {
    const bounds = element.getBoundingClientRect()
    const nextValue = ((clientX - bounds.left) / bounds.width) * 100
    onChange(Math.max(0, Math.min(100, nextValue)))
  }

  return (
    <div className="volume-setting">
      <div className="volume-label">{label}</div>
      <div
        className="volume-slider"
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        tabIndex={0}
        style={{ '--volume': `${value}%` } as CSSProperties}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          updateFromPointer(event.clientX, event.currentTarget)
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            updateFromPointer(event.clientX, event.currentTarget)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            onChange(Math.max(0, value - 5))
          }
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            onChange(Math.min(100, value + 5))
          }
        }}
      >
        <img className="volume-bar volume-bar-disabled" src={soundBarDisabled} alt="" />
        <img className="volume-bar volume-bar-enabled" src={soundBarEnabled} alt="" />
        <img className="volume-switcher" src={soundBarSwitcher} alt="" aria-hidden="true" />
      </div>
    </div>
  )
}

function OptionsMenu({ onClose }: OptionsMenuProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [musicVolume, setMusicVolume] = useState(70)
  const [sfxVolume, setSfxVolume] = useState(70)
  const [isFullscreenOn, setIsFullscreenOn] = useState(true)
  const [areTutorialHintsOn, setAreTutorialHintsOn] = useState(true)

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
        <div className="options-settings">
          <div className="volume-settings">
            <VolumeSlider label="Music" value={musicVolume} onChange={setMusicVolume} />
            <VolumeSlider label="Sound FX" value={sfxVolume} onChange={setSfxVolume} />
          </div>

          <div className="fullscreen-setting">
            <div className="fullscreen-label">Fullscreen</div>
            <button
              className="game-button fullscreen-switch"
              type="button"
              aria-label={`Fullscreen ${isFullscreenOn ? 'On' : 'Off'}`}
              aria-pressed={isFullscreenOn}
              onClick={() => setIsFullscreenOn((isOn) => !isOn)}
            >
              <img src={isFullscreenOn ? fullscreenOn : fullscreenOff} alt="" />
            </button>
          </div>

          <div className="tutorial-hints-setting">
            <div className="fullscreen-label">Tutorial Hints</div>
            <button
              className="game-button fullscreen-switch"
              type="button"
              aria-label={`Tutorial Hints ${areTutorialHintsOn ? 'On' : 'Off'}`}
              aria-pressed={areTutorialHintsOn}
              onClick={() => setAreTutorialHintsOn((isOn) => !isOn)}
            >
              <img src={areTutorialHintsOn ? fullscreenOn : fullscreenOff} alt="" />
            </button>
          </div>
        </div>
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
