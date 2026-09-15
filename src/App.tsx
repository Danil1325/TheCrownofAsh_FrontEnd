import shopHeader from './assets/ui/ShopHeader.png'
import shopMenu from './assets/ui/ShopMenu.png'
import { useReducer, useState } from 'react'
import { CategoryMenu } from './components/CategoryMenu'
import { InventoryItemCard } from './components/InventoryItemCard'
import { ItemCard } from './components/ItemCard'
import { itemCategories, marketItems, type ItemCategory, type MarketItem } from './data/marketItems'
import { addItemToInventory, getInventoryQuantity, type Inventory } from './state/inventory'
import './App.css'

type MarketView = 'shop' | 'sell'
type MarketMessage = { tone: 'success' | 'error'; text: string } | null
type ResolvedInventoryItem = { item: MarketItem; quantity: number }
interface PlayerState {
  gold: number
  inventory: Inventory
  marketMessage: MarketMessage
}

type PlayerAction =
  | { type: 'buy'; item: MarketItem }
  | { type: 'sell'; items: Inventory }

function calculateSellValue(items: readonly ResolvedInventoryItem[]): number {
  return items.reduce((total, { item, quantity }) => total + item.sellPrice * quantity, 0)
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  if (action.type === 'sell') {
    const quantitiesToSell = action.items.reduce<Map<string, number>>((quantities, entry) => {
      quantities.set(entry.itemId, (quantities.get(entry.itemId) ?? 0) + entry.quantity)
      return quantities
    }, new Map())

    const itemsToSell: ResolvedInventoryItem[] = []

    for (const [itemId, quantity] of quantitiesToSell) {
      const ownedEntry = state.inventory.find((entry) => entry.itemId === itemId)
      const item = marketItems.find((marketItem) => marketItem.id === itemId)

      if (!ownedEntry || !item || quantity <= 0 || quantity > ownedEntry.quantity) {
        return state
      }

      itemsToSell.push({ item, quantity })
    }

    const totalValue = calculateSellValue(itemsToSell)

    if (totalValue === 0) {
      return state
    }

    return {
      gold: state.gold + totalValue,
      inventory: state.inventory.flatMap((entry) => {
        const soldQuantity = quantitiesToSell.get(entry.itemId) ?? 0
        const remainingQuantity = entry.quantity - soldQuantity
        return remainingQuantity > 0 ? [{ ...entry, quantity: remainingQuantity }] : []
      }),
      marketMessage: { tone: 'success', text: `Items sold successfully! +${totalValue} gold` },
    }
  }

  const { item } = action

  if (state.gold < item.buyPrice) {
    return { ...state, marketMessage: { tone: 'error', text: 'Not enough gold' } }
  }

  return {
    gold: state.gold - item.buyPrice,
    inventory: addItemToInventory(state.inventory, item.id),
    marketMessage: { tone: 'success', text: `${item.name} added to your inventory.` },
  }
}

const navigation: ReadonlyArray<{ id: MarketView; label: string; icon: string }> = [
  { id: 'shop', label: 'Shop', icon: '⚔' },
  { id: 'sell', label: 'Sell Items', icon: '⚖' },
]

function App() {
  const [activeView, setActiveView] = useState<MarketView>('shop')
  const [isShopCategoriesOpen, setIsShopCategoriesOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('weapons')
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [player, dispatchPlayerAction] = useReducer(playerReducer, {
    gold: 1250,
    inventory: [],
    marketMessage: null,
  })
  const visibleItems = marketItems.filter((item) => item.category === selectedCategory)
  const ownedItems = player.inventory
    .map((entry) => {
      const item = marketItems.find((marketItem) => marketItem.id === entry.itemId)
      return item ? { item, quantity: entry.quantity } : null
    })
    .filter((entry): entry is ResolvedInventoryItem => entry !== null)
  const selectedItems = ownedItems.filter(({ item }) => selectedItemIds.includes(item.id))
  const estimatedSellValue = calculateSellValue(selectedItems)

  function handleBuy(item: MarketItem) {
    dispatchPlayerAction({ type: 'buy', item })
  }

  function handleShopNavigation() {
    setIsShopCategoriesOpen((isOpen) => (activeView === 'shop' ? !isOpen : true))
    setActiveView('shop')
  }

  function toggleSellSelection(itemId: string) {
    setSelectedItemIds((currentSelection) =>
      currentSelection.includes(itemId)
        ? currentSelection.filter((selectedItemId) => selectedItemId !== itemId)
        : [...currentSelection, itemId],
    )
  }

  function handleSell() {
    const selectedInventory = player.inventory.filter((entry) => selectedItemIds.includes(entry.itemId))

    if (selectedInventory.length === 0) {
      return
    }

    dispatchPlayerAction({ type: 'sell', items: selectedInventory })
    setSelectedItemIds([])
  }

  const content =
    activeView === 'shop'
      ? {
          eyebrow: 'The merchant’s wares',
          title: 'Shop',
          description: 'Browse wares and prepare for the road ahead.',
        }
      : {
          eyebrow: 'Your adventurer’s pack',
          title: 'Sell Items',
          description: 'Choose unused equipment to trade for gold.',
        }

  return (
    <main className="market-page">
      <div className="market-frame">
        <header className="market-header">
          <div className="rune-line" aria-hidden="true">
            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ ᛈ ᛉ ᛊ
          </div>
          <div className="market-heading-wrap">
            <img className="shop-header-image" src={shopHeader} alt="Market" />
          </div>
          <p className="market-motto">Spend your gold <span>•</span> Gear up <span>•</span> Survive</p>
          <div className="gold-balance" aria-label={`Current gold balance: ${player.gold} gold`}>
            <span className="gold-coin" aria-hidden="true">◉</span>
            <strong>{player.gold.toLocaleString()}</strong>
            <span className="gold-label">Gold</span>
          </div>
        </header>

        <section className="market-workspace" aria-label="Market">
          {activeView === 'shop' ? (
            <nav className="market-navigation" aria-label="Market sections">
              {/* <p className="navigation-title">Market Menu</p> */}
              <div className="navigation-options">
                {navigation.map((item) => (
                  <div className="market-nav-group" key={item.id}>
                    <button
                      className={activeView === item.id ? 'market-nav-button is-active' : 'market-nav-button'}
                      type="button"
                      aria-pressed={activeView === item.id}
                      aria-expanded={item.id === 'shop' ? isShopCategoriesOpen : undefined}
                      onClick={() => item.id === 'shop' ? handleShopNavigation() : setActiveView(item.id)}
                    >
                      <span aria-hidden="true">{item.icon}</span>
                      {item.label}
                      {item.id === 'shop' && <b className="shop-disclosure" aria-hidden="true">{isShopCategoriesOpen ? '−' : '+'}</b>}
                    </button>
                    {item.id === 'shop' && isShopCategoriesOpen && (
                      <CategoryMenu
                        categories={itemCategories}
                        selectedCategory={selectedCategory}
                        onSelect={setSelectedCategory}
                      />
                    )}
                  </div>
                ))}
              </div>
            </nav>
          ) : (
            <nav className="market-navigation sell-navigation" aria-label="Inventory sections">
              <p className="navigation-title">Inventory</p>
              <div className="navigation-options">
                <p className="market-nav-label"><span aria-hidden="true">🎒</span> Inventory</p>
                <p className="market-nav-label is-active"><span aria-hidden="true">⚖</span> Sell Items</p>
                <button className="market-nav-button" type="button" onClick={handleShopNavigation}>
                  <span aria-hidden="true">◉</span> Buy Items
                </button>
                <button className="market-nav-button" type="button" onClick={handleShopNavigation}>
                  <span aria-hidden="true">↩</span> Back
                </button>
              </div>
            </nav>
          )}

          <section className="market-content" aria-labelledby="market-content-title">
            <div className="content-heading">
              <p>{content.eyebrow}</p>
              <h2 id="market-content-title">{content.title}</h2>
              <span aria-hidden="true">✦</span>
            </div>
            {activeView === 'shop' ? (
              <div className="shop-panel">
                <p className="shop-category-description">{content.description}</p>
                {player.marketMessage && (
                  <p className={`purchase-message is-${player.marketMessage.tone}`} role="status">
                    {player.marketMessage.text}
                  </p>
                )}
                <div className="item-grid" aria-live="polite">
                  {visibleItems.map((item) => (
                    <ItemCard
                      item={item}
                      key={item.id}
                      ownedQuantity={getInventoryQuantity(player.inventory, item.id)}
                      onBuy={handleBuy}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="sell-panel">
                {player.marketMessage && (
                  <p className={`purchase-message sell-message is-${player.marketMessage.tone}`} role="status">
                    {player.marketMessage.text}
                  </p>
                )}
                <section className="your-items-panel" aria-labelledby="your-items-heading">
                  <div className="sell-section-heading">
                    <span aria-hidden="true">✦</span>
                    <h3 id="your-items-heading">Your Items</h3>
                    <span aria-hidden="true">✦</span>
                  </div>
                  {ownedItems.length > 0 ? (
                    <div className="inventory-item-grid">
                      {ownedItems.map(({ item, quantity }) => (
                        <InventoryItemCard
                          item={item}
                          key={item.id}
                          quantity={quantity}
                          selected={selectedItemIds.includes(item.id)}
                          onSelect={toggleSellSelection}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="empty-inventory">Your pack is empty. Visit the shop to acquire wares.</p>
                  )}
                </section>

                <aside className="sell-selection-panel" aria-labelledby="sell-selection-heading">
                  <div className="sell-section-heading">
                    <span aria-hidden="true">✦</span>
                    <h3 id="sell-selection-heading">Sell Selection</h3>
                    <span aria-hidden="true">✦</span>
                  </div>
                  <div className="selected-items-list">
                    {selectedItems.length > 0 ? (
                      selectedItems.map(({ item, quantity }) => (
                        <div className="selected-item" key={item.id}>
                          <img src={item.image} alt="" />
                          <span>{item.name}</span>
                          <b>×{quantity}</b>
                        </div>
                      ))
                    ) : (
                      <p><span aria-hidden="true">✧</span> Select items to offer</p>
                    )}
                  </div>
                  <p className="estimated-value">Estimated value <strong><span aria-hidden="true">◉</span> {estimatedSellValue}</strong></p>
                  <button
                    className="sell-button"
                    type="button"
                    disabled={selectedItems.length === 0}
                    onClick={handleSell}
                  >
                    Sell
                  </button>
                </aside>
              </div>
            )}
          </section>
        </section>

        <footer className="market-footer" aria-hidden="true">
          ᚱ ᚢ ᚾ ᛖ ᛊ &nbsp; • &nbsp; ᚷ ᛟ ᛚ ᛞ &nbsp; • &nbsp; ᚹ ᚨ ᚱ ᛖ ᛊ
        </footer>
      </div>
    </main>
  )
}

export default App
