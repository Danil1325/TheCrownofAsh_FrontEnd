import { useState } from 'react'
import mapImage from '../../assets/Map/CrownOfAshMap.png'
import bonePeaks from '../../assets/Map/The_Bone_Peaks.png'
import whisperingWoods from '../../assets/Map/Whispering_Woods.png'
import herosOverlook from '../../assets/Map/Heros_Overlook.png'
import misthavenPort from '../../assets/Map/Misthaven_Port.png'
import ashtonia from '../../assets/Map/Ashtonia.png'
import oakhaven from '../../assets/Map/Oakheaven.png'
import darkstormKeep from '../../assets/Map/Darkstorm_Keep.png'
import continueButton from '../../assets/Buttons/Continue.png'
import './Map.css'

type Area = { id: string; name: string; image: string; x: number; y: number; width: number; height: number }
const areas: Area[] = [
  { id: 'bone-peaks', name: 'The Bone Peaks', image: bonePeaks, x: 43, y: 24, width: 22, height: 11 },
  { id: 'whispering-woods', name: 'Whispering Woods', image: whisperingWoods, x: 29, y: 47, width: 20, height: 11 },
  { id: 'heros-overlook', name: "Hero's Overlook", image: herosOverlook, x: 42, y: 74, width: 20, height: 10 },
  { id: 'misthaven-port', name: 'Misthaven Port', image: misthavenPort, x: 68, y: 82, width: 22, height: 10 },
  { id: 'ashtonia', name: 'Ashtonia', image: ashtonia, x: 86, y: 26, width: 16, height: 11 },
  { id: 'oakhaven', name: 'Oakhaven', image: oakhaven, x: 60, y: 51, width: 18, height: 10 },
  { id: 'darkstorm-keep', name: 'Darkstorm Keep', image: darkstormKeep, x: 68, y: 37, width: 21, height: 11 },
]

type MapProps = { onClose: () => void }

function Map({ onClose }: MapProps) {
  const [activeArea, setActiveArea] = useState<Area | null>(null)
  const background = activeArea?.image ?? mapImage

  return (
    <main className="world-map" style={{ backgroundImage: `url("${background}")` }}>
      <button className="map-return" type="button" onClick={onClose}>Return to menu</button>
      {!activeArea && <section className="map-locations" aria-label="Choose a location">{areas.map((area) => <button key={area.id} className="map-location" aria-label={area.name} style={{ left: `${area.x}%`, top: `${area.y}%`, width: `${area.width}%`, height: `${area.height}%` }} type="button" onClick={() => setActiveArea(area)} />)}</section>}
      {activeArea && <section className="area-card"><span className="map-caption">LOCATION SELECTED</span><h2>{activeArea.name}</h2><p>Continue into this region and begin your next chapter.</p><button className="continue-button" type="button"><img src={continueButton} alt="Continue" /></button><button className="back-map" type="button" onClick={() => setActiveArea(null)}>Back to map</button></section>}
    </main>
  )
}

export default Map
