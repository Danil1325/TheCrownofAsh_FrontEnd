import { useState, useMemo } from 'react';
import { Item } from '../../types/inventory';
import ItemCard from './ItemCard';
import './StorageGrid.css';

interface StorageGridProps {
  items: Item[];
  onEquip: (item: Item) => void;
}

type SortOption = 'Name' | 'Rarity' | 'Value';

const rarityOrder = {
  'Legendary': 5,
  'Epic': 4,
  'Rare': 3,
  'Uncommon': 2,
  'Common': 1
};

const StorageGrid = ({ items, onEquip }: StorageGridProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('Rarity');

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortBy === 'Name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'Rarity') {
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      } else if (sortBy === 'Value') {
        return b.value - a.value;
      }
      return 0;
    });

    return result;
  }, [items, searchTerm, sortBy]);

  return (
    <div className="storage-grid-container">
      <div className="storage-toolbar">
        <input 
          type="text" 
          placeholder="Search by name or type..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="Rarity">Rarity</option>
            <option value="Name">Name</option>
            <option value="Value">Value</option>
          </select>
        </div>
      </div>
      
      <div className="grid-scroll-area">
        <div className="items-grid">
          {filteredAndSortedItems.map(item => (
            <ItemCard key={item.id} item={item} onEquip={onEquip} isEquipped={false} />
          ))}
          {filteredAndSortedItems.length === 0 && (
            <div className="no-items-message">
              No items found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageGrid;
