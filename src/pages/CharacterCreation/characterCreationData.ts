import elfSelection from '../../assets/CharacterCreation/Rase/SelectionScreen/Elf.png'
import humanSelection from '../../assets/CharacterCreation/Rase/SelectionScreen/Human.png'
import dwarfSelection from '../../assets/CharacterCreation/Rase/SelectionScreen/Dwarf.png'
import orcSelection from '../../assets/CharacterCreation/Rase/SelectionScreen/Orc.png'
import elfDisplay from '../../assets/CharacterCreation/Rase/DisplayMenu/Elf.png'
import humanDisplay from '../../assets/CharacterCreation/Rase/DisplayMenu/Human.png'
import dwarfDisplay from '../../assets/CharacterCreation/Rase/DisplayMenu/Dwarf.png'
import orcDisplay from '../../assets/CharacterCreation/Rase/DisplayMenu/Orc.png'
import warriorCard from '../../assets/CharacterCreation/Class/Warrior.png'
import bardCard from '../../assets/CharacterCreation/Class/Bard.png'
import magicianCard from '../../assets/CharacterCreation/Class/Magician.png'
import healerCard from '../../assets/CharacterCreation/Class/Healer.png'
import warriorSymbol from '../../assets/CharacterCreation/Class/ClassSymbols/Warrior.png'
import bardSymbol from '../../assets/CharacterCreation/Class/ClassSymbols/Bard.png'
import magicianSymbol from '../../assets/CharacterCreation/Class/ClassSymbols/Magician.png'
import healerSymbol from '../../assets/CharacterCreation/Class/ClassSymbols/Healer.png'

export type AttributeKey = 'health' | 'strength' | 'dexterity' | 'intelligence' | 'charisma'
export type AttributeValues = Record<AttributeKey, number>
export type ResistanceIcon = 'stone' | 'fire' | 'ice' | 'arcane'
export type Race = { id: string; name: string; selectionImage: string; displayImage: string; attributes: AttributeValues; resistances: Array<{ icon: ResistanceIcon; value: string }>; description: string; symbolPosition: { top: string; left: string; size: string } }
export type CharacterClass = { id: string; name: string; image: string; symbol: string; attributes: Partial<AttributeValues> }

export const races: Race[] = [
  { id: 'human', name: 'Human', selectionImage: humanSelection, displayImage: humanDisplay, attributes: { health: 72, strength: 55, dexterity: 52, intelligence: 50, charisma: 58 }, resistances: [{ icon: 'fire', value: '5%' }, { icon: 'ice', value: '8%' }, { icon: 'arcane', value: '10%' }, { icon: 'stone', value: '6%' }], description: 'Versatile and determined, humans adapt quickly and find strength in every challenge.', symbolPosition: { top: '7%', left: '50%', size: '15%' } },
  { id: 'elf', name: 'Elf', selectionImage: elfSelection, displayImage: elfDisplay, attributes: { health: 64, strength: 42, dexterity: 78, intelligence: 68, charisma: 62 }, resistances: [{ icon: 'stone', value: '25%' }, { icon: 'fire', value: '5%' }, { icon: 'ice', value: '15%' }, { icon: 'arcane', value: '13%' }], description: 'An innate leader with keen senses, elegant movement, and a gift for precision.', symbolPosition: { top: '7%', left: '50%', size: '15%' } },
  { id: 'dwarf', name: 'Dwarf', selectionImage: dwarfSelection, displayImage: dwarfDisplay, attributes: { health: 88, strength: 76, dexterity: 35, intelligence: 45, charisma: 38 }, resistances: [{ icon: 'stone', value: '30%' }, { icon: 'fire', value: '18%' }, { icon: 'ice', value: '8%' }, { icon: 'arcane', value: '10%' }], description: 'Stout and unyielding, dwarves endure hardship and answer danger with raw power.', symbolPosition: { top: '7%', left: '50%', size: '14%' } },
  { id: 'orc', name: 'Orc', selectionImage: orcSelection, displayImage: orcDisplay, attributes: { health: 94, strength: 86, dexterity: 42, intelligence: 28, charisma: 34 }, resistances: [{ icon: 'stone', value: '35%' }, { icon: 'fire', value: '12%' }, { icon: 'ice', value: '5%' }, { icon: 'arcane', value: '8%' }], description: 'Ferocious and resilient, orcs turn overwhelming force into a fighting advantage.', symbolPosition: { top: '7%', left: '50%', size: '16%' } },
]

export const classes: CharacterClass[] = [
  { id: 'warrior', name: 'Warrior', image: warriorCard, symbol: warriorSymbol, attributes: { health: 6, strength: 14, dexterity: 3 } },
  { id: 'bard', name: 'Bard', image: bardCard, symbol: bardSymbol, attributes: { charisma: 22, dexterity: 10, intelligence: 8 } },
  { id: 'magician', name: 'Magician', image: magicianCard, symbol: magicianSymbol, attributes: { intelligence: 26, charisma: 8, health: -6 } },
  { id: 'healer', name: 'Healer', image: healerCard, symbol: healerSymbol, attributes: { intelligence: 18, charisma: 12, health: 6 } },
]

export const attributeLabels: Record<AttributeKey, string> = { health: 'Health', strength: 'Strength', dexterity: 'Dexterity', intelligence: 'Intelligence', charisma: 'Charisma' }
export const wrapIndex = (index: number, length: number) => (index + length) % length

export function combineAttributes(race: Race, characterClass: CharacterClass): AttributeValues {
  return (Object.keys(attributeLabels) as AttributeKey[]).reduce((result, key) => {
    result[key] = Math.max(1, Math.min(100, race.attributes[key] + (characterClass.attributes[key] ?? 0)))
    return result
  }, {} as AttributeValues)
}
