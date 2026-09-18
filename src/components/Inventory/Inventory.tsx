import { useState, useMemo } from 'react';
import { Item, Equipment, ItemCategory } from '../../types/inventory';
import EquipmentSlots from './EquipmentSlots';
import StorageGrid from './StorageGrid';
import './Inventory.css';

import crossedSwords from '../../assets/Battle/items/crossed_swords.png';
import hammer from '../../assets/Battle/items/hammer.png';
import potion from '../../assets/Battle/items/potion.png';
import armor from '../../assets/Battle/items/armor.png';
import shield from '../../assets/Battle/items/shield.png';
import ring from '../../assets/Battle/items/ring.png';
import crystal from '../../assets/Battle/items/crystal.png';
import helmet from '../../assets/Battle/items/helmet.png';
import boots from '../../assets/Battle/items/boots.png';
import hood from '../../assets/Battle/items/hood.png';
import skull from '../../assets/Battle/items/skull.png';

import sectionPanelFrame from '../../assets/Battle/ui/section_panel_frame.png';
import normalMenuFrame from '../../assets/Battle/ui/menu_normal.png';
import activeMenuFrame from '../../assets/Battle/ui/menu_active.png';

// Mock data for initial testing
const MOCK_ITEMS: Item[] = [
  { id: '1', name: 'Iron Sword', category: 'Weapon', rarity: 'Common', description: 'A basic iron sword.', stats: { damage: 5 }, value: 10, imageUrl: crossedSwords },
  { id: '2', name: 'Steel Sword', category: 'Weapon', rarity: 'Uncommon', description: 'A sharp steel sword.', stats: { damage: 12 }, value: 35, imageUrl: crossedSwords },
  { id: '3', name: 'Dragonbone Blade', category: 'Weapon', rarity: 'Legendary', description: 'A blade forged from ancient dragon bone. It pulses with heat.', stats: { damage: 55 }, effects: ['Fire Damage +10', 'Chance to burn'], value: 500, imageUrl: hammer },
  { id: '4', name: 'Leather Tunic', category: 'Armor', rarity: 'Common', description: 'Basic protection.', stats: { defense: 3 }, value: 8, imageUrl: armor },
  { id: '5', name: 'Mithril Chainmail', category: 'Armor', rarity: 'Epic', description: 'Lightweight and incredibly strong.', stats: { defense: 25, hp: 50 }, value: 200, imageUrl: armor },
  { id: '6', name: 'Ruby Amulet', category: 'Amulet', rarity: 'Rare', description: 'A glowing red amulet.', stats: { hp: 100 }, effects: ['HP Regen +1/s'], value: 150, imageUrl: ring },
  { id: '7', name: 'Health Potion', category: 'Potion', rarity: 'Common', description: 'Restores 50 HP.', effects: ['Restore 50 HP'], quantity: 5, value: 5, imageUrl: potion },
  { id: '8', name: 'Wolf Pelt', category: 'Material', rarity: 'Common', description: 'Can be sold or crafted.', quantity: 12, value: 3, imageUrl: hood },
  { id: '9', name: 'Wooden Bow', category: 'Weapon', rarity: 'Common', description: 'A simple hunting bow.', stats: { damage: 8 }, value: 15, imageUrl: crossedSwords },
  { id: '10', name: 'Elven Dagger', category: 'Weapon', rarity: 'Rare', description: 'Light and incredibly sharp.', stats: { damage: 22 }, effects: ['Attack Speed +10%'], value: 120, imageUrl: crossedSwords },
  { id: '11', name: 'Iron Shield', category: 'Armor', rarity: 'Uncommon', description: 'Sturdy iron shield.', stats: { defense: 15 }, value: 40, imageUrl: shield },
  { id: '12', name: 'Obsidian Plate', category: 'Armor', rarity: 'Legendary', description: 'Armor made from volcanic glass.', stats: { defense: 60, hp: 150 }, effects: ['Reflect 5% Damage'], value: 850, imageUrl: armor },
  { id: '13', name: 'Silver Ring', category: 'Amulet', rarity: 'Uncommon', description: 'A faintly glowing silver ring.', stats: { hp: 25 }, effects: ['Mana Regen +0.5/s'], value: 65, imageUrl: ring },
  { id: '14', name: 'Staff of Frost', category: 'Weapon', rarity: 'Epic', description: 'Radiates a chilling aura.', stats: { damage: 38 }, effects: ['Frost Damage +15', 'Slows Enemies'], value: 400, imageUrl: crystal },
  { id: '15', name: 'Mana Potion', category: 'Potion', rarity: 'Common', description: 'Restores 30 Mana.', effects: ['Restore 30 Mana'], quantity: 10, value: 8, imageUrl: potion },
  { id: '16', name: 'Greater Health Potion', category: 'Potion', rarity: 'Rare', description: 'Restores 200 HP.', effects: ['Restore 200 HP'], quantity: 3, value: 35, imageUrl: potion },
  { id: '17', name: 'Iron Ore', category: 'Material', rarity: 'Common', description: 'Used for crafting basic weapons.', quantity: 25, value: 2, imageUrl: crystal },
  { id: '18', name: 'Gold Ingot', category: 'Material', rarity: 'Rare', description: 'Highly valuable material.', quantity: 5, value: 150, imageUrl: crystal }
];


const Inventory = () => {
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
          <aside className="inventory-sidebar-left">
            <div className="inventory-controls-header">
              <h2 className="menu-heading" style={{ margin: 0 }}>✦ INVENTORY ✦</h2>
            </div>
            
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
            
            <h2 className="menu-heading" style={{ fontSize: '1.2rem', marginTop: '10px' }}>CATEGORIES</h2>
            <nav className="battle-menu">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={selectedCategory === cat ? 'active' : ''}
                  style={{ backgroundImage: `url(${selectedCategory === cat ? activeMenuFrame : normalMenuFrame})` }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <b style={{ fontSize: '1.1rem', margin: '0 auto' }}>{cat}</b>
                </button>
              ))}
            </nav>
          </aside>

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
