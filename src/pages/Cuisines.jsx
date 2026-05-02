import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Scale, ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Cuisines.css";

export default function Cuisines() {
  const { normalizedItems, menuItems, addToCart, restaurants, isLoading } = useApp();
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState(null);
  const navigate = useNavigate();

  const CATEGORIES = ["All", ...new Set(normalizedItems.map((i) => i.category))];

  const filtered = normalizedItems.filter((ni) => {
    const matchCat  = cat === "All" || ni.category === cat;
    const matchName = ni.canonical_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchName;
  });

  return (
    <div className="page container">
      <h1 className="heading-lg" style={{ marginBottom: 8 }}>Menu Items</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>
        Browse all food items and compare prices across restaurants
      </p>

      {/* Filters */}
      <div className="cuisines-filters">
        <div className="input-wrap" style={{ flex: 1, maxWidth: 340 }}>
          <Search size={15} />
          <input
            className="input input-icon"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="cuisine-pills">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`cuisine-pill ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="cuisines-grid">
        {filtered.map((ni) => (
          <div key={ni.id} className="cuisine-item-card card fade-up">
            <div className="cuisine-item-img-wrap">
              <img src={ni.image} alt={ni.canonical_name} className="cuisine-item-img" loading="lazy" />
              <span className="badge badge-grey cuisine-item-cat">{ni.category}</span>
            </div>
            <div className="card-body">
              <h3 className="heading-md">{ni.canonical_name}</h3>
              <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                Also known as: {ni.aliases.join(", ")}
              </p>
              <div className="cuisine-item-avg">
                {(() => {
                  const variations = menuItems.filter(m => m.normalized_item_id === ni.id || m.normalizedItemId === ni.id);
                  const minPrice = variations.length > 0 ? Math.min(...variations.map(v => v.price)) : ni.avgPrice || ni.avg_price;
                  return (
                    <>
                      Best Price: <span className="text-accent">Rs {minPrice}</span>
                    </>
                  );
                })()}
              </div>
              <div className="cuisine-item-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate(`/compare?q=${encodeURIComponent(ni.canonical_name)}`)}
                >
                  <Scale size={13} /> Compare
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const firstMenu = menuItems.find(m => m.normalized_item_id === ni.id || m.normalizedItemId === ni.id);
                    if (firstMenu) {
                      const rest = restaurants.find(r => r.id === firstMenu.restaurant_id || r.id === firstMenu.restaurantId);
                      addToCart({
                        menuItemId: firstMenu.id,
                        name: firstMenu.name,
                        price: firstMenu.price,
                        restaurantId: firstMenu.restaurant_id || firstMenu.restaurantId,
                        restaurantName: rest?.name || "Restaurant",
                        image: firstMenu.image
                      });
                      setAddedId(ni.id);
                      setTimeout(() => setAddedId(null), 1500);
                    }
                  }}
                >
                  <ShoppingCart size={13} /> {addedId === ni.id ? "Added!" : "Add"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
