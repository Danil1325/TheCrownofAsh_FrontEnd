import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Achievements.css';

// Importing assets
import normalMenuFrame from '../../assets/Battle/ui/menu_normal.png';
import activeMenuFrame from '../../assets/Battle/ui/menu_active.png';
import buyButton from '../../assets/Shop/market-assets/buy-button.png';

// Icons for achievements
import chestIcon from '../../assets/ui/Chest Icon.png';
import coinIcon from '../../assets/Icons/Coin.png';
import slashSword from '../../assets/Battle/icons/slash_sword.png';
import healChalice from '../../assets/Battle/icons/heal_chalice.png';
import manaCluster from '../../assets/Battle/icons/mana_cluster.png';
import orcCard from '../../assets/Battle/characters/orc_card.png';
import goblin from '../../assets/Battle/characters/goblin.png';

import commonBg from '../../assets/Achievements/Common Achievement.png';
import rareBg from '../../assets/Achievements/Rare Achievement.png';
import legendaryBg from '../../assets/Achievements/Legendary Achievement.png';

type Category = 'All' | 'Completed' | 'In Progress';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  reward?: string;
};

const achievementsData: Achievement[] = [
  { id: 'first_blood', title: 'First Blood', description: 'Defeat your first enemy.', icon: slashSword, progress: 1, total: 1, reward: '100 Gold' },
  { id: 'wealthy', title: 'Wealthy', description: 'Accumulate 10,000 gold coins.', icon: coinIcon, progress: 1250, total: 10000, reward: 'Golden Chalice' },
  { id: 'hoarder', title: 'Hoarder', description: 'Collect 50 items in your inventory.', icon: chestIcon, progress: 12, total: 50 },
  { id: 'healer', title: 'Master Healer', description: 'Restore 1,000 HP using potions or spells.', icon: healChalice, progress: 1000, total: 1000, reward: 'Title: The Divine' },
  { id: 'orc_slayer', title: 'Orc Slayer', description: 'Defeat 100 Orcs in battle.', icon: orcCard, progress: 45, total: 100 },
  { id: 'magic_adept', title: 'Magic Adept', description: 'Cast 50 spells.', icon: manaCluster, progress: 50, total: 50, reward: '500 Gold' },
  { id: 'goblin_bane', title: 'Goblin Bane', description: 'Clear the goblin camp.', icon: goblin, progress: 0, total: 1 },
];

type AchievementsProps = {
  onBack: () => void;
  onPlayButtonSound: () => void;
};

function Achievements({ onBack, onPlayButtonSound }: AchievementsProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  
  const shownAchievements = useMemo(() => {
    return achievementsData.filter((achievement) => {
      const isCompleted = achievement.progress >= achievement.total;
      if (activeCategory === 'Completed') return isCompleted;
      if (activeCategory === 'In Progress') return !isCompleted;
      return true;
    });
  }, [activeCategory]);

  const categories: Category[] = ['All', 'Completed', 'In Progress'];

  return (
    <div className="achievements-overlay">
      <div className="achievements-container">
        <div className="achievements-body">
          {/* Left Sidebar - Navigation */}
          <aside className="achievements-sidebar-left">
            <div className="achievements-controls-header">
              <h2 className="achievements-heading" style={{ margin: 0, fontSize: '1.4rem' }}>✦ ACHIEVEMENTS ✦</h2>
            </div>
            
            <h2 className="achievements-heading" style={{ fontSize: '1.2rem', marginTop: '10px' }}>FILTERS</h2>
            <nav className="achievements-menu">
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
                  <b className="achievements-page-btn-text">{cat}</b>
                </button>
              ))}
            </nav>

            <div className="achievements-progress-summary">
                <div className="summary-title">Completion</div>
                <div className="summary-value">
                  {Math.round((achievementsData.filter(a => a.progress >= a.total).length / achievementsData.length) * 100)}%
                </div>
            </div>

            <div className="achievements-back-button-container">
               <button className="achievements-back-btn" onClick={() => { onPlayButtonSound(); onBack(); }}>
                 <img src={buyButton} alt="Back" />
                 <span>Back</span>
               </button>
            </div>
          </aside>

          {/* Center - Achievements Grid */}
          <div className="achievements-center">
             <div className="achievements-list">
               <AnimatePresence mode="wait">
                 {shownAchievements.map((achievement) => {
                   const isCompleted = achievement.progress >= achievement.total;
                   const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.total) * 100));
                   
                   let bgTexture = commonBg;
                   if (isCompleted) bgTexture = legendaryBg;
                   else if (achievement.progress > 0) bgTexture = rareBg;
                   
                   return (
                     <motion.div 
                       key={achievement.id}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ duration: 0.2 }}
                       layout
                       className={`achievement-card ${isCompleted ? 'completed' : 'in-progress'}`}
                       style={{ backgroundImage: `url('${bgTexture}')` }}
                     >
                       <div className="achievement-icon-wrapper">
                         <img src={achievement.icon} alt={achievement.title} className="achievement-icon" />
                       </div>
                       
                       <div className="achievement-details">
                         <h3 className="achievement-title">{achievement.title}</h3>
                         <p className="achievement-description">{achievement.description}</p>
                         
                         <div className="achievement-progress-text">
                           {achievement.progress} / {achievement.total}
                         </div>
                         <div className="achievement-progress-bar-container">
                           <div className="achievement-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                         </div>
                       </div>

                       {achievement.reward && (
                         <div className="achievement-reward">
                           <span className="reward-label">Reward:</span>
                           <span className="reward-value">{achievement.reward}</span>
                         </div>
                       )}
                     </motion.div>
                   )
                 })}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievements;
