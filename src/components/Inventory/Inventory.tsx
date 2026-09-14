import { useState } from 'react';
import { Item, Equipment } from '../../types/inventory';
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
    Amulet: null
  });

  const handleEquip = (itemToEquip: Item) => {
    // Only allow equipping Weapon, Armor, Amulet
    if (itemToEquip.category !== 'Weapon' && itemToEquip.category !== 'Armor' && itemToEquip.category !== 'Amulet') {
      return; // Cannot equip potions or materials directly into these slots
    }

    const category = itemToEquip.category as keyof Equipment;
    const currentlyEquipped = equipment[category];

    // Remove the item being equipped from storage
    let newStoredItems = storedItems.filter(i => i.id !== itemToEquip.id);

    // If there is an item currently in the slot, put it back in storage
    if (currentlyEquipped) {
      newStoredItems = [...newStoredItems, currentlyEquipped];
    }

    setEquipment({
      ...equipment,
      [category]: itemToEquip
    });
    setStoredItems(newStoredItems);
  };

  const handleUnequip = (itemToUnequip: Item) => {
    const category = itemToUnequip.category as keyof Equipment;
    
    setEquipment({
      ...equipment,
      [category]: null
    });
    
    setStoredItems([...storedItems, itemToUnequip]);
  };

  // Calculate derived stats for display
  const totalStats = {
    hp: (equipment.Armor?.stats?.hp || 0) + (equipment.Amulet?.stats?.hp || 0) + (equipment.Weapon?.stats?.hp || 0),
    damage: (equipment.Weapon?.stats?.damage || 0) + (equipment.Armor?.stats?.damage || 0) + (equipment.Amulet?.stats?.damage || 0),
    defense: (equipment.Armor?.stats?.defense || 0) + (equipment.Weapon?.stats?.defense || 0) + (equipment.Amulet?.stats?.defense || 0)
  };

  return (
    <div className="inventory-overlay">
      <div className="inventory-container">
        
        <div className="inventory-header">
          <h2>Inventory</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="inventory-stats-bar">
          <div className="stat-item"><span>HP Bonus:</span> <span className="stat-value">+{totalStats.hp}</span></div>
          <div className="stat-item"><span>Damage Bonus:</span> <span className="stat-value">+{totalStats.damage}</span></div>
          <div className="stat-item"><span>Defense Bonus:</span> <span className="stat-value">+{totalStats.defense}</span></div>
        </div>

        <EquipmentSlots 
          equipment={equipment} 
          onUnequip={handleUnequip} 
        />
        
        <StorageGrid 
          items={storedItems} 
          onEquip={handleEquip} 
        />
        
      </div>
    </div>
  );
};

export default Inventory;
