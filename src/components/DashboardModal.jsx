import React from 'react';
import { X } from 'lucide-react';
import './DashboardModal.css';

const DashboardModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>{title}</h2>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardModal;
