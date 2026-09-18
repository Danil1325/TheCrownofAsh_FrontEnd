import { useState } from 'react'
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

type Area = { id: string; name: string; image: string; buttonImage: string; x: number; y: number; width: number }
const areas: Area[] = [
  { id: 'bone-peaks', name: 'The Bone Peaks', image: bonePeaks, buttonImage: bonePeaksButton, x: 43, y: 20, width: 18 },
  { id: 'whispering-woods', name: 'Whispering Woods', image: whisperingWoods, buttonImage: whisperingWoodsButton, x: 27, y: 42, width: 18 },
  { id: 'heros-overlook', name: "Hero's Overlook", image: herosOverlook, buttonImage: herosOverlookButton, x: 37, y: 67, width: 19 },
  { id: 'misthaven-port', name: 'Misthaven Port', image: misthavenPort, buttonImage: misthavenPortButton, x: 69, y: 75, width: 19},
  { id: 'ashtonia', name: 'Ashtonia', image: ashtonia, buttonImage: ashtoniaButton, x: 86, y: 25, width: 17 },
  { id: 'oakhaven', name: 'Oakhaven', image: oakhaven, buttonImage: oakhavenButton, x: 63, y: 45, width: 17 },
  { id: 'darkstorm-keep', name: 'Darkstorm Keep', image: darkstormKeep, buttonImage: darkstormKeepButton, x: 72, y: 24, width: 15 },
]

type MapProps = { onClose: () => void; onStartGameplay: () => void }

function Map({ onClose, onStartGameplay }: MapProps) {
  const [activeArea, setActiveArea] = useState<Area | null>(null)
  const background = activeArea?.image ?? mapImage
  return (
    <main className="world-map" style={{ backgroundImage: `url("${background}")` }}>
      <button className="map-return" type="button" onClick={onClose}>Return to menu</button>
      {!activeArea && <section className="map-locations" aria-label="Choose a location">{areas.map((area) => <button key={area.id} className="map-location" aria-label={area.name} style={{ left: `${area.x}%`, top: `${area.y}%`, width: `${area.width}%` }} type="button" onClick={() => setActiveArea(area)}><img src={area.buttonImage} alt="" /></button>)}</section>}
      {activeArea && <section className="area-card"><span className="map-caption">LOCATION SELECTED</span><h2>{activeArea.name}</h2><p>Continue into this region and begin your next chapter.</p><button className="continue-button" type="button" onClick={activeArea.id === 'heros-overlook' ? onStartGameplay : undefined}><img src={continueButton} alt="Continue" /></button><button className="back-map" type="button" onClick={() => setActiveArea(null)}>Back to map</button></section>}
    </main>
  )
}

export default Map
