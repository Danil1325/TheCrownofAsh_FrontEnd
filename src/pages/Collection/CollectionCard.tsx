import { useState } from 'react';
import './CollectionCard.css';

export type CollectionItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rarity?: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  stats?: Record<string, string | number>;
  lore?: string;
  discovered?: boolean;
};

interface CollectionCardProps {
  item: CollectionItem;
}

const CollectionCard = ({ item }: CollectionCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const rarityClass = item.rarity ? `rarity-${item.rarity.toLowerCase()}` : 'rarity-common';

  const isDiscovered = item.discovered !== false;

  return (
    <div className="collection-card-container" onClick={handleFlip}>
      <div className={`collection-card-flip ${isFlipped ? 'flipped' : ''}`}>
        
        {/* Front of the card */}
        <div className={`collection-card-face collection-card-front ${rarityClass}`}>
          <div className="collection-card-header">
            <span className="collection-item-type">{item.category}</span>
          </div>
          
          <div className="collection-card-image-placeholder">
            {item.image ? (
              <img src={item.image} alt={isDiscovered ? item.name : 'Unknown'} className={`collection-item-image ${!isDiscovered ? 'collection-undiscovered-img' : ''}`} />
            ) : (
              <div className="collection-placeholder-img-box"></div>
            )}
          </div>
          
          <div className="collection-card-footer">
            <span className="collection-item-name">{isDiscovered ? item.name : '???'}</span>
          </div>
          <div className="collection-card-glare"></div>
        </div>

        {/* Back of the card */}
        <div className={`collection-card-face collection-card-back ${rarityClass}`}>
          <div className="collection-card-header">
            <span className="collection-item-name">{isDiscovered ? item.name : '???'}</span>
          </div>
          
          <div className="collection-card-stats">
            {!isDiscovered ? (
              <div className="collection-undiscovered-text">
                Keep playing to discover this entity.
              </div>
            ) : (
              <>
                <p className="collection-item-description">"{item.description}"</p>
                
                {item.stats && Object.keys(item.stats).length > 0 && (
                  <ul className="collection-stats-list">
                    {Object.entries(item.stats).map(([key, val]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {val}
                      </li>
                    ))}
                  </ul>
                )}
                
                {item.lore && (
                  <div className="collection-item-lore">
                    <p>{item.lore}</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="collection-card-glare"></div>
        </div>
        
      </div>
    </div>
  );
};

export default CollectionCard;
