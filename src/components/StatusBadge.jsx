import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, type = 'status' }) => {
  const getStatusClass = (status) => {
    if (!status) return 'status-default';
    const s = status.toLowerCase();
    
    // Order Statuses
    if (s === 'pending') return 'status-pending';
    if (s === 'confirmed' || s === 'preparing') return 'status-info';
    if (s === 'out for delivery') return 'status-warning';
    if (s === 'delivered') return 'status-success';
    
    // Roles
    if (s === 'admin') return 'role-admin';
    if (s === 'restaurant owner') return 'role-owner';
    if (s === 'customer') return 'role-customer';
    
    return 'status-default';
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
