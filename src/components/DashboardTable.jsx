import React from 'react';
import { Package, User, Utensils, ClipboardList, Star } from 'lucide-react';
import './DashboardTable.css';

const DashboardTable = ({ type, data, isLoading, emptyMessage = 'No data available', columns }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'Users': return <User size={20} />;
      case 'Restaurants': return <Utensils size={20} />;
      case 'Orders': return <ClipboardList size={20} />;
      case 'Menus': return <Utensils size={20} />;
      default: return <Package size={20} />;
    }
  };

  if (isLoading) {
    return (
      <div className="table-loader">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-table">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-list">
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className="dashboard-row">
            <div className="row-icon">
              {getIcon(type)}
            </div>
            <div className="row-main">
              <div className="row-title">{row[columns[0].accessor] || 'Untitled'}</div>
              <div className="row-subtitle">
                {columns.slice(1, 3).map((col, idx) => (
                  <span key={idx} style={{marginRight: 16}}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </span>
                ))}
              </div>
            </div>
            <div className="row-data-grid">
               {columns.slice(3, columns.length - 1).map((col, idx) => (
                 <div key={idx} className="row-data-item">
                    <span className="data-label">{col.header}</span>
                    <span className="data-value">{col.render ? col.render(row) : row[col.accessor]}</span>
                 </div>
               ))}
            </div>
            <div className="row-actions">
              {columns[columns.length - 1].render ? columns[columns.length - 1].render(row) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTable;
