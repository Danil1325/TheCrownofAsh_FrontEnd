import { useState, useMemo } from 'react';
import { Item } from '../../types/inventory';
import ItemCard from './ItemCard';
import './StorageGrid.css';

interface StorageGridProps {
  items: Item[];
  onEquip: (item: Item) => void;
  searchTerm: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

type SortOption = 'Name' | 'Rarity' | 'Value';

const rarityOrder = {
  'Legendary': 5,
  'Epic': 4,
  'Rare': 3,
  'Uncommon': 2,
  'Common': 1
};

const StorageGrid = ({ items, onEquip, searchTerm, sortBy, onSortChange }: StorageGridProps) => {

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
