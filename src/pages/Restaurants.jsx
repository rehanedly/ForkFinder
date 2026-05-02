import { useState, useMemo } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { useApp } from "../context/AppContext";
import RestaurantCard from "../components/RestaurantCard";
import "./Restaurants.css";

export default function Restaurants() {
  const { restaurants, isLoading } = useApp();
  const [cuisine, setCuisine] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState("All");
  const [search, setSearch] = useState("");

  const CUISINES = useMemo(() => {
    return ["All", ...new Set(restaurants.map((r) => r.cuisine))];
  }, [restaurants]);

  const filtered = useMemo(() => restaurants.filter((r) => {
    const matchCuisine = cuisine === "All" || r.cuisine === cuisine;
    const matchRating  = r.rating >= minRating;
    const matchPrice   = priceRange === "All" || r.price_range === priceRange || r.priceRange === priceRange;
    const matchSearch  = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCuisine && matchRating && matchPrice && matchSearch;
  }), [restaurants, cuisine, minRating, priceRange, search]);

  return (
    <div className="page container">
      <h1 className="heading-lg" style={{ marginBottom: 8 }}>All Restaurants</h1>
      <p className="text-muted" style={{ marginBottom: 32 }}>
        Browse and discover top restaurants in Lahore
      </p>

      {/* Filters */}
      <div className="rest-filters">
        <div className="input-wrap" style={{ flex: 1 }}>
          <Search size={15} />
          <input
            className="input input-icon"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="cuisine-pills">
          {CUISINES.map((c) => (
            <button
              key={c}
              className={`cuisine-pill ${cuisine === c ? "active" : ""}`}
              onClick={() => setCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="rating-filter">
          <SlidersHorizontal size={14} />
          <label>Rating</label>
          <select
            className="input"
            style={{ width: "auto", padding: "8px 12px" }}
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {[0, 3, 3.5, 4, 4.2, 4.5].map((v) => (
              <option key={v} value={v}>{v === 0 ? "Any" : `${v}+`}</option>
            ))}
          </select>
        </div>
        <div className="rating-filter">
          <label>Price</label>
          <select
            className="input"
            style={{ width: "auto", padding: "8px 12px" }}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            {["All", "$", "$$", "$$$"].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Search size={48} />
          <h3>No restaurants found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
}
