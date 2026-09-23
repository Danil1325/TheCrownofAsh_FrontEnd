import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Achievements.css';
import { ApiError } from '../../api/authApi';
import { getAchievementsOverview } from '../../api/achievementApi';
import type {
  AchievementsOverviewResponse,
  PlayerAchievement,
} from '../../types/achievements';

// Importing assets
import normalMenuFrame from '../../assets/Battle/ui/menu_normal.png';
import activeMenuFrame from '../../assets/Battle/ui/menu_active.png';
import buyButton from '../../assets/Shop/market-assets/buy-button.png';

// Icons for achievements (frontend presentation only — progress always comes from the backend)
import chestIcon from '../../assets/ui/Chest Icon.png';
import slashSword from '../../assets/Battle/icons/slash_sword.png';
import crossedSwords from '../../assets/Battle/items/crossed_swords.png';
import boots from '../../assets/Battle/items/boots.png';
import scrolls from '../../assets/Shop/category-menu/scrolls.png';
import mapIcon from '../../assets/Battle/icons/map.png';
import theSword from '../../assets/items/weapons/TheSword.png';

import commonBg from '../../assets/Achievements/Common Achievement.png';
import rareBg from '../../assets/Achievements/Rare Achievement.png';
import legendaryBg from '../../assets/Achievements/Legendary Achievement.png';

type Category = 'All' | 'Completed' | 'In Progress';

type LoadState = 'loading' | 'ready' | 'no-character' | 'error';

/** Presentation-only icon per backend achievement code; unknown codes fall back. */
const ACHIEVEMENT_ICON_BY_CODE: Record<string, string> = {
  A_HERO_IS_BORN: slashSword,
  FIRST_STEPS: boots,
  QUEST_CONQUEROR: scrolls,
  FIRST_BLOOD: crossedSwords,
  VICTORIOUS_WARRIOR: theSword,
  WANDERER: mapIcon,
  EXPLORER: mapIcon,
};

function iconFor(code: string): string {
  return ACHIEVEMENT_ICON_BY_CODE[code] ?? chestIcon;
}

type AchievementsProps = {
  onBack: () => void;
  onPlayButtonSound: () => void;
};

function Achievements({ onBack, onPlayButtonSound }: AchievementsProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [overview, setOverview] = useState<AchievementsOverviewResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAchievementsOverview()
      .then((data) => {
        if (cancelled) return;
        setOverview(data);
        setLoadState('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) {
          setLoadState('no-character');
        } else {
          setLoadError(
            error instanceof ApiError
              ? error.message
              : 'Unable to load your achievements. Please try again.',
          );
          setLoadState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allAchievements = useMemo(
    () =>
      overview
        ? [...overview.locked, ...overview.inProgress, ...overview.unlocked]
        : [],
    [overview],
  );

  const shownAchievements = useMemo(() => {
    if (!overview) return [];
    let filtered: PlayerAchievement[];
    if (activeCategory === 'Completed') filtered = overview.unlocked;
    else if (activeCategory === 'In Progress') filtered = overview.inProgress;
    else filtered = allAchievements;

    return [...filtered].sort((a, b) => {
      const score = (achievement: PlayerAchievement) => {
        if (achievement.isCompleted) return 3;
        if (achievement.currentAmount === 0) return 2;
        return 1;
      };
      return score(b) - score(a);
    });
  }, [activeCategory, overview, allAchievements]);

  const categories: Category[] = ['All', 'Completed', 'In Progress'];

  const completionPercent =
    overview && overview.totalCount > 0
      ? Math.round((overview.completedCount / overview.totalCount) * 100)
      : 0;

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
              {categories.map((cat) => (
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
              <div className="summary-value">{completionPercent}%</div>
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
            {loadState === 'loading' && (
              <div className="achievements-status" role="status">
                <p className="achievements-status-text">Loading your achievements…</p>
              </div>
            )}

            {loadState === 'no-character' && (
              <div className="achievements-status achievements-status--error" role="alert">
                <p className="achievements-status-text">
                  No character found. Start a new game to begin unlocking achievements.
                </p>
              </div>
            )}

            {loadState === 'error' && (
              <div className="achievements-status achievements-status--error" role="alert">
                <p className="achievements-status-text">{loadError}</p>
              </div>
            )}

            {loadState === 'ready' && overview != null && shownAchievements.length === 0 && (
              <div className="achievements-status" role="status">
                <p className="achievements-status-text">
                  No achievements to show here yet. Complete quests and battles to unlock some.
                </p>
              </div>
            )}

            {loadState === 'ready' && overview != null && shownAchievements.length > 0 && (
              <div className="achievements-list">
                <AnimatePresence mode="wait">
                  {shownAchievements.map((achievement) => {
                    const isCompleted = achievement.isCompleted;
                    const isStarted = achievement.currentAmount > 0;
                    const progressPercent = Math.min(
                      100,
                      Math.round((achievement.currentAmount / achievement.targetAmount) * 100),
                    );

                    let bgTexture = commonBg;
                    if (isCompleted) bgTexture = legendaryBg;
                    else if (isStarted) bgTexture = rareBg;

                    let cardState = 'locked';
                    if (isCompleted) cardState = 'completed';
                    else if (isStarted) cardState = 'in-progress';

                    let statusLabel = 'LOCKED';
                    let statusClass = 'badge-locked';
                    if (isCompleted) {
                      statusLabel = 'UNLOCKED';
                      statusClass = 'badge-unlocked';
                    } else if (isStarted) {
                      statusLabel = 'IN PROGRESS';
                      statusClass = 'badge-in-progress';
                    }

                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        layout
                        className={`achievement-card ${cardState}`}
                        style={{ backgroundImage: `url('${bgTexture}')` }}
                      >
                        <div className="achievement-icon-wrapper">
                          <img src={iconFor(achievement.code)} alt={achievement.title} className="achievement-icon" />
                        </div>

                        <div className="achievement-details">
                          <h3 className="achievement-title">{achievement.title}</h3>
                          <p className="achievement-description">{achievement.description}</p>

                          <div className="achievement-progress-text">
                            {achievement.currentAmount} / {achievement.targetAmount}
                          </div>
                          <div className="achievement-progress-bar-container">
                            <div className="achievement-progress-bar" style={{ width: `${progressPercent}%` }}></div>
                          </div>

                          <span className={`achievement-status-badge ${statusClass}`}>{statusLabel}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievements;