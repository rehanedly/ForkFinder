import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DashboardTable from '../components/DashboardTable';
import StatusBadge from '../components/StatusBadge';
import DashboardModal from '../components/DashboardModal';
import './AdminDashboard.css'; // Reusing styles

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [data, setData] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = ['Profile', 'Orders', 'Menus'];

  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRestaurant();
    }
  }, [user]);

  useEffect(() => {
    if (restaurant) {
      fetchData();
    }
  }, [activeTab, restaurant]);

  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setUser(session.user);
  };

  const fetchRestaurant = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching restaurant:', error.message);
    } else {
      setRestaurant(data);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'Orders') {
        // Fetch orders that contain items from this restaurant
        const { data: orders, error } = await supabase
          .from('order_items')
          .select('order_id, orders(*)')
          .eq('restaurant_name', restaurant.name); 
        
        if (error) throw error;
        // Deduplicate orders
        const uniqueOrders = Array.from(new Set(orders.map(o => o.orders.id)))
          .map(id => orders.find(o => o.orders.id === id).orders);
        setData(uniqueOrders);
      } else if (activeTab === 'Menus') {
        const { data: items, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('restaurant_id', restaurant.id);
        
        if (error) throw error;
        setData(items);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const table = activeTab === 'Profile' ? 'restaurants' : 'menu_items';
      const { error } = await supabase
        .from(table)
        .update(formData)
        .eq('id', editingItem.id);

      if (error) throw error;
      setIsModalOpen(false);
      activeTab === 'Profile' ? fetchRestaurant() : fetchData();
    } catch (error) {
      alert('Error saving changes: ' + error.message);
    }
  };

  const handleAvailabilityToggle = async (itemId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ available: !currentStatus })
        .eq('id', itemId);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Error toggling availability: ' + error.message);
    }
  };

  const renderContent = () => {
    if (!restaurant) return <p>Loading restaurant profile...</p>;

    switch (activeTab) {
      case 'Profile':
        return (
          <div className="profile-details card fade-up">
            <h2>{restaurant.name}</h2>
            <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Hours:</strong> {restaurant.open_hours}</p>
            <p><strong>Rating:</strong> ⭐ {restaurant.rating} ({restaurant.reviews} reviews)</p>
            <button className="btn btn-primary" style={{marginTop: '20px'}} onClick={() => handleEdit(restaurant)}>Edit Profile</button>
          </div>
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
                render: (row) => <StatusBadge status={row.status} />
              },
              { 
                header: 'Actions', 
                render: (row) => (
                  <select 
                    className="role-selector"
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                )
              }
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
              { header: 'Item Name', accessor: 'name' },
              { header: 'Category', accessor: 'category' },
              { header: 'Price', accessor: 'price', render: (row) => `$${row.price}` },
              { 
                header: 'Available', 
                render: (row) => (
                  <input 
                    type="checkbox" 
                    checked={row.available} 
                    onChange={() => handleAvailabilityToggle(row.id, row.available)}
                  />
                ) 
              },
              { 
                header: 'Actions', 
                render: (row) => (
                  <button className="action-btn btn-edit" onClick={() => handleEdit(row)}>Edit Price</button>
                )
              }
            ]}
          />
        );
      default:
        return null;
    }
  };

  if (!user) return <div className="dashboard-container"><p style={{padding: '40px'}}>Please login to access the dashboard.</p></div>;

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
        <header className="dashboard-header">
          <h1>{activeTab} Management</h1>
          <button className="refresh-btn" onClick={fetchData} disabled={loading || !restaurant}>
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
        title={activeTab === 'Profile' ? 'Edit Restaurant Profile' : 'Edit Menu Item'}
      >
        <form onSubmit={handleSave} className="modal-form">
          {activeTab === 'Profile' && (
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
              <div className="form-group">
                <label>Hours</label>
                <input 
                  className="input"
                  value={formData.open_hours || ''} 
                  onChange={(e) => setFormData({...formData, open_hours: e.target.value})} 
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
                  value={formData.name || ''} 
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Price (Rs)</label>
                <input 
                  className="input"
                  type="number"
                  value={formData.price || ''} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
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
