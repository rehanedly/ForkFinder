import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState } from "react";
import "./Cart.css";

const STATUS_FLOW = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, placeOrder } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("cart"); // cart | checkout

  // Group items by restaurant
  const grouped = cart.reduce((acc, item) => {
    const key = item.restaurantId;
    if (!acc[key]) acc[key] = { name: item.restaurantName, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim() || !/^[\d+\-() ]{10,}$/.test(form.phone)) errs.phone = "Valid phone required";
    if (!form.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrder = () => {
    if (!validate()) return;
    const orderId = placeOrder(form);
    navigate(`/orders/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="page container empty-state">
        <ShoppingBag size={56} />
        <h3>Your cart is empty</h3>
        <p>Browse restaurants and add items to get started</p>
        <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: 20 }}>
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1 className="heading-lg" style={{ marginBottom: 32 }}>
        {step === "cart" ? "Your Cart" : "Checkout"}
      </h1>

      <div className="cart-layout">
        {/* Left: items / checkout form */}
        <div className="cart-main">
          {step === "cart" ? (
            <>
              {Object.values(grouped).map((group) => (
                <div key={group.name} className="cart-group">
                  <h3 className="cart-group-name">{group.name}</h3>
                  {group.items.map((item) => (
                    <div key={item.menuItemId} className="cart-item fade-up">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-body">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-rest text-sm text-muted">{item.restaurantName}</div>
                      </div>
                      <div className="cart-item-controls">
                        <button className="qty-btn" onClick={() => updateQty(item.menuItemId, item.qty - 1)}>
                          <Minus size={13} />
                        </button>
                        <span className="qty-val">{item.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.menuItemId, item.qty + 1)}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <div className="cart-item-price">Rs {item.price * item.qty}</div>
                      <button className="cart-remove" onClick={() => removeFromCart(item.menuItemId)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <div className="checkout-form">
              <h3 className="heading-md" style={{ marginBottom: 20 }}>Delivery Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className={`input ${errors.name ? "input-error" : ""}`}
                  placeholder="e.g. Ali Hassan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className={`input ${errors.phone ? "input-error" : ""}`}
                  placeholder="e.g. 0300-1234567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  className={`input ${errors.address ? "input-error" : ""}`}
                  placeholder="House #, Street, Area, City"
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{ resize: "vertical" }}
                />
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>
              <div className="cod-badge">
                💵 Cash on Delivery (COD) — Payment at your door
              </div>
            </div>
          )}
        </div>

        {/* Right: summary */}
        <div className="cart-summary card">
          <div className="card-body">
            <h3 className="heading-md" style={{ marginBottom: 20 }}>Order Summary</h3>
            <div className="summary-rows">
              {cart.map((i) => (
                <div key={i.menuItemId} className="summary-row">
                  <span className="text-sm">{i.name} × {i.qty}</span>
                  <span className="text-sm text-accent">Rs {i.price * i.qty}</span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div className="summary-total">
              <span className="heading-md">Total</span>
              <span className="summary-total-val">Rs {cartTotal}</span>
            </div>
            {step === "cart" ? (
              <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={() => setStep("checkout")}>
                Proceed to Checkout
              </button>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={handleOrder}>
                  Place Order (COD)
                </button>
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => setStep("cart")}>
                  Back to Cart
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
