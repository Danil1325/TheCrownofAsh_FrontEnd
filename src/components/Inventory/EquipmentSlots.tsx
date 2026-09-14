import { Equipment, Item } from '../../types/inventory';
import ItemCard from './ItemCard';
import './EquipmentSlots.css';

interface EquipmentSlotsProps {
  equipment: Equipment;
  onUnequip: (item: Item) => void;
}

const EquipmentSlots = ({ equipment, onUnequip }: EquipmentSlotsProps) => {
  return (
    <div className="equipment-slots-container">
      <div className="equipment-header">
        <h3>Equipped Items</h3>
      </div>
      <div className="slots-wrapper">
        <div className="equipment-slot">
          <div className="slot-label">Armor</div>
          {equipment.Armor ? (
            <ItemCard item={equipment.Armor} onUnequip={onUnequip} isEquipped={true} />
          ) : (
            <div className="empty-slot">Empty</div>
          )}
        </div>
        
        <div className="equipment-slot">
          <div className="slot-label">Weapon</div>
          {equipment.Weapon ? (
            <ItemCard item={equipment.Weapon} onUnequip={onUnequip} isEquipped={true} />
          ) : (
            <div className="empty-slot">Empty</div>
          )}
        </div>
        
        <div className="equipment-slot">
          <div className="slot-label">Amulet</div>
          {equipment.Amulet ? (
            <ItemCard item={equipment.Amulet} onUnequip={onUnequip} isEquipped={true} />
          ) : (
            <div className="empty-slot">Empty</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentSlots;
