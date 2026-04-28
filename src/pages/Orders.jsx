import { Link } from "react-router-dom";
import { Package, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Orders.css";

const STATUS_COLOR = {
  Pending:            "badge-accent",
  Confirmed:          "badge-grey",
  Preparing:          "badge-gold",
  "Out for Delivery": "badge-accent",
  Delivered:          "badge-green",
};

export default function Orders() {
  const { orders } = useApp();

  if (orders.length === 0) {
    return (
      <div className="page container empty-state">
        <Package size={56} />
        <h3>No orders yet</h3>
        <p>Place your first order from the cart</p>
        <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: 20 }}>
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="heading-lg" style={{ marginBottom: 32 }}>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <Link key={order.id} to={`/orders/${order.id}`} className="order-row card fade-up">
            <div className="order-row-id">
              <div className="order-icon">
                <Package size={18} />
              </div>
              <div>
                <div className="heading-md">Order #{order.id}</div>
                <div className="text-xs text-muted">
                  <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="order-row-items text-sm text-muted">
              {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className={`badge ${STATUS_COLOR[order.status]}`}>
                {order.status}
              </span>
              <span style={{ fontWeight: 700, color: "var(--accent)", whiteSpace: "nowrap" }}>
                Rs {order.total}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
