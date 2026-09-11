import { useState } from 'react'
import { CategoryMenu } from './components/CategoryMenu'
import { itemCategories, marketItems, type ItemCategory } from './data/marketItems'
import './App.css'

type MarketView = 'shop' | 'sell'

const navigation: ReadonlyArray<{ id: MarketView; label: string; icon: string }> = [
  { id: 'shop', label: 'Shop', icon: '⚔' },
  { id: 'sell', label: 'Sell Items', icon: '⚖' },
]

function App() {
  const [activeView, setActiveView] = useState<MarketView>('shop')
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('weapons')
  const visibleItems = marketItems.filter((item) => item.category === selectedCategory)

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
            <span className="heading-star" aria-hidden="true">✦</span>
            <h1>Market</h1>
            <span className="heading-star" aria-hidden="true">✦</span>
          </div>
          <p className="market-motto">Spend your gold <span>•</span> Gear up <span>•</span> Survive</p>
          <div className="gold-balance" aria-label="Current gold balance: 1,250 gold">
            <span className="gold-coin" aria-hidden="true">◉</span>
            <strong>1,250</strong>
            <span className="gold-label">Gold</span>
          </div>
        </header>

        <section className="market-workspace" aria-label="Market">
          <nav className="market-navigation" aria-label="Market sections">
            <p className="navigation-title">Market Menu</p>
            <div className="navigation-options">
              {navigation.map((item) => (
                <button
                  className={activeView === item.id ? 'market-nav-button is-active' : 'market-nav-button'}
                  type="button"
                  key={item.id}
                  aria-pressed={activeView === item.id}
                  onClick={() => setActiveView(item.id)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <section className="market-content" aria-labelledby="market-content-title">
            <div className="content-heading">
              <p>{content.eyebrow}</p>
              <h2 id="market-content-title">{content.title}</h2>
              <span aria-hidden="true">✦</span>
            </div>
            {activeView === 'shop' ? (
              <div className="shop-panel">
                <CategoryMenu
                  categories={itemCategories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                />
                <p className="shop-category-description">{content.description}</p>
                <div className="item-grid" aria-live="polite">
                  {visibleItems.map((item) => (
                    <article className="market-item-card" key={item.id}>
                      <div className="item-image-frame" aria-hidden="true">
                        <img
                          src={item.image}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.hidden = true
                          }}
                        />
                        <span>✦</span>
                      </div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <div className="item-card-footer">
                        <span className="item-price"><b aria-hidden="true">◉</b> {item.buyPrice} gold</span>
                        <span className="item-stock">{item.quantity} in stock</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="content-placeholder">
                <span className="placeholder-mark" aria-hidden="true">♜</span>
                <p>{content.description}</p>
                <small>Your sellable items will appear here.</small>
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
