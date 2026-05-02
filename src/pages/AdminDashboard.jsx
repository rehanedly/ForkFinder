import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DashboardTable from '../components/DashboardTable';
import StatusBadge from '../components/StatusBadge';
import DashboardModal from '../components/DashboardModal';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [
    'Users', 'Restaurants', 'Orders', 'Menus', 'Reviews'
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let query;
      if (activeTab === 'Users') {
        query = supabase.from('users').select('*').order('created_at', { ascending: false });
      } else if (activeTab === 'Restaurants') {
        query = supabase.from('restaurants').select('*').order('name');
      } else if (activeTab === 'Orders') {
        query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      } else if (activeTab === 'Menus') {
        query = supabase.from('normalized_items').select('*').order('canonical_name');
      } else if (activeTab === 'Reviews') {
        query = supabase.from('reviews').select('*').order('date', { ascending: false });
      }

      const { data: result, error } = await query;
      if (error) throw error;
      setData(result);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
      if (error) throw error;
      fetchData(); // Refresh data
    } catch (error) {
      alert('Error updating role: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const tableMap = {
        'Restaurants': 'restaurants',
        'Menus': 'normalized_items'
      };
      
      const { error } = await supabase
        .from(tableMap[activeTab])
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Error deleting item: ' + error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const tableMap = {
        'Restaurants': 'restaurants',
        'Menus': 'normalized_items'
      };

      // Remove restricted fields
      const { id, created_at, owner_id, ...updateData } = formData;

      const { error } = await supabase
        .from(tableMap[activeTab])
        .update(updateData)
        .eq('id', editingItem.id);

      if (error) throw error;
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Update Error:', error);
      alert('Error saving changes: ' + (error.message || 'Check console for details'));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Users':
        return (
          <DashboardTable
            isLoading={loading}
            data={data}
            type="Users"
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Email', accessor: 'email' },
              { 
                header: 'Role', 
                accessor: 'role',
                render: (row) => <StatusBadge status={row.role} />
              },
              { 
                header: 'Actions', 
                render: (row) => (
                  <select 
                    className="role-selector"
                    value={row.role}
                    onChange={(e) => handleRoleChange(row.id, e.target.value)}
                  >
                    <option value="Customer">Customer</option>
                    <option value="Restaurant Owner">Restaurant Owner</option>
                    <option value="Admin">Admin</option>
                  </select>
                )
              }
            ]}
          />
        );
      case 'Restaurants':
        return (
          <DashboardTable
            isLoading={loading}
            data={data}
            type="Restaurants"
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Cuisine', accessor: 'cuisine' },
              { header: 'Address', accessor: 'address' },
              { header: 'Rating', accessor: 'rating', render: (row) => `⭐ ${row.rating}` },
              { 
                header: 'Featured', 
                render: (row) => (
                  <input 
                    type="checkbox" 
                    checked={row.featured} 
                    onChange={async () => {
                      const { error } = await supabase.from('restaurants').update({ featured: !row.featured }).eq('id', row.id);
                      if (!error) fetchData();
                    }}
                  />
                ) 
              },
              { 
                header: 'Actions', 
                render: (row) => (
                  <div className="table-actions">
                    <button className="action-btn btn-edit" onClick={() => handleEdit(row)}>Edit</button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(row.id)}>Delete</button>
                  </div>
                )
              }
            ]}
          />
        );
      case 'Orders':
        return (
          <DashboardTable
            isLoading={loading}
            data={data}
            type="Orders"
            columns={[
              { header: 'Order ID', accessor: 'id' },
              { header: 'Customer', accessor: 'customer_name' },
              { header: 'Amount', accessor: 'total', render: (row) => `$${row.total}` },
              { 
                header: 'Status', 
                accessor: 'status',
                render: (row) => <StatusBadge status={row.status} />
              },
              { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() }
            ]}
          />
        );
      case 'Menus':
        return (
          <DashboardTable
            isLoading={loading}
            data={data}
            type="Menus"
            columns={[
              { header: 'Item Name', accessor: 'canonical_name' },
              { header: 'Category', accessor: 'category' },
              { header: 'Avg Price', accessor: 'avg_price', render: (row) => `$${row.avg_price}` },
              { 
                header: 'Featured', 
                render: (row) => (
                  <input 
                    type="checkbox" 
                    checked={row.featured} 
                    onChange={async () => {
                      const { error } = await supabase.from('normalized_items').update({ featured: !row.featured }).eq('id', row.id);
                      if (!error) fetchData();
                    }}
                  />
                ) 
              },
              { 
                header: 'Actions', 
                render: (row) => (
                  <div className="table-actions">
                    <button className="action-btn btn-edit" onClick={() => handleEdit(row)}>Edit</button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(row.id)}>Delete</button>
                  </div>
                )
              }
            ]}
          />
        );
      case 'Reviews':
        return (
          <DashboardTable
            isLoading={loading}
            data={data}
            columns={[
              { header: 'User', accessor: 'user_name' },
              { header: 'Rating', accessor: 'rating', render: (row) => `⭐ ${row.rating}` },
              { header: 'Comment', accessor: 'comment' },
              { header: 'Date', accessor: 'date' }
            ]}
          />
        );
      default:
        return null;
    }
  };

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
        <header className="dashboard-header">
          <h1>{activeTab} Management</h1>
          <button className="refresh-btn" onClick={fetchData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </header>
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </main>

      <DashboardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Edit ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={handleSave} className="modal-form">
          {activeTab === 'Restaurants' && (
            <>
              <div className="form-group">
                <label>Restaurant Name</label>
                <input 
                  className="input"
                  value={formData.name || ''} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Cuisine</label>
                <input 
                  className="input"
                  value={formData.cuisine || ''} 
                  onChange={(e) => setFormData({...formData, cuisine: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input 
                  className="input"
                  value={formData.address || ''} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  required 
                />
              </div>
            </>
          )}
          {activeTab === 'Menus' && (
            <>
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  className="input"
                  value={formData.canonical_name || ''} 
                  onChange={(e) => setFormData({...formData, canonical_name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input 
                  className="input"
                  value={formData.category || ''} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Average Price</label>
                <input 
                  className="input"
                  type="number"
                  value={formData.avg_price || ''} 
                  onChange={(e) => setFormData({...formData, avg_price: e.target.value})} 
                  required 
                />
              </div>
            </>
          )}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </DashboardModal>
    </div>
  );
}
