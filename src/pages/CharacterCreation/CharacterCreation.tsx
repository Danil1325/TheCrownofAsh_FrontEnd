import { useMemo, useRef, useState } from 'react'
import '../../styles/game-ui.css'
import '../../styles/animations/carousel.css'
import './CharacterCreation.css'
import { ApiError } from '../../api/authApi'
import { createCharacter } from '../../api/characterApi'
import background from '../../assets/CharacterCreation/UI/CharacterCreationBackground.png'
import banner from '../../assets/CharacterCreation/UI/CreateYourCharacterBanner.png'
import leftArrow from '../../assets/CharacterCreation/UI/LeftArrow.png'
import rightArrow from '../../assets/CharacterCreation/UI/RightArrow.png'
import selectedFrame from '../../assets/CharacterCreation/UI/SelectedFrame.png'
import backButton from '../../assets/CharacterCreation/UI/BackButton.png'
import continueButton from '../../assets/CharacterCreation/UI/ConfirmButton.png'
import Attributes from '../../components/CharacterCreation/Attributes'
import { default as CharacterDisplayMenu } from '../../components/CharacterCreation/DisplayMenu'
import { classes, combineAttributes, races, type CharacterClass, type Race, wrapIndex } from './characterCreationData'
import type { CreatedCharacterIdentity } from './characterCreationData'

const MINIMUM_NAME_LENGTH = 2
const MAXIMUM_NAME_LENGTH = 40

type CharacterCreationProps = {
  onComplete: (character: CreatedCharacterIdentity) => void
}
type CreationStep = 'race' | 'class'
type CarouselItem = Race | CharacterClass
type CarouselMotion = 'center-to-left' | 'right-to-center' | 'enter-right' | 'enter-left' | 'left-to-center' | 'center-to-right'
type FrameState = 'visible' | 'entering' | 'leaving'

function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [step, setStep] = useState<CreationStep>('race')
  const [raceIndex, setRaceIndex] = useState(1)
  const [classIndex, setClassIndex] = useState(0)
  const [characterName, setCharacterName] = useState('')
  const [rotationDirection, setRotationDirection] = useState<-1 | 1 | null>(null)
  const [exitingCard, setExitingCard] = useState<{ item: CarouselItem; direction: -1 | 1 } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const saveInFlightRef = useRef(false)
  const selectedRace = races[raceIndex]
  const selectedClass = classes[classIndex]
  const attributes = useMemo(() => step === 'class' ? combineAttributes(selectedRace, selectedClass) : selectedRace.attributes, [step, selectedRace, selectedClass])
  const cards = step === 'race' ? races : classes
  const selectedIndex = step === 'race' ? raceIndex : classIndex
  const handleCreateCharacter = async () => {
    if (saveInFlightRef.current) return

    const name = characterName.trim()
    if (name.length < MINIMUM_NAME_LENGTH || name.length > MAXIMUM_NAME_LENGTH) {
      setSaveError(`Choose a name between ${MINIMUM_NAME_LENGTH} and ${MAXIMUM_NAME_LENGTH} characters.`)
      return
    }

    saveInFlightRef.current = true
    setSaveError('')
    setIsSaving(true)
    try {
      const character = await createCharacter({ name, race: selectedRace.raceType, classId: selectedClass.classId })
      onComplete({ name, race: selectedRace.name, className: selectedClass.name, playerId: character.playerId, characterId: character.characterId })
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.message : 'Unable to save your character. Please try again.')
    } finally {
      saveInFlightRef.current = false
      setIsSaving(false)
    }
  }
  const advanceStep = () => {
    if (step === 'race') setStep('class')
    else void handleCreateCharacter()
  }
  const move = (direction: -1 | 1) => {
    if (rotationDirection || isSaving) return

    setRotationDirection(direction)
    setExitingCard({
      item: cards[wrapIndex(selectedIndex - direction, cards.length)],
      direction,
    })
    const nextIndex = wrapIndex(selectedIndex + direction, cards.length)
    if (step === 'race') setRaceIndex(nextIndex)
    else setClassIndex(nextIndex)
    window.setTimeout(() => {
      setRotationDirection(null)
      setExitingCard(null)
    }, 520)
  }

  const motionFor = (position: 'left' | 'center' | 'right'): CarouselMotion | undefined => {
    if (rotationDirection === 1) {
      if (position === 'left') return 'center-to-left'
      if (position === 'center') return 'right-to-center'
      return 'enter-right'
    }
    if (rotationDirection === -1) {
      if (position === 'left') return 'enter-left'
      if (position === 'center') return 'left-to-center'
      return 'center-to-right'
    }
    return undefined
  }

  const frameFor = (position: 'left' | 'center' | 'right'): FrameState | undefined => {
    if (position === 'center') return rotationDirection ? 'entering' : 'visible'
    if ((rotationDirection === 1 && position === 'left') || (rotationDirection === -1 && position === 'right')) return 'leaving'
    return undefined
  }

  return (
    <main className="character-creation" style={{ backgroundImage: `url("${background}")` }}>
      <section className="character-creation__main" aria-label="Character creation">
        <img className="character-creation__banner" src={banner} alt="Create Your Character" />
        <section className="creation-carousel" aria-label={`${step} selection`}>
          <button className="game-button carousel-arrow carousel-arrow--left" type="button" aria-label="Previous" onClick={() => move(-1)} disabled={Boolean(rotationDirection) || isSaving}><img src={leftArrow} alt="" /></button>
          <div className={`carousel-cards${rotationDirection ? ` carousel-cards--rotating carousel-cards--${rotationDirection === 1 ? 'forward' : 'backward'}` : ''}`}>
            {exitingCard && <CarouselCard item={exitingCard.item} position="side" direction={exitingCard.direction === 1 ? 'left' : 'right'} motion={exitingCard.direction === 1 ? 'exit-left' : 'exit-right'} exiting />}
            <CarouselCard key={cards[wrapIndex(selectedIndex - 1, cards.length)].id} item={cards[wrapIndex(selectedIndex - 1, cards.length)]} position="side" direction="left" selectedFrame={frameFor('left') ? selectedFrame : undefined} frameState={frameFor('left')} motion={motionFor('left')} />
            <CarouselCard key={cards[selectedIndex].id} item={cards[selectedIndex]} position="center" direction="center" selectedFrame={selectedFrame} frameState={frameFor('center')} motion={motionFor('center')} />
            <CarouselCard key={cards[wrapIndex(selectedIndex + 1, cards.length)].id} item={cards[wrapIndex(selectedIndex + 1, cards.length)]} position="side" direction="right" selectedFrame={frameFor('right') ? selectedFrame : undefined} frameState={frameFor('right')} motion={motionFor('right')} />
          </div>
          <button className="game-button carousel-arrow carousel-arrow--right" type="button" aria-label="Next" onClick={() => move(1)} disabled={Boolean(rotationDirection) || isSaving}><img src={rightArrow} alt="" /></button>
        </section>
        <CharacterDisplayMenu race={selectedRace} characterClass={step === 'class' ? selectedClass : undefined} name={characterName} onNameChange={setCharacterName} />
        <div className={`creation-navigation creation-navigation--${step}`}>
          <button className="game-button creation-navigation__button creation-navigation__back" type="button" onClick={() => setStep('race')} disabled={step === 'race' || isSaving} aria-hidden={step === 'race'}><img src={backButton} alt="Back" /></button>
          <button className="game-button creation-navigation__button creation-navigation__continue" type="button" onClick={advanceStep} disabled={isSaving}><img src={continueButton} alt="Continue" /></button>
          {(saveError || isSaving) && (
            <p className={`creation-navigation__status${saveError ? ' creation-navigation__status--error' : ' creation-navigation__status--saving'}`} role={saveError ? 'alert' : 'status'} aria-live="polite">{saveError || 'Saving your character...'}</p>
          )}
        </div>
      </section>
      <Attributes attributes={attributes} />
    </main>
  )
}

function CarouselCard({ item, position, direction, selectedFrame: frame, frameState, motion, exiting = false }: { item: CarouselItem; position: 'side' | 'center'; direction: 'left' | 'center' | 'right'; selectedFrame?: string; frameState?: FrameState; motion?: CarouselMotion | 'exit-left' | 'exit-right'; exiting?: boolean }) {
  const image = 'selectionImage' in item ? item.selectionImage : item.image
  return <div className={`carousel-card carousel-card--${position} carousel-card--${direction}${motion ? ` carousel-motion carousel-motion--${motion}` : ''}${exiting ? ' carousel-card--exiting' : ''}`}><img className="carousel-card__image" src={image} alt={item.name} />{frame && <img className={`carousel-card__selected-frame${frameState ? ` carousel-frame carousel-frame--${frameState}` : ''}`} src={frame} alt="" aria-hidden="true" />}</div>
}

/* Legacy inline components retained temporarily in source history.
function DisplayMenu({ race, characterClass, name, onNameChange }: { race: Race; characterClass?: CharacterClass; name: string; onNameChange: (name: string) => void }) {
  const resistanceIcons: Record<ResistanceIcon, typeof Mountain> = { stone: Mountain, fire: Flame, ice: Snowflake, arcane: FlaskConical }
  return <section className="display-menu" style={{ backgroundImage: `url("${displayMenu}")` }} aria-label="Character summary">
    <div className="display-menu__portrait-wrap"><img className="display-menu__portrait" src={race.displayImage} alt={race.name} />{characterClass && <img className="display-menu__class-symbol" src={characterClass.symbol} alt={`${characterClass.name} symbol`} style={{ top: race.symbolPosition.top, left: race.symbolPosition.left, width: race.symbolPosition.size }} />}</div>
    <div className="display-menu__details">
      <DisplayField label="Name"><input value={name} onChange={(event) => onNameChange(event.target.value)} placeholder="Unnamed Hero" aria-label="Character name" /></DisplayField>
      <DisplayField label="Race"><span>{race.name}</span></DisplayField>
      <DisplayField label="Class"><span>{characterClass?.name ?? '—'}</span></DisplayField>
      <div className="display-menu__resistances"><strong>Resistances:</strong><span className="resistance-list">{race.resistances.map((resistance) => { const Icon = resistanceIcons[resistance.icon]; return <span className="resistance-item" key={resistance.icon}><Icon aria-hidden="true" /><b>{resistance.value}</b></span> })}</span></div>
      <p className="display-menu__description">{race.description}</p>
    </div>
  </section>
}

function DisplayField({ label, children }: { label: string; children: ReactNode }) {
  return <div className="display-field"><span className="display-field__label">{label}</span><div className="display-field__value" style={{ backgroundImage: `url("${textBox}")` }}>{children}</div></div>
}

function AttributesPanel({ attributes }: { attributes: Record<AttributeKey, number> }) {
  const derived = { 'Attack Damage': `${Math.round(attributes.strength / 7) + 5}-${Math.round(attributes.strength / 5) + 10}`, 'Dodge Chance': `${Math.round(attributes.dexterity / 20)}%`, 'Mana Pool': `${Math.round(attributes.intelligence * 0.65)}`, 'Escape Chance': `${Math.max(2, Math.round(attributes.dexterity / 25))}%` }
  return <aside className="attributes-panel" style={{ backgroundImage: `url("${attributesMenu}")` }} aria-label="Attributes">
    <div className="attribute-bars">{(Object.keys(attributeLabels) as AttributeKey[]).map((key) => <div className="attribute-row" key={key}><img className="attribute-row__asset" src={attributeBarImages[key]} alt="" /><div className="attribute-row__fill" style={{ width: `${attributes[key]}%` }} /><span className="attribute-row__label">{attributeLabels[key]}</span></div>)}</div>
    <img className="attributes-panel__blank-bar" src={blankBar} alt="" />
    <div className="derived-stats">{Object.entries(derived).map(([label, value]) => <div className="derived-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
  </aside>
}
*/

export default CharacterCreation
