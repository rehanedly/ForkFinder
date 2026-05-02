import React, { useState } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Users');

  const tabs = [
    'Users', 'Restaurants', 'Orders', 'Menus', 'Reviews', 'Featured Items'
  ];

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Admin Panel</h2>
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
        <h1>Admin Dashboard</h1>
        <div className="dashboard-content">
          <h2>{activeTab} Management</h2>
          <p>Here you can manage {activeTab.toLowerCase()} within the system. This section is currently a placeholder and will be connected to the backend APIs.</p>
          <div className="placeholder-table">
            <p>Data grid for {activeTab} will appear here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
