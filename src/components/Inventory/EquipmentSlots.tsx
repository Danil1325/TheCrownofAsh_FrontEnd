import { Equipment, Item } from '../../types/inventory';
import ItemCard from './ItemCard';
import './EquipmentSlots.css';

interface EquipmentSlotsProps {
  equipment: Equipment;
  onUnequip: (item: Item) => void;
}

const EquipmentSlots = ({ equipment, onUnequip }: EquipmentSlotsProps) => {
  const slots: (keyof Equipment)[] = ['Weapon', 'Armor', 'Amulet', 'Amulet2'];

  return (
    <div className="equipment-slots-container">
      <div className="equipment-header">
        <h3>Equipped Items</h3>
      </div>
      <div className="slots-wrapper">
        {slots.map(slotName => {
          const item = equipment[slotName];
          return (
            <div key={slotName} className="equipment-slot">
              {item ? (
                <ItemCard 
                  item={item} 
                  isEquipped={true} 
                  onUnequip={() => onUnequip(item)} 
                />
              ) : (
                <div className="empty-slot">
                  Empty
                </div>
              )}
              <div className="slot-label">{slotName.replace('2', '')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentSlots;
