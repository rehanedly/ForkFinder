import React, { useState } from 'react';
import './AdminDashboard.css'; // Reusing styles

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = ['Profile', 'Orders', 'Menus'];

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Restaurant Panel</h2>
        <nav>
          {tabs.map(tab => (
            <button 
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <main className="dashboard-main">
        <h1>Restaurant Dashboard</h1>
        <div className="dashboard-content">
          <h2>{activeTab} Management</h2>
          <p>Manage your {activeTab.toLowerCase()} below. This section will be connected to the specific restaurant owner APIs.</p>
          <div className="placeholder-table">
             <p>{activeTab} details will load here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
