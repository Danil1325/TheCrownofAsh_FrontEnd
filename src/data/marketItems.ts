import { itemImages } from '../assets/items'

export const itemCategories = ['weapons', 'armor', 'potions', 'artifacts'] as const

export type ItemCategory = (typeof itemCategories)[number]

export interface MarketItem {
  id: string
  name: string
  category: ItemCategory
  description: string
  buyPrice: number
  sellPrice: number
  image: string
  quantity: number
}

// These paths deliberately point to future item artwork. Replace each one with
// an import from `src/assets/items` once its PNG has been supplied and added to
// the item image registry.
const placeholderImages = {
  elvenBow: '/item-images/weapons/elven-bow.png',
  dragonBlade: '/item-images/weapons/dragon-blade.png',
  mageStaff: '/item-images/weapons/mage-staff.png',
  heavyArmor: '/item-images/armor/heavy-armor.png',
  leatherArmor: '/item-images/armor/leather-armor.png',
  healingPotion: '/item-images/potions/healing-potion.png',
  manaPotion: '/item-images/potions/mana-potion.png',
} as const

/**
 * Market inventory data. A shop view can filter or map this array directly to
 * render item cards without embedding item details in components.
 */
export const marketItems: readonly MarketItem[] = [
  {
    id: 'iron-sword',
    name: 'Iron Sword',
    category: 'weapons',
    description: 'A dependable, balanced blade for close-quarters combat.',
    buyPrice: 120,
    sellPrice: 60,
    image: itemImages.weapons.theSword,
    quantity: 8,
  },
  {
    id: 'elven-bow',
    name: 'Elven Bow',
    category: 'weapons',
    description: 'A lightweight bow prized for its graceful accuracy.',
    buyPrice: 250,
    sellPrice: 125,
    image: placeholderImages.elvenBow,
    quantity: 4,
  },
  {
    id: 'dragon-blade',
    name: 'Dragon Blade',
    category: 'weapons',
    description: 'A formidable sword forged to withstand dragonfire.',
    buyPrice: 500,
    sellPrice: 250,
    image: placeholderImages.dragonBlade,
    quantity: 2,
  },
  {
    id: 'mage-staff',
    name: 'Mage Staff',
    category: 'weapons',
    description: 'A rune-carved staff that focuses arcane power.',
    buyPrice: 300,
    sellPrice: 150,
    image: placeholderImages.mageStaff,
    quantity: 3,
  },
  {
    id: 'heavy-armor',
    name: 'Heavy Armor',
    category: 'armor',
    description: 'Layered steel protection for the front line.',
    buyPrice: 350,
    sellPrice: 175,
    image: placeholderImages.heavyArmor,
    quantity: 3,
  },
  {
    id: 'leather-armor',
    name: 'Leather Armor',
    category: 'armor',
    description: 'Flexible, durable armor suited to agile adventurers.',
    buyPrice: 200,
    sellPrice: 100,
    image: placeholderImages.leatherArmor,
    quantity: 6,
  },
  {
    id: 'healing-potion',
    name: 'Healing Potion',
    category: 'potions',
    description: 'Restores vitality after a dangerous encounter.',
    buyPrice: 50,
    sellPrice: 25,
    image: placeholderImages.healingPotion,
    quantity: 20,
  },
  {
    id: 'mana-potion',
    name: 'Mana Potion',
    category: 'potions',
    description: 'Replenishes magical energy for spellcasting.',
    buyPrice: 60,
    sellPrice: 30,
    image: placeholderImages.manaPotion,
    quantity: 16,
  },
  {
    id: 'lotus-relic',
    name: 'Lotus Relic',
    category: 'artifacts',
    description: 'An ancient lotus-shaped relic with a quiet magical aura.',
    buyPrice: 400,
    sellPrice: 200,
    image: itemImages.artifacts.lotus,
    quantity: 1,
  },
]
