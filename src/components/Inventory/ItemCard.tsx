import { useState } from 'react';
import { Item } from '../../types/inventory';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  onEquip?: (item: Item) => void;
  onUnequip?: (item: Item) => void;
  isEquipped?: boolean;
}

const ItemCard = ({ item, onEquip, onUnequip, isEquipped }: ItemCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEquipped && onUnequip) {
      onUnequip(item);
    } else if (!isEquipped && onEquip) {
      onEquip(item);
    }
  };

  const rarityClass = `rarity-${item.rarity.toLowerCase()}`;

  return (
    <div className="item-card-container" onClick={handleFlip}>
      <div className={`item-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of the card */}
        <div className={`card-face card-front ${rarityClass}`}>
          <div className="card-header">
            <span className="item-type">{item.category}</span>
            <div className="header-right">
              <span className="item-value">🪙 {item.value}</span>
              {item.quantity && item.quantity > 1 && (
                <span className="item-quantity">x{item.quantity}</span>
              )}
            </div>
          </div>
          <div className="card-image-placeholder">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="item-image" />
            ) : (
              <div className="placeholder-img-box"></div>
            )}
          </div>
          <div className="card-footer">
            <span className="item-name">{item.name}</span>
          </div>
          <div className="card-glare"></div>
        </div>

        {/* Back of the card */}
        <div className={`card-face card-back ${rarityClass}`}>
          <div className="card-header">
            <span className="item-name">{item.name}</span>
          </div>
          <div className="card-stats">
            <p className="item-description">"{item.description}"</p>
            {item.stats && (
              <ul className="stats-list">
                {item.stats.hp && <li>HP: +{item.stats.hp}</li>}
                {item.stats.damage && <li>Damage: +{item.stats.damage}</li>}
                {item.stats.defense && <li>Defense: +{item.stats.defense}</li>}
              </ul>
            )}
            {item.effects && item.effects.length > 0 && (
              <div className="item-effects">
                <strong>Effects:</strong>
                <ul>
                  {item.effects.map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="card-actions">
            {(onEquip || onUnequip) && (
              <button 
                className="action-btn-img" 
                onClick={handleAction}
              >
                <img 
                  src={isEquipped ? new URL('../../assets/Inventory/Unequip.png', import.meta.url).href : new URL('../../assets/Inventory/Equip.png', import.meta.url).href} 
                  alt={isEquipped ? 'Unequip' : 'Equip'} 
                />
              </button>
            )}
          </div>
          <div className="card-glare"></div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
