import { useCallback, useReducer, useState } from 'react'
import './Shop.css'
import shopHeader from '../../assets/ui/ShopHeader.png'
import buyIcon from '../../assets/ui/Buy Icon.png'
import sellIcon from '../../assets/ui/Sell Icon.png'
import exitIcon from '../../assets/Icons/Exit Icon.png'
import coinIcon from '../../assets/Icons/Coin.png'
import pouchIcon from '../../assets/ui/Pouch Icon.png'
import chestIcon from '../../assets/ui/Chest Icon.png'
import { MarketToast, type MarketNotification } from '../../components/MarketToast'
import { CategoryMenu } from '../../components/CategoryMenu'
import { InventoryItemCard } from '../../components/InventoryItemCard'
import { SellSelectionItem } from '../../components/SellSelectionItem'
import { ItemCard } from '../../components/ItemCard'
import { itemCategories, marketItems, type ItemCategory, type MarketItem } from '../../data/marketItems'
import { addItemToInventory, type Inventory } from '../../state/inventory'

type MarketView = 'shop' | 'sell'
type MarketCategory = ItemCategory | 'all'
type MarketMessage = MarketNotification | null
type ResolvedInventoryItem = { item: MarketItem; quantity: number }
interface PlayerState {
  gold: number
  inventory: Inventory
  marketMessage: MarketMessage
}

type PlayerAction =
  | { type: 'buy'; item: MarketItem }
  | { type: 'sell'; items: Inventory }
  | { type: 'clearMarketMessage'; message: MarketNotification }

function calculateSellValue(items: readonly ResolvedInventoryItem[]): number {
  return items.reduce((total, { item, quantity }) => total + item.sellPrice * quantity, 0)
}

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  if (action.type === 'clearMarketMessage') {
    return state.marketMessage === action.message ? { ...state, marketMessage: null } : state
  }

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

const navigation: ReadonlyArray<{ id: MarketView | 'back'; label: string; icon: string }> = [
  { id: 'shop', label: 'Buy Items', icon: buyIcon },
  { id: 'sell', label: 'Sell Items', icon: sellIcon },
  { id: 'back', label: 'Back', icon: exitIcon },
]

interface ShopProps {
  onBack: () => void
  onPlayButtonSound: () => void
}

function Shop({ onBack, onPlayButtonSound }: ShopProps) {
  const [activeView, setActiveView] = useState<MarketView>('shop')
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('all')
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({})
  const [player, dispatchPlayerAction] = useReducer(playerReducer, {
    gold: 1250,
    inventory: [],
    marketMessage: null,
  })

  const dismissNotification = useCallback((message: MarketNotification) => {
    dispatchPlayerAction({ type: 'clearMarketMessage', message })
  }, [])

  const visibleItems = selectedCategory === 'all'
    ? marketItems
    : marketItems.filter((item) => item.category === selectedCategory)
  const ownedItems = player.inventory
    .map((entry) => {
      const item = marketItems.find((marketItem) => marketItem.id === entry.itemId)
      return item ? { item, quantity: entry.quantity } : null
    })
    .filter((entry): entry is ResolvedInventoryItem => entry !== null)
  const selectedItems = ownedItems
    .map(({ item, quantity }) => ({ item, quantity: Math.min(quantity, selectedQuantities[item.id] ?? 0) }))
    .filter(({ quantity }) => quantity > 0)
  const availableItems = ownedItems
    .map(({ item, quantity }) => ({ item, quantity: quantity - Math.min(quantity, selectedQuantities[item.id] ?? 0) }))
    .filter(({ quantity }) => quantity > 0)
  const estimatedSellValue = calculateSellValue(selectedItems)

  function handleBuy(item: MarketItem) {
    onPlayButtonSound()
    dispatchPlayerAction({ type: 'buy', item })
  }

  function handleNavigation(id: MarketView | 'back') {
    onPlayButtonSound()
    if (id === 'back') {
      onBack()
      return
    }
    setActiveView(id)
    if (id === 'shop') {
      setSelectedCategory('all')
    }
  }

  function addSellSelection(itemId: string) {
    onPlayButtonSound()
    const ownedQuantity = player.inventory.find((entry) => entry.itemId === itemId)?.quantity ?? 0
    setSelectedQuantities((current) => ({
      ...current,
      [itemId]: Math.min(ownedQuantity, (current[itemId] ?? 0) + 1),
    }))
  }

  function removeSellSelection(itemId: string) {
    onPlayButtonSound()
    setSelectedQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, (current[itemId] ?? 0) - 1),
    }))
  }

  function handleSell() {
    const selectedInventory = selectedItems.map(({ item, quantity }) => ({ itemId: item.id, quantity }))

    if (selectedInventory.length === 0) {
      return
    }

    onPlayButtonSound()
    dispatchPlayerAction({ type: 'sell', items: selectedInventory })
    setSelectedQuantities({})
  }

  return (
    <main className="market-page">
      <div className="market-frame">
        <header className="market-header">
          <div className="market-heading-wrap">
            <img className="shop-header-image" src={shopHeader} alt="Market" />
          </div>
          <MarketToast notification={player.marketMessage} onDismiss={dismissNotification} />
        </header>

        <section className="market-workspace" aria-label="Market">
          <aside className="market-sidebar">
            <nav className="market-navigation" aria-label="Market sections">
              <div className="navigation-options">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    className={activeView === item.id ? 'market-nav-button is-active' : 'market-nav-button'}
                    type="button"
                    aria-pressed={activeView === item.id}
                    aria-label={item.label}
                    onClick={() => handleNavigation(item.id)}
                  >
                    <img className="nav-icon" src={item.icon} alt="" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
            {activeView === 'shop' && (
              <div className="market-categories-panel">
                <CategoryMenu
                  categories={itemCategories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
              </div>
            )}
          </aside>

          <section className={activeView === 'sell' ? 'market-content is-selling' : 'market-content'} aria-labelledby="market-content-title">
            <div className="gold-balance" aria-label={`Current gold balance: ${player.gold} gold`}>
              <strong>{player.gold.toLocaleString()}</strong>
            </div>
            {activeView === 'shop' ? (
              <div className="shop-panel">
                <div className="item-scroll" aria-live="polite">
                  <div className="item-grid">
                    {visibleItems.map((item) => (
                      <ItemCard
                        item={item}
                        key={item.id}
                        onBuy={handleBuy}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="sell-panel">
                <section className="your-items-panel" aria-labelledby="your-items-heading">
                  <div className="sell-section-heading">
                    <img className="heading-icon" src={chestIcon} alt="" />
                    <h3 id="your-items-heading">Your Items</h3>
                  </div>
                  {availableItems.length > 0 ? (
                    <div className="item-scroll">
                      <div className="item-grid">
                        {availableItems.map(({ item, quantity }) => (
                          <InventoryItemCard
                            item={item}
                            key={item.id}
                            quantity={quantity}
                            onSelect={addSellSelection}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="empty-inventory">
                      {ownedItems.length === 0
                        ? 'Your pack is empty. Visit the shop to acquire wares.'
                        : 'All of your items are in the sell selection.'}
                    </p>
                  )}
                </section>

                <aside className="sell-selection-panel" aria-labelledby="sell-selection-heading">
                  <div className="selected-items-list">
                    {selectedItems.length > 0 ? (
                      selectedItems.map(({ item, quantity }) => (
                        <SellSelectionItem
                          item={item}
                          key={item.id}
                          quantity={quantity}
                          onRemove={removeSellSelection}
                        />
                      ))
                    ) : (
                      <div className="empty-sell-selection">
                        <img className="empty-state-icon" src={pouchIcon} alt="" />
                        <p>Add your items here to sell them</p>
                      </div>
                    )}
                  </div>
                  <div className="sell-footer">
                    <p className="estimated-value">Estimated value <strong><img className="buy-coin-icon" src={coinIcon} alt="Gold" /> {estimatedSellValue}</strong></p>
                    <button
                      className="sell-button"
                      type="button"
                      disabled={selectedItems.length === 0}
                      onClick={handleSell}
                    >
                      Sell
                    </button>
                  </div>
                </aside>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

export default Shop