import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../../api/authApi'
import { getPlayerRoute, travelToLocation } from '../../api/locationApi'
import RaceLocationRoute from '../../components/RaceLocationRoute/RaceLocationRoute'
import type { LocationRoute } from '../../types/location'
import type { StoryScene } from '../../types/scenario'
import mapImage from '../../assets/Map/CrownOfAshMap.png'
import bonePeaks from '../../assets/Map/The_Bone_Peaks.png'
import whisperingWoods from '../../assets/Map/Whispering_Woods.png'
import herosOverlook from '../../assets/Map/Heros_Overlook.png'
import misthavenPort from '../../assets/Map/Misthaven_Port.png'
import ashtonia from '../../assets/Map/Ashtonia.png'
import oakhaven from '../../assets/Map/Oakheaven.png'
import darkstormKeep from '../../assets/Map/Darkstorm_Keep.png'
import bonePeaksButton from '../../assets/Map/TheBonePeaksButton.png'
import whisperingWoodsButton from '../../assets/Map/WhisperingWoodsButton.png'
import herosOverlookButton from '../../assets/Map/HerosOverlookButton.png'
import misthavenPortButton from '../../assets/Map/MisthavenPortButton.png'
import ashtoniaButton from '../../assets/Map/AshtoniaButton.png'
import oakhavenButton from '../../assets/Map/OakhavenButton.png'
import darkstormKeepButton from '../../assets/Map/DarkstormKeepButton.png'
import continueButton from '../../assets/Buttons/Continue.png'
import './Map.css'

type MapMode = 'new' | 'load'
type Area = { id: string; locationId: number; name: string; image: string; buttonImage: string; x: number; y: number; width: number }
type RouteState = { playerId: number | null; route: LocationRoute[] }
const areas: Area[] = [
  { id: 'bone-peaks', locationId: 6, name: 'The Bone Peaks', image: bonePeaks, buttonImage: bonePeaksButton, x: 43, y: 20, width: 18 },
  { id: 'whispering-woods', locationId: 7, name: 'Whispering Woods', image: whisperingWoods, buttonImage: whisperingWoodsButton, x: 27, y: 42, width: 18 },
  { id: 'heros-overlook', locationId: 3, name: "Hero's Overlook", image: herosOverlook, buttonImage: herosOverlookButton, x: 37, y: 67, width: 19 },
  { id: 'misthaven-port', locationId: 4, name: 'Misthaven Port', image: misthavenPort, buttonImage: misthavenPortButton, x: 69, y: 75, width: 19},
  { id: 'ashtonia', locationId: 1, name: 'Ashtonia', image: ashtonia, buttonImage: ashtoniaButton, x: 86, y: 25, width: 17 },
  { id: 'oakhaven', locationId: 5, name: 'Oakhaven', image: oakhaven, buttonImage: oakhavenButton, x: 63, y: 45, width: 17 },
  { id: 'darkstorm-keep', locationId: 2, name: 'Darkstorm Keep', image: darkstormKeep, buttonImage: darkstormKeepButton, x: 72, y: 24, width: 15 },
]

type MapProps = {
  mode: MapMode
  playerId: number
  closeLabel?: string
  onClose: () => void
  onStartGameplay: () => void
  onLoadGame: (scene: StoryScene) => void
}

function Map({ mode, playerId, closeLabel = 'Return to menu', onClose, onStartGameplay, onLoadGame }: MapProps) {
  const [activeArea, setActiveArea] = useState<Area | null>(null)
  const [routeState, setRouteState] = useState<RouteState>({ playerId: null, route: [] })
  const [isTraveling, setIsTraveling] = useState(false)
  const [travelError, setTravelError] = useState<string | null>(null)
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState(false)
  const isTravelingRef = useRef(false)
  const background = activeArea?.image ?? mapImage
  const isLoadMode = mode === 'load'
  const route = routeState.playerId === playerId ? routeState.route : []

  useEffect(() => {
    if (!isLoadMode) {
      return
    }

    let isCurrent = true

    getPlayerRoute(playerId)
      .then((playerRoute) => {
        if (isCurrent) {
          setRouteState({ playerId, route: playerRoute })
        }
      })
      .catch(() => {
        if (isCurrent) {
          setRouteState({ playerId, route: [] })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [isLoadMode, playerId])

  const selectArea = (area: Area) => {
    setTravelError(null)
    setIsRouteDrawerOpen(false)
    setActiveArea(area)
  }

  const returnToMap = () => {
    setTravelError(null)
    setIsRouteDrawerOpen(false)
    setActiveArea(null)
  }

  const handleAreaAction = async () => {
    if (!activeArea) return

    if (!isLoadMode) {
      onStartGameplay()
      return
    }

    if (isTravelingRef.current) return

    isTravelingRef.current = true
    setIsTraveling(true)
    setTravelError(null)

    try {
      const result = await travelToLocation(playerId, activeArea.locationId)
      onLoadGame(result.currentScene)
    } catch (error) {
      setTravelError(
        error instanceof ApiError
          ? error.message
          : 'Unable to travel to this location. Please try again.',
      )
      isTravelingRef.current = false
      setIsTraveling(false)
    }
  }

  return (
    <main
      className="world-map"
      data-map-mode={mode}
      data-player-id={isLoadMode ? playerId : undefined}
      style={{ backgroundImage: `url("${background}")` }}
    >
      <button className="map-return" type="button" onClick={onClose} disabled={isTraveling}>{closeLabel}</button>
      {!activeArea && <section className="map-locations" aria-label={isLoadMode ? 'Choose a saved-game location' : 'Choose a starting location'}>{areas.map((area) => <button key={area.id} className="map-location" aria-label={area.name} data-location-id={area.locationId} style={{ left: `${area.x}%`, top: `${area.y}%`, width: `${area.width}%` }} type="button" onClick={() => selectArea(area)}><img src={area.buttonImage} alt="" /></button>)}</section>}
      {isLoadMode && !activeArea && (
        <aside className={`map-route-drawer${isRouteDrawerOpen ? ' map-route-drawer--open' : ''}`} aria-label="Player route">
          <button
            className="map-route-toggle"
            type="button"
            aria-controls="map-route-drawer-content"
            aria-expanded={isRouteDrawerOpen}
            onClick={() => setIsRouteDrawerOpen((isOpen) => !isOpen)}
          >
            <span>Location Route</span>
            <span className="map-route-toggle-state" aria-hidden="true">
              {isRouteDrawerOpen ? 'Hide' : 'Show'}
            </span>
          </button>
          {isRouteDrawerOpen && (
            <div id="map-route-drawer-content" className="map-route-drawer-content">
              <RaceLocationRoute route={route} />
            </div>
          )}
        </aside>
      )}
      {activeArea && (
        <section className="area-card" aria-busy={isTraveling}>
          <span className="map-caption">LOCATION SELECTED</span>
          <h2>{activeArea.name}</h2>
          <p>{isLoadMode ? 'Travel to this location through your current story progress.' : 'Continue into this region and begin your next chapter.'}</p>
          {isLoadMode ? (
            <button
              className="map-travel-button"
              type="button"
              disabled={isTraveling}
              aria-busy={isTraveling}
              onClick={handleAreaAction}
            >
              {isTraveling ? 'Traveling...' : 'Travel'}
            </button>
          ) : (
            <button className="continue-button" type="button" onClick={handleAreaAction}>
              <img src={continueButton} alt="Continue" />
            </button>
          )}
          {travelError && (
            <p className="map-travel-error" role="alert" aria-live="polite">
              {travelError}
            </p>
          )}
          {isTraveling && (
            <p className="map-travel-status" role="status" aria-live="polite">
              Awaiting the road ahead...
            </p>
          )}
          <button className="back-map" type="button" onClick={returnToMap} disabled={isTraveling}>Back to map</button>
        </section>
      )}
    </main>
  )
}

export default Map
