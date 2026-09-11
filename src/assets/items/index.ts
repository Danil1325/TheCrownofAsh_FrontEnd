import cloakOfEclipse from './armor/TheCloakOfEclipse.png'
import lotus from './artifacts/Lotus.png'
import gaseousForm from './potions/GaseousForm.png'
import theSword from './weapons/TheSword.png'

/**
 * Central image paths for market items.
 *
 * Add each new item to its category folder and export it here so game code has
 * one stable place from which to import item artwork.
 */
export const itemImages = {
  weapons: {
    theSword,
  },
  armor: {
    cloakOfEclipse,
  },
  potions: {
    gaseousForm,
  },
  artifacts: {
    lotus,
  },
} as const

export type ItemImageCategory = keyof typeof itemImages
