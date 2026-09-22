import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Collection.css';
import CollectionCard, { CollectionItem } from './CollectionCard';

// Importing assets
import normalMenuFrame from '../../assets/Battle/ui/menu_normal.png';
import activeMenuFrame from '../../assets/Battle/ui/menu_active.png';
import buyButton from '../../assets/Shop/market-assets/buy-button.png';

// Characters/Enemies
import orcCard from '../../assets/Battle/characters/orc_card.png';
import goblin from '../../assets/Battle/characters/goblin.png';

// Classes
import slashSword from '../../assets/Battle/icons/slash_sword.png';
import healChalice from '../../assets/Battle/icons/heal_chalice.png';
import manaCluster from '../../assets/Battle/icons/mana_cluster.png';

// Items
import ironSword from '../../assets/Shop/market-assets/iron-sword.png';
import elvenBow from '../../assets/Shop/market-assets/elven-bow.png';
import dragonBlade from '../../assets/Shop/market-assets/dragon-blade.png';
import mageStaff from '../../assets/Shop/market-assets/mage-staff.png';
import heavyArmor from '../../assets/Shop/market-assets/heavy-armor.png';
import leatherArmor from '../../assets/Shop/market-assets/leather-armor.png';
import healingPotion from '../../assets/Shop/market-assets/healing-potion.png';
import manaPotion from '../../assets/Shop/market-assets/mana-potion.png';

type Category = 'Heroes' | 'Classes' | 'Enemies' | 'Weapons' | 'Armor' | 'Potions';

const categories: Category[] = ['Heroes', 'Classes', 'Enemies', 'Weapons', 'Armor', 'Potions'];

const collectionData: CollectionItem[] = [
  // Heroes
  { id: 'orc', name: 'The Orc', category: 'Heroes', description: 'A fierce warrior from the outlands.', image: orcCard, rarity: 'Legendary', stats: { HP: 200, Mana: 50 }, lore: 'Driven from his homeland, he seeks redemption and the Crown of Ash.' },
  
  // Classes
  { id: 'warrior', name: 'Warrior', category: 'Classes', description: 'Masters of melee combat and physical defense.', image: slashSword, rarity: 'Common', lore: 'Warriors focus on brute strength and endurance, thriving in the frontline of any battle.' },
  { id: 'mage', name: 'Mage', category: 'Classes', description: 'Wielders of arcane magic and elemental forces.', image: manaCluster, rarity: 'Common', lore: 'Mages trade physical resilience for devastating area attacks and crowd control.' },
  { id: 'paladin', name: 'Paladin', category: 'Classes', description: 'Holy knights who mix combat with healing arts.', image: healChalice, rarity: 'Common', lore: 'Sworn to divine oaths, paladins protect their allies and smite the wicked.' },
  
  // Enemies - Level I
  { id: 'skeleton', name: 'Skeleton', category: 'Enemies', description: 'Reanimated bones bound by dark magic.', image: goblin, rarity: 'Common', discovered: true, stats: { HP: 20, Damage: 3 }, lore: 'Usually found in ancient ruins, guarding their final resting place.' },
  { id: 'goblin', name: 'Goblin', category: 'Enemies', description: 'Sneaky and fast enemies found in the lowlands.', image: goblin, rarity: 'Common', discovered: true, stats: { HP: 30, Damage: 5 }, lore: 'Goblins hunt in packs and are known for setting nasty traps.' },
  { id: 'troll', name: 'Troll', category: 'Enemies', description: 'A hulking beast with regenerative abilities.', image: orcCard, rarity: 'Uncommon', discovered: false },
  { id: 'slime', name: 'Slime', category: 'Enemies', description: 'Acidic gelatinous cube.', image: healingPotion, rarity: 'Common', discovered: false },
  { id: 'phantom', name: 'Phantom', category: 'Enemies', description: 'An ethereal spirit that haunts the living.', image: manaCluster, rarity: 'Uncommon', discovered: false },
  { id: 'chimera', name: 'Chimera', category: 'Enemies', description: 'A terrifying amalgamation of beasts.', image: goblin, rarity: 'Rare', discovered: false },
  { id: 'demon', name: 'Demon', category: 'Enemies', description: 'A spawn from the underworld.', image: orcCard, rarity: 'Rare', discovered: false },
  
  // Enemies - Level II
  { id: 'skeleton-knight', name: 'Skeleton Knight', category: 'Enemies', description: 'A skeleton clad in rusty armor.', image: goblin, rarity: 'Uncommon', discovered: false },
  { id: 'hobgoblin', name: 'Hobgoblin', category: 'Enemies', description: 'A larger, more aggressive goblin variant.', image: goblin, rarity: 'Uncommon', discovered: false },
  { id: 'warrior-troll', name: 'Warrior Troll', category: 'Enemies', description: 'A troll armed with crude weapons.', image: orcCard, rarity: 'Rare', discovered: false },
  { id: 'great-slime', name: 'Great Slime', category: 'Enemies', description: 'A massive slime capable of engulfing adventurers.', image: healingPotion, rarity: 'Uncommon', discovered: false },
  { id: 'wraith', name: 'Wraith', category: 'Enemies', description: 'A vengeful spirit with a chilling touch.', image: manaCluster, rarity: 'Rare', discovered: false },
  { id: 'great-chimera', name: 'Great Chimera', category: 'Enemies', description: 'An older, more dangerous chimera.', image: goblin, rarity: 'Epic', discovered: false },
  { id: 'greater-demon', name: 'Greater Demon', category: 'Enemies', description: 'A high-ranking demon of immense power.', image: orcCard, rarity: 'Epic', discovered: false },

  // Enemies - Level III
  { id: 'the-lich', name: 'The Lich', category: 'Enemies', description: 'An undead sorcerer of unimaginable power.', image: goblin, rarity: 'Legendary', discovered: false },
  { id: 'lordgoblin', name: 'Lordgoblin', category: 'Enemies', description: 'The absolute ruler of the goblin hordes.', image: goblin, rarity: 'Epic', discovered: false },
  { id: 'troll-king', name: 'Troll King', category: 'Enemies', description: 'The ancient king of all trolls.', image: orcCard, rarity: 'Legendary', discovered: false },
  { id: 'king-slime', name: 'King Slime', category: 'Enemies', description: 'The original slime from which all others split.', image: healingPotion, rarity: 'Legendary', discovered: false },
  { id: 'dread-wraith', name: 'Dread Wraith', category: 'Enemies', description: 'A wraith that feeds on sheer terror.', image: manaCluster, rarity: 'Epic', discovered: false },
  { id: 'divine-chimera', name: 'Divine Chimera', category: 'Enemies', description: 'A mythical chimera with celestial traits.', image: goblin, rarity: 'Legendary', discovered: false },
  { id: 'demon-lord', name: 'Demon Lord', category: 'Enemies', description: 'The ruler of the underworld.', image: orcCard, rarity: 'Legendary', discovered: false },
  
  // Weapons
  { id: 'iron-sword', name: 'Iron Sword', category: 'Weapons', description: 'Reliable and sharp.', image: ironSword, rarity: 'Common', stats: { Damage: 12 } },
  { id: 'elven-bow', name: 'Elven Bow', category: 'Weapons', description: 'Swift and silent.', image: elvenBow, rarity: 'Rare', stats: { Damage: 18, Speed: '+10%' } },
  { id: 'dragon-blade', name: 'Dragon Blade', category: 'Weapons', description: 'Forged in fire.', image: dragonBlade, rarity: 'Epic', stats: { Damage: 35, Fire: '+15' } },
  { id: 'mage-staff', name: 'Mage Staff', category: 'Weapons', description: 'Channel the arcane.', image: mageStaff, rarity: 'Uncommon', stats: { Damage: 10, Magic: '+20' } },
  
  // Armor
  { id: 'heavy-armor', name: 'Heavy Armor', category: 'Armor', description: 'Stand firm.', image: heavyArmor, rarity: 'Rare', stats: { Defense: 25, Speed: '-5%' } },
  { id: 'leather-armor', name: 'Leather Armor', category: 'Armor', description: 'Light and flexible.', image: leatherArmor, rarity: 'Common', stats: { Defense: 10 } },
  
  // Potions
  { id: 'healing-potion', name: 'Healing Potion', category: 'Potions', description: 'Restores your health.', image: healingPotion, rarity: 'Common', stats: { Effect: 'Restore 50 HP' } },
  { id: 'mana-potion', name: 'Mana Potion', category: 'Potions', description: 'Replenishes your mana.', image: manaPotion, rarity: 'Common', stats: { Effect: 'Restore 30 Mana' } },
];

type CollectionProps = {
  onBack: () => void;
  onPlayButtonSound: () => void;
};

function Collection({ onBack, onPlayButtonSound }: CollectionProps) {
  // Default to Heroes page
  const [activeCategory, setActiveCategory] = useState<Category>('Heroes');
  
  const shownItems = useMemo(() => 
    collectionData.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="collection-overlay">
      <div className="collection-container">

        <div className="collection-body">
          {/* Left Sidebar - Navigation */}
          <aside className="collection-sidebar-left">
            <div className="collection-controls-header">
              <h2 className="collection-heading" style={{ margin: 0, fontSize: '1.8rem' }}>✦ COLLECTION ✦</h2>
            </div>
            
            <h2 className="collection-heading" style={{ fontSize: '1.4rem', marginTop: '10px' }}>PAGES</h2>
            <nav className="collection-menu">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={activeCategory === cat ? 'active' : ''}
                  style={{ backgroundImage: `url(${activeCategory === cat ? activeMenuFrame : normalMenuFrame})` }}
                  onClick={() => {
                    onPlayButtonSound();
                    setActiveCategory(cat);
                  }}
                >
                  <b className="collection-page-btn-text">{cat}</b>
                </button>
              ))}
            </nav>

            <div className="collection-back-button-container">
               <button className="collection-back-btn" onClick={() => { onPlayButtonSound(); onBack(); }}>
                 <img src={buyButton} alt="Back" />
                 <span>Back</span>
               </button>
            </div>
          </aside>

          {/* Center - Collection Grid */}
          <div className="collection-center">
             <div className="collection-grid">
               <AnimatePresence mode="wait">
                 {shownItems.map((item) => (
                   <motion.div 
                     key={item.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     layout
                   >
                     <CollectionCard item={item} />
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Collection;
