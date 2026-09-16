export type CardCategory = 'weapons' | 'armor' | 'potions' | 'artifacts'

export interface CardImagePair {
  id: string
  category: CardCategory
  name: string
  frontImage: string
  backImage: string
}

const frontImages = import.meta.glob<string>('./**/*_front*.png', {
  eager: true,
  import: 'default',
  query: '?url',
})
const backImages = import.meta.glob<string>('./**/*_back.png', {
  eager: true,
  import: 'default',
  query: '?url',
})

function titleFromSlug(slug: string) {
  return slug.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

/** Every complete front/back pair supplied in the item-asset folders. */
export const cardImagePairs: readonly CardImagePair[] = Object.entries(frontImages)
  .flatMap(([frontPath, frontImage]) => {
    const backPath = frontPath.replace(/_front\s*\.png$/, '_back.png')
    const backImage = backImages[backPath]

    if (!backImage) {
      return []
    }

    const [, category, , filename] = frontPath.split('/')
    const slug = filename.replace(/_front\s*\.png$/, '')

    return [{
      id: `${category}-${slug.replaceAll('_', '-')}`,
      category: category as CardCategory,
      name: titleFromSlug(slug),
      frontImage,
      backImage,
    }]
  })
  .sort((first, second) => first.name.localeCompare(second.name))
