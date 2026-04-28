import { Link } from "react-router-dom";
import { Package, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState } from "react";
import "./Orders.css";

const STATUS_COLOR = {
  Pending:            "badge-accent",
  Confirmed:          "badge-grey",
  Preparing:          "badge-gold",
  "Out for Delivery": "badge-accent",
  Delivered:          "badge-green",
};

const STATUS_OPTIONS = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function Orders() {
  const { orders, updateOrderStatus, user } = useApp();
  const [demoRole, setDemoRole] = useState(user?.user_metadata?.role || "Customer"); // "Customer" or "Restaurant Owner"

  // Only show orders for this user if they are a Customer.
  // Note: For MVP demo purposes, we filter by name/email match, or show all if Owner/Admin.
  const displayOrders = demoRole === "Customer" && user
    ? orders.filter(o => o.customer?.name === user.user_metadata?.full_name || o.customer?.name === user.email?.split('@')[0])
    : orders;

  if (!user) {
    return (
      <div className="page container empty-state">
        <Package size={56} />
        <h3>Login to View Orders</h3>
        <p>Please sign in to track your orders or manage restaurant deliveries.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: 20 }}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="section-header" style={{ alignItems: "center", marginBottom: 32 }}>
        <h1 className="heading-lg">
          {demoRole === "Restaurant Owner" ? "Restaurant Dashboard (Orders)" : "My Orders"}
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className="text-xs text-muted">Simulate Role:</span>
          <button 
            className={`btn btn-sm ${demoRole === 'Customer' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setDemoRole('Customer')}
          >
            Customer
          </button>
          <button 
            className={`btn btn-sm ${demoRole === 'Restaurant Owner' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setDemoRole('Restaurant Owner')}
          >
            Restaurant Owner
          </button>
        </div>
      </div>

      {displayOrders.length === 0 ? (
        <div className="empty-state">
          <Package size={56} />
          <h3>No orders found</h3>
          {demoRole === "Customer" && <p>Place an order using the name "{user.user_metadata?.full_name}" to see it here.</p>}
        </div>
      ) : (
        <div className="orders-list">
          {displayOrders.map((order) => (
            <div key={order.id} className="order-row card fade-up" style={{ padding: 20, display: "flex", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
              
              <Link to={`/orders/${order.id}`} className="order-row-id" style={{ minWidth: 200, display: "flex", gap: 16, alignItems: "center" }}>
                <div className="order-icon" style={{ background: "var(--bg3)", padding: 12, borderRadius: 12 }}>
                  <Package size={20} className="text-accent" />
                </div>
                <div>
                  <div className="heading-md">Order #{order.id}</div>
                  <div className="text-xs text-muted" style={{ marginTop: 4 }}>
                    <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              </Link>

              <div className="order-row-items text-sm text-muted" style={{ flex: 1 }}>
                {demoRole === "Restaurant Owner" && <strong style={{color:"#fff", display:"block", marginBottom:4}}>{order.customer.name} - {order.customer.phone}</strong>}
                {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ textAlign: "right" }}>
                  <div className="text-xs text-muted mb-1">Total</div>
                  <div style={{ fontWeight: 700, color: "var(--accent)" }}>Rs {order.total}</div>
                </div>

                {demoRole === "Restaurant Owner" ? (
                  <select
                    className={`input badge ${STATUS_COLOR[order.status]}`}
                    style={{ fontSize: "0.85rem", height: 38, borderColor: "transparent", color: "#fff", appearance: "none", cursor: 'pointer' }}
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(opt => <option key={opt} value={opt} style={{ color: "#000" }}>{opt}</option>)}
                  </select>
                ) : (
                  <span className={`badge ${STATUS_COLOR[order.status]}`} style={{ padding: "8px 16px" }}>
                    {order.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
