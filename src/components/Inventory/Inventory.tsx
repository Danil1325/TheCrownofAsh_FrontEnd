import { useState, useMemo } from 'react';
import { Item, Equipment, ItemCategory } from '../../types/inventory';
import EquipmentSlots from './EquipmentSlots';
import StorageGrid from './StorageGrid';
import './Inventory.css';

// Mock data for initial testing
const MOCK_ITEMS: Item[] = [
  { id: '1', name: 'Iron Sword', category: 'Weapon', rarity: 'Common', description: 'A basic iron sword.', stats: { damage: 5 }, value: 10 },
  { id: '2', name: 'Steel Sword', category: 'Weapon', rarity: 'Uncommon', description: 'A sharp steel sword.', stats: { damage: 12 }, value: 35 },
  { id: '3', name: 'Dragonbone Blade', category: 'Weapon', rarity: 'Legendary', description: 'A blade forged from ancient dragon bone. It pulses with heat.', stats: { damage: 55 }, effects: ['Fire Damage +10', 'Chance to burn'], value: 500 },
  { id: '4', name: 'Leather Tunic', category: 'Armor', rarity: 'Common', description: 'Basic protection.', stats: { defense: 3 }, value: 8 },
  { id: '5', name: 'Mithril Chainmail', category: 'Armor', rarity: 'Epic', description: 'Lightweight and incredibly strong.', stats: { defense: 25, hp: 50 }, value: 200 },
  { id: '6', name: 'Ruby Amulet', category: 'Amulet', rarity: 'Rare', description: 'A glowing red amulet.', stats: { hp: 100 }, effects: ['HP Regen +1/s'], value: 150 },
  { id: '7', name: 'Health Potion', category: 'Potion', rarity: 'Common', description: 'Restores 50 HP.', effects: ['Restore 50 HP'], quantity: 5, value: 5 },
  { id: '8', name: 'Wolf Pelt', category: 'Material', rarity: 'Common', description: 'Can be sold or crafted.', quantity: 12, value: 3 }
];

interface InventoryProps {
  onClose: () => void;
}

const Inventory = ({ onClose }: InventoryProps) => {
  const [storedItems, setStoredItems] = useState<Item[]>(MOCK_ITEMS);
  const [equipment, setEquipment] = useState<Equipment>({
    Weapon: null,
    Armor: null,
    Amulet: null,
    Amulet2: null
  });
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'Name' | 'Rarity' | 'Value'>('Rarity');

  const categories: (ItemCategory | 'All')[] = ['All', 'Weapon', 'Armor', 'Amulet', 'Potion', 'Material'];

  const handleEquip = (itemToEquip: Item) => {
    if (itemToEquip.category !== 'Weapon' && itemToEquip.category !== 'Armor' && itemToEquip.category !== 'Amulet') {
      return;
    }

    setEquipment(prev => {
      const newEquipment = { ...prev };
      let targetSlot = itemToEquip.category as keyof Equipment;

      if (itemToEquip.category === 'Amulet') {
        if (!prev.Amulet) targetSlot = 'Amulet';
        else if (!prev.Amulet2) targetSlot = 'Amulet2';
        else targetSlot = 'Amulet'; 
      }

      const currentlyEquipped = prev[targetSlot];
      newEquipment[targetSlot] = itemToEquip;
      
      let newStoredItems = storedItems.filter(i => i.id !== itemToEquip.id);
      if (currentlyEquipped) {
        newStoredItems = [...newStoredItems, currentlyEquipped];
      }
      setStoredItems(newStoredItems);

      return newEquipment;
    });
  };

  const handleUnequip = (itemToUnequip: Item) => {
    // Find which slot it is in
    const entries = Object.entries(equipment) as [keyof Equipment, Item | null][];
    const slotEntry = entries.find(([_, item]) => item?.id === itemToUnequip.id);
    
    if (slotEntry) {
      const targetSlot = slotEntry[0];
      setEquipment(prev => ({
        ...prev,
        [targetSlot]: null
      }));
      setStoredItems(prev => [...prev, itemToUnequip]);
    }
  };

  return (
    <div className="inventory-overlay">
      <div className="inventory-container">

        <div className="inventory-body">
          {/* Left Sidebar - Filters & Search */}
          <div className="inventory-sidebar-left">
            <div className="sidebar-scroll-block">
              <div className="inventory-controls-header">
                <h2>Inventory</h2>
                <button className="close-btn" onClick={onClose}>×</button>
              </div>
              <div className="sidebar-title">Categories</div>
              <div className="sidebar-search-box">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="sort-controls">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'Name' | 'Rarity' | 'Value')}
                    className="sort-select"
                  >
                    <option value="Rarity">Rarity</option>
                    <option value="Name">Name</option>
                    <option value="Value">Value</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="sidebar-scroll-block filters-block">
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Storage Grid */}
          <div className="inventory-center">
            <StorageGrid
              items={storedItems.filter(item => selectedCategory === 'All' || item.category === selectedCategory)}
              onEquip={handleEquip}
              searchTerm={searchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Right Sidebar - Equipment Slots */}
          <div className="inventory-sidebar-right">
            <EquipmentSlots
              equipment={equipment}
              onUnequip={handleUnequip}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Inventory;
