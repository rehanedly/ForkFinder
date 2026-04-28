import { useParams, Link } from "react-router-dom";
import { CheckCircle, Clock, Package, Truck, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./OrderTracking.css";

const STATUSES = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];
const STATUS_ICONS = {
  Pending:          <Clock size={18} />,
  Confirmed:        <CheckCircle size={18} />,
  Preparing:        <Package size={18} />,
  "Out for Delivery": <Truck size={18} />,
  Delivered:        <Star size={18} />,
};

export default function OrderTracking() {
  const { id } = useParams();
  const { getOrder, updateOrderStatus } = useApp();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="page container empty-state">
        <Package size={48} />
        <h3>Order #{id} not found</h3>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</Link>
      </div>
    );
  }

  const currentIdx = STATUSES.indexOf(order.status);
  const nextStatus = STATUSES[currentIdx + 1];

  return (
    <div className="page container">
      <div className="order-header fade-up">
        <div>
          <h1 className="heading-lg">Order #{order.id}</h1>
          <p className="text-muted text-sm" style={{ marginTop: 6 }}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className={`order-status-badge badge ${order.status === "Delivered" ? "badge-green" : "badge-accent"}`}>
          {STATUS_ICONS[order.status]}
          {order.status}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="tracking-steps fade-up">
        {STATUSES.map((s, i) => {
          const isCompleted = i <= currentIdx;
          const isCurrent   = i === currentIdx;
          return (
            <div key={s} className={`tracking-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
              <div className="step-icon">
                {STATUS_ICONS[s]}
              </div>
              <span className="step-label">{s}</span>
              {i < STATUSES.length - 1 && (
                <div className={`step-connector ${i < currentIdx ? "connector-done" : ""}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="order-layout">
        {/* Items */}
        <div className="order-items-card card fade-up">
          <div className="card-body">
            <h3 className="heading-md" style={{ marginBottom: 16 }}>Order Items</h3>
            {order.items.map((item) => (
              <div key={item.menuItemId} className="order-item-row">
                <img src={item.image} alt={item.name} className="order-item-img" />
                <div className="order-item-body">
                  <div className="order-item-name">{item.name}</div>
                  <div className="text-sm text-muted">{item.restaurantName}</div>
                </div>
                <div className="text-sm text-muted">×{item.qty}</div>
                <div className="order-item-price">Rs {item.price * item.qty}</div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="heading-md">Total</span>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)" }}>
                Rs {order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="order-info-col">
          <div className="card fade-up">
            <div className="card-body">
              <h3 className="heading-md" style={{ marginBottom: 12 }}>Delivery Info</h3>
              <div className="info-row"><span>Name</span><span>{order.customer.name}</span></div>
              <div className="info-row"><span>Phone</span><span>{order.customer.phone}</span></div>
              <div className="info-row"><span>Address</span><span>{order.customer.address}</span></div>
              <div className="info-row"><span>Payment</span><span className="badge badge-gold">💵 COD</span></div>
            </div>
          </div>

          {/* Demo: advance status */}
          {nextStatus && (
            <div className="card fade-up" style={{ marginTop: 16 }}>
              <div className="card-body">
                <p className="text-muted text-sm" style={{ marginBottom: 12 }}>
                  Simulate order progression (demo):
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => updateOrderStatus(order.id, nextStatus)}
                >
                  Advance to: {nextStatus}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
