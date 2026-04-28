import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, TrendingUp, Zap, Scale } from "lucide-react";
import { useApp } from "../context/AppContext";
import RestaurantCard from "../components/RestaurantCard";
import StarRating from "../components/StarRating";
import "./Home.css";

function ComparisonCard({ item, menuItems, restaurants }) {
  const navigate = useNavigate();
  const entries = menuItems
    .filter((m) => m.normalized_item_id === item.normalizedItemId)
    .sort((a, b) => a.price - b.price);
  const minPrice = entries[0]?.price;
  const maxPrice = entries[entries.length - 1]?.price;

  return (
    <div
      className="comparison-card card fade-up"
      onClick={() => navigate(`/compare?q=${encodeURIComponent(item.label)}`)}
    >
      <div className="comparison-card-header">
        <h3 className="heading-md">{item.label}</h3>
        <span className="badge badge-accent">
          {entries.length} restaurants
        </span>
      </div>
      <div className="comparison-entries">
        {entries.map((e) => {
          const rest = restaurants.find((r) => r.id === e.restaurant_id);
          return (
            <div key={e.id} className="comp-entry">
              <div className="comp-rest-name">{rest?.name}</div>
              <div className={`comp-price ${e.price === minPrice ? "comp-lowest" : ""}`}>
                Rs {e.price}
                {e.price === minPrice && <span className="comp-best-badge">Best</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="comparison-footer">
        <span className="text-sm text-muted">
          From Rs {minPrice} – Rs {maxPrice}
        </span>
        <button className="btn btn-outline btn-sm">
          Compare <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { searchQuery, setSearchQuery, restaurants, normalizedItems, menuItems, isLoading } = useApp();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const navigate = useNavigate();

  // Temporary static featured comparisons logic
  const featuredComparisons = [
    { normalizedItemId: 1, label: "Zinger Burger" },
    { normalizedItemId: 3, label: "Fries" },
    { normalizedItemId: 2, label: "Chicken Burger" },
  ];

  const allNames = normalizedItems.flatMap((ni) => [ni.canonical_name, ...ni.aliases]);

  const handleChange = (val) => {
    setQuery(val);
    if (val.trim().length > 1) {
      const filtered = [...new Set(allNames.filter((n) =>
        n.toLowerCase().includes(val.toLowerCase())
      ))].slice(0, 6);
      setSuggestions(filtered);
      setShowSug(true);
    } else {
      setShowSug(false);
    }
  };

  const go = (val) => {
    setShowSug(false);
    navigate(`/compare?q=${encodeURIComponent(val)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) go(query.trim());
  };

  const featuredRestaurants = restaurants.filter((r) => r.featured);

  return (
    <div className="home-page">
      {/* ─── Hero ────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge badge badge-accent fade-up">
            <Zap size={12} /> Smart Price Comparison
          </div>
          <h1 className="heading-xl hero-title fade-up">
            Find the <span className="text-accent">Best Deal</span><br />
            on Your Favourite Food
          </h1>
          <p className="hero-subtitle text-muted fade-up">
            Compare menu prices across Lahore's top restaurants in seconds. Order directly from the best deal.
          </p>

          {/* Hero Search */}
          <div className="hero-search-wrap fade-up" style={{ position: "relative" }}>
            <form onSubmit={handleSubmit} className="hero-search-form">
              <div className="input-wrap hero-input-wrap">
                <Search size={18} />
                <input
                  className="input input-icon hero-input"
                  placeholder="Search e.g. Zinger Burger, Fries, Pizza..."
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg hero-search-btn">
                Compare Prices
              </button>
            </form>
            {showSug && suggestions.length > 0 && (
              <ul className="autocomplete-dropdown slide-down" style={{ zIndex: 50 }}>
                {suggestions.map((s) => (
                  <li key={s} onClick={() => go(s)}>
                    <Search size={13} /> {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hero-pills fade-up">
            {["Zinger Burger", "Fries", "Margherita Pizza", "Chicken Shawarma"].map((p) => (
              <button key={p} className="hero-pill" onClick={() => go(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats strip ─────────────────────────────────────────── */}
      <section className="stats-strip">
        <div className="container stats-inner">
          {[
            { n: "5+", label: "Restaurants" },
            { n: "6+", label: "Menu Categories" },
            { n: "100%", label: "Free to Use" },
            { n: "COD", label: "Easy Checkout" },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-n">{s.n}</div>
              <div className="stat-label text-muted text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Featured Comparisons ────────────────────────────────── */}
      <section className="section container">
        <div className="section-header">
          <h2>🔥 Popular Comparisons</h2>
          <a href="/cuisines" className="view-all">View all <ArrowRight size={14} /></a>
        </div>
        <div className="grid-3">
          {featuredComparisons.map((fc) => (
            <ComparisonCard key={fc.normalizedItemId} item={fc} menuItems={menuItems} restaurants={restaurants} />
          ))}
        </div>
      </section>

      {/* ─── Featured Restaurants ────────────────────────────────── */}
      <section className="section container">
        <div className="section-header">
          <h2>🍽️ Featured Restaurants</h2>
          <a href="/restaurants" className="view-all">View all <ArrowRight size={14} /></a>
        </div>
        <div className="grid-3">
          {featuredRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────────────── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: "center", textAlign: "center" }}>
            <h2>How ForkFinder Works</h2>
          </div>
          <div className="grid-3 how-grid">
            {[
              { icon: <Search size={28} />, step: "1", title: "Search", desc: "Type any food item and we'll find it across every restaurant." },
              { icon: <Scale size={28} />, step: "2", title: "Compare", desc: "See all prices side-by-side, sorted by value. Filter by cuisine or rating." },
              { icon: <ShoppingCartIcon size={28} />, step: "3", title: "Order", desc: "Add from the best deal and checkout in seconds. COD available." },
            ].map((h) => (
              <div key={h.step} className="how-card">
                <div className="how-icon">{h.icon}</div>
                <div className="how-step">Step {h.step}</div>
                <h3 className="heading-md">{h.title}</h3>
                <p className="text-muted text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ShoppingCartIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}
