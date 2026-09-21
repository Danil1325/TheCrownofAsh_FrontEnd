import { cardImagePairs, type CardCategory } from '../assets/items'

export const itemCategories = ['weapons', 'armor', 'potions', 'artifacts'] as const

export type ItemCategory = (typeof itemCategories)[number]

export interface MarketItem {
  id: string
  name: string
  category: ItemCategory
  buyPrice: number
  sellPrice: number
  frontImage: string
  backImage: string
  quantity: number
}

const categoryBasePrice: Record<CardCategory, number> = {
  weapons: 250,
  armor: 350,
  potions: 50,
  artifacts: 400,
}

/** Only complete, supplied front/back PNG pairs are available to buy. */
export const marketItems: readonly MarketItem[] = cardImagePairs.map((card, index) => {
  const buyPrice = categoryBasePrice[card.category] + (index % 5) * 25

  return {
    ...card,
    buyPrice,
    sellPrice: Math.floor(buyPrice / 2),
    quantity: 1 + (index % 8),
  }
})
