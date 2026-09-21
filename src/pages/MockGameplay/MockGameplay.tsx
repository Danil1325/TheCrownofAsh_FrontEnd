import { useState } from 'react';
import Inventory from '../../components/Inventory/Inventory';
import './MockGameplay.css';

const MockGameplay = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  return (
    <div className="gameplay-screen">
      {/* Left Sidebar */}
      <div className="sidebar left-sidebar">
        <div className="sidebar-header">Character</div>
        <div className="sidebar-content">
          <p>Level: 10</p>
          <p>Class: Warrior</p>
          <div className="health-bar">
            <div className="health-fill" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="main-game-area">
        <div className="scene-view">
          <h1>The Dark Forest</h1>
          <p>You stand before a gloomy path. Monsters lurk in the shadows.</p>
          <button className="action-btn">Explore</button>
        </div>

        {/* Overlay Inventory if open */}
        {isInventoryOpen && (
          <Inventory onClose={() => setIsInventoryOpen(false)} />
        )}
      </div>

      {/* Right Sidebar */}
      <div className="sidebar right-sidebar">
        <div className="sidebar-header">Actions</div>
        <div className="sidebar-content action-menu">
          <button className="menu-btn" onClick={() => setIsInventoryOpen(true)}>
            🎒 Inventory
          </button>
          <button className="menu-btn">🗺️ Map</button>
          <button className="menu-btn">📖 Quest Log</button>
          <button className="menu-btn">⚙️ Settings</button>
        </div>
      </div>
    </div>
  );
};

export default MockGameplay;
