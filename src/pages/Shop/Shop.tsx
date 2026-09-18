import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './Shop.css'
import marketBackground from '../../assets/Shop/Market Map Background.png'
import marketBanner from '../../assets/Shop/market-assets/market-banner.png'
import subtitleBanner from '../../assets/Shop/market-assets/subtitle-banner.png'
import goldCounter from '../../assets/Shop/market-assets/gold-counter.png'
import categoryPanel from '../../assets/Shop/category-menu/menu-panel.png'
import activeCategoryButton from '../../assets/Shop/category-menu/active-button.png'
import weaponsIcon from '../../assets/Shop/category-menu/weapons.png'
import armorIcon from '../../assets/Shop/category-menu/armor.png'
import potionsIcon from '../../assets/Shop/category-menu/potions.png'
import scrollsIcon from '../../assets/Shop/category-menu/scrolls.png'
import miscIcon from '../../assets/Shop/category-menu/misc.png'
import buyButton from '../../assets/Shop/market-assets/buy-button.png'
import buyButtonLabeled from '../../assets/Shop/market-assets/buy-button-labeled.png'
import productCard from '../../assets/Shop/market-assets/product-card-empty.png'
import priceCoin from '../../assets/Shop/market-assets/price-coin.png'
import ironSword from '../../assets/Shop/market-assets/iron-sword.png'
import elvenBow from '../../assets/Shop/market-assets/elven-bow.png'
import dragonBlade from '../../assets/Shop/market-assets/dragon-blade.png'
import mageStaff from '../../assets/Shop/market-assets/mage-staff.png'
import heavyArmor from '../../assets/Shop/market-assets/heavy-armor.png'
import leatherArmor from '../../assets/Shop/market-assets/leather-armor.png'
import healingPotion from '../../assets/Shop/market-assets/healing-potion.png'
import manaPotion from '../../assets/Shop/market-assets/mana-potion.png'
import map from '../../assets/Shop/market-assets/map.png'

type Category = 'Weapons' | 'Armor' | 'Potions' | 'Scrolls' | 'Misc'
type Item = { id: string; name: string; description: string; price: number; category: Category; image: string }

const categories: Array<{ name: Category; icon: string }> = [
  { name: 'Weapons', icon: weaponsIcon }, { name: 'Armor', icon: armorIcon }, { name: 'Potions', icon: potionsIcon }, { name: 'Scrolls', icon: scrollsIcon }, { name: 'Misc', icon: miscIcon },
]
const inventory: Item[] = [
  { id: 'iron-sword', name: 'Iron Sword', description: 'Reliable and sharp.', price: 120, category: 'Weapons', image: ironSword }, { id: 'elven-bow', name: 'Elven Bow', description: 'Swift and silent.', price: 250, category: 'Weapons', image: elvenBow }, { id: 'dragon-blade', name: 'Dragon Blade', description: 'Forged in fire.', price: 500, category: 'Weapons', image: dragonBlade }, { id: 'mage-staff', name: 'Mage Staff', description: 'Channel the arcane.', price: 300, category: 'Weapons', image: mageStaff }, { id: 'heavy-armor', name: 'Heavy Armor', description: 'Stand firm.', price: 350, category: 'Armor', image: heavyArmor }, { id: 'leather-armor', name: 'Leather Armor', description: 'Light and flexible.', price: 200, category: 'Armor', image: leatherArmor }, { id: 'healing-potion', name: 'Healing Potion', description: 'Restores your health.', price: 50, category: 'Potions', image: healingPotion }, { id: 'mana-potion', name: 'Mana Potion', description: 'Replenishes your mana.', price: 60, category: 'Potions', image: manaPotion }, { id: 'old-map', name: 'Map', description: 'Reveals new locations.', price: 150, category: 'Scrolls', image: map },
]
type ShopProps = { onBack: () => void; onPlayButtonSound: () => void }

function Shop({ onBack, onPlayButtonSound }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [gold, setGold] = useState(1250)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isSelling, setIsSelling] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return

    const timer = window.setTimeout(() => {
      setNotice('')
    }, 2000)

    return () => window.clearTimeout(timer)
  }, [notice])

  const shownItems = useMemo(() => activeCategory ? inventory.filter((item) => item.category === activeCategory) : inventory, [activeCategory])
  const buy = (item: Item) => {
    onPlayButtonSound()
    if (isSelling) {
      const ownedCount = quantities[item.id] ?? 0
      if (ownedCount <= 0) return setNotice(`You do not own the ${item.name}.`)
      const salePrice = Math.floor(item.price / 2)
      setGold((value) => value + salePrice)
      setQuantities((current) => ({ ...current, [item.id]: Math.max((current[item.id] ?? 0) - 1, 0) }))
      setNotice(`${item.name} sold for ${salePrice} gold.`)
      return
    }
    if (gold < item.price) return setNotice(`You need ${item.price - gold} more gold for the ${item.name}.`)
    setGold((value) => value - item.price)
    setQuantities((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }))
    setNotice(`${item.name} purchased for ${item.price} gold.`)
  }
  return <main className="shop-screen" style={{ backgroundImage: `url("${marketBackground}")` }}>
    <header className="market-header"><p className="rune-line" aria-hidden="true">ᛏ ᚺ ᚱ ᚨ ᚾ ᛞ ᛟ ᚱ ᛖ ᛚ ᛚ ᛁ ᚾ ᛋ ᛏ ᚨ ᚱ</p><img className="market-banner" src={marketBanner} alt="Market" /><img className="subtitle-banner" src={subtitleBanner} alt="Spend your gold · Gear up · Survive" /></header>
    <div className="market-gold" aria-label={`${gold} gold`}><img src={goldCounter} alt="" /><strong>{gold.toLocaleString()}</strong></div>
    <AnimatePresence mode="wait">
      {notice && <motion.p className="shop-notice" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}>{notice}</motion.p>}
    </AnimatePresence>
    <section className="market-layout" aria-label="Merchant inventory">
      <aside className="shop-menu"><div className="category-panel"><img className="category-panel__paper" src={categoryPanel} alt="" /><div className="category-content"><nav aria-label="Shop categories">{categories.map((category) => <button type="button" key={category.name} className={activeCategory === category.name ? 'category-button category-button--active' : 'category-button'} onClick={() => { onPlayButtonSound(); setActiveCategory((current) => current === category.name ? null : category.name) }}><img className="category-button__active-bg" src={activeCategoryButton} alt="" /><img className="category-button__icon" src={category.icon} alt="" /><span>{category.name}</span></button>)}</nav></div></div><div className="shop-menu-actions"><button className={isSelling ? 'shop-menu-action--active' : ''} type="button" onClick={() => { onPlayButtonSound(); setIsSelling((current) => !current); setNotice(isSelling ? 'Buying mode active.' : 'Selling mode active. Choose an owned item.') }}><img src={isSelling ? activeCategoryButton : buyButton} alt="" style={{ height: '3.5rem' }} /><span>Sell Items</span></button><button type="button" onClick={() => { onPlayButtonSound(); onBack() }}><img src={buyButton} alt="" style={{ height: '3.5rem' }} /><span>Back</span></button></div></aside>
      <section className="wares"><div className="item-grid">{shownItems.map((item) => {
        const ownedCount = quantities[item.id] ?? 0
        const actionLabel = isSelling ? 'Sell' : 'Buy'
        return <article className="item-card" key={item.id}><img className="item-card__paper" src={productCard} alt="" /><img className={`item-card__icon${item.id === 'iron-sword' ? ' item-card__icon--iron-sword' : ''}`} src={item.image} alt={item.name} /><div className="item-card__copy"><h2>{item.name}</h2><p>{item.description}</p><strong><img src={priceCoin} alt="" />{item.price}</strong></div><button className="buy-button" type="button" aria-label={`${actionLabel} ${item.name}`} onClick={() => buy(item)}><img src={buyButton} alt="" />{isSelling ? <span>{actionLabel}</span> : ownedCount > 0 ? <img className="buy-button__label" src={buyButtonLabeled} alt="Buy" /> : <img className="buy-button__label" src={buyButtonLabeled} alt="Buy" />}</button></article>
      })}</div></section>
    </section>
  </main>
}
export default Shop
