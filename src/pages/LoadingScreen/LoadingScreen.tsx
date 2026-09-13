import { useCallback, useEffect, useRef, useState } from 'react'
import './LoadingScreen.css'
import background from '../../assets/Loading/Loading Page Background.png'
import dividerStar from '../../assets/Loading/Loading Divider Star.png'
import loadingSound from '../../assets/Loading/Loading Sound Effect.mp3'

const LOADING_DURATION_MS = 13000
const PAGE_TRANSITION_MS = 700

type LoadingScreenProps = {
  onComplete?: () => void
  musicVolume: number
}

function OrnamentStar() {
  return (
    <svg className="ornament-star" viewBox="0 0 54 54" aria-hidden="true">
      <path d="M27 2 32.5 21.5 52 27l-19.5 5.5L27 52l-5.5-19.5L2 27l19.5-5.5Z" fill="#d9a855" stroke="#2d1a10" strokeWidth="3" strokeLinejoin="round" />
      <path d="M27 9 30.3 23.7 45 27l-14.7 3.3L27 45l-3.3-14.7L9 27l14.7-3.3Z" fill="#f4d58e" stroke="#70421f" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="27" cy="27" r="4" fill="#6b2b1b" stroke="#2d1a10" strokeWidth="1.5" />
    </svg>
  )
}

function LoadingScreen({ onComplete, musicVolume }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    void audio.play()
      .then(() => setIsSoundEnabled(true))
      .catch(() => setIsSoundEnabled(false))
  }, [])

  useEffect(() => {
    const animationStart = window.setTimeout(() => setProgress(100), 100)
    const exitStart = onComplete
      ? window.setTimeout(() => setIsExiting(true), LOADING_DURATION_MS + 100)
      : undefined
    const completion = onComplete
      ? window.setTimeout(onComplete, LOADING_DURATION_MS + PAGE_TRANSITION_MS + 100)
      : undefined

    return () => {
      window.clearTimeout(animationStart)
      if (exitStart) window.clearTimeout(exitStart)
      if (completion) window.clearTimeout(completion)
    }
  }, [onComplete])

  useEffect(() => {
    const audio = new Audio(loadingSound)
    audio.loop = true
    audio.volume = musicVolume / 100
    audio.preload = 'auto'
    audioRef.current = audio

    playSound()
    window.addEventListener('pointerdown', playSound, { once: true })

    return () => {
      window.removeEventListener('pointerdown', playSound)
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
    }
  }, [musicVolume, playSound])

  useEffect(() => {
    if (!isExiting) return

    const audio = audioRef.current
    if (!audio) return

    const initialVolume = audio.volume
    const fadeStartedAt = window.performance.now()
    let frameId = 0

    const fadeOut = (now: number) => {
      const elapsed = now - fadeStartedAt
      const progress = Math.min(elapsed / PAGE_TRANSITION_MS, 1)
      audio.volume = initialVolume * (1 - progress)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(fadeOut)
      }
    }

    frameId = window.requestAnimationFrame(fadeOut)
    return () => window.cancelAnimationFrame(frameId)
  }, [isExiting])

  return (
    <main
      className={`loading-screen${isExiting ? ' loading-screen--exiting' : ''}`}
      style={{ backgroundImage: `url("${background}")` }}
      aria-label="Loading game"
      onPointerDown={playSound}
    >
      <section className="loading-area" aria-label="Loading progress">
        <h2 className="loading-title">LOADING...</h2>
        <div className="loading-row">
          <OrnamentStar />
          <div className="loading-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Game loading progress">
            <div className="loading-bar__fill" style={{ width: `${progress}%` }} />
          </div>
          <OrnamentStar />
        </div>
        <div className="loading-footer">
          <p className="loading-subtitle">Preparing your adventure...</p>
          <div className="loading-divider" aria-hidden="true">
            <span>••••</span>
            <img src={dividerStar} alt="" />
            <span>••••</span>
          </div>
        </div>
        {!isSoundEnabled && (
          <button className="enable-sound-button" type="button" onClick={playSound}>
            Pornește sunetul
          </button>
        )}
      </section>
    </main>
  )
}

export default LoadingScreen
