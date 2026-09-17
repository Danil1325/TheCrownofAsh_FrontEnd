import { useMemo, useState } from 'react'
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
  const [owned, setOwned] = useState<string[]>([])
  const [isSelling, setIsSelling] = useState(false)
  const [notice, setNotice] = useState('Fine goods and fair prices.')
  const shownItems = useMemo(() => activeCategory ? inventory.filter((item) => item.category === activeCategory) : inventory, [activeCategory])
  const buy = (item: Item) => {
    onPlayButtonSound()
    if (isSelling) {
      if (!owned.includes(item.id)) return setNotice(`You do not own the ${item.name}.`)
      const salePrice = Math.floor(item.price / 2)
      setGold((value) => value + salePrice); setOwned((items) => items.filter((id) => id !== item.id)); setNotice(`${item.name} sold for ${salePrice} gold.`)
      return
    }
    if (owned.includes(item.id)) return setNotice(`You already own the ${item.name}.`)
    if (gold < item.price) return setNotice('Your purse is too light for that.')
    setGold((value) => value - item.price); setOwned((items) => [...items, item.id]); setNotice(`${item.name} added to your pack.`)
  }
  return <main className="shop-screen" style={{ backgroundImage: `url("${marketBackground}")` }}>
    <header className="market-header"><p className="rune-line" aria-hidden="true">ᛏ ᚺ ᚱ ᚨ ᚾ ᛞ ᛟ ᚱ ᛖ ᛚ ᛚ ᛁ ᚾ ᛋ ᛏ ᚨ ᚱ</p><img className="market-banner" src={marketBanner} alt="Market" /><img className="subtitle-banner" src={subtitleBanner} alt="Spend your gold · Gear up · Survive" /></header>
    <div className="market-gold" aria-label={`${gold} gold`}><img src={goldCounter} alt="" /><strong>{gold.toLocaleString()}</strong></div>
    <section className="market-layout" aria-label="Merchant inventory">
      <aside className="shop-menu"><div className="category-panel"><img className="category-panel__paper" src={categoryPanel} alt="" /><div className="category-content"><nav aria-label="Shop categories">{categories.map((category) => <button type="button" key={category.name} className={activeCategory === category.name ? 'category-button category-button--active' : 'category-button'} onClick={() => { onPlayButtonSound(); setActiveCategory((current) => current === category.name ? null : category.name) }}><img className="category-button__active-bg" src={activeCategoryButton} alt="" /><img className="category-button__icon" src={category.icon} alt="" /><span>{category.name}</span></button>)}</nav></div></div><div className="shop-menu-actions"><button className={isSelling ? 'shop-menu-action--active' : ''} type="button" onClick={() => { onPlayButtonSound(); setIsSelling((current) => !current); setNotice(isSelling ? 'Buying mode active.' : 'Selling mode active. Choose an owned item.') }}><img src={isSelling ? activeCategoryButton : buyButton} alt="" style={{ height: '3.5rem' }} /><span>Sell Items</span></button><button type="button" onClick={() => { onPlayButtonSound(); onBack() }}><img src={buyButton} alt="" style={{ height: '3.5rem' }} /><span>Back</span></button></div></aside>
      <section className="wares"><div className="item-grid">{shownItems.map((item) => { const isOwned = owned.includes(item.id); const actionLabel = isSelling ? 'Sell' : isOwned ? 'Owned' : 'Buy'; return <article className="item-card" key={item.id}><img className="item-card__paper" src={productCard} alt="" /><img className={`item-card__icon${item.id === 'iron-sword' ? ' item-card__icon--iron-sword' : ''}`} src={item.image} alt={item.name} /><div className="item-card__copy"><h2>{item.name}</h2><p>{item.description}</p><strong><img src={priceCoin} alt="" />{item.price}</strong></div><button className="buy-button" type="button" disabled={!isSelling && isOwned} aria-label={`${actionLabel} ${item.name}`} onClick={() => buy(item)}><img src={buyButton} alt="" />{isSelling || isOwned ? <span>{actionLabel}</span> : <img className="buy-button__label" src={buyButtonLabeled} alt="Buy" />}</button></article> })}</div><p className="shop-notice" role="status">{notice}</p></section>
    </section>
  </main>
}
export default Shop
