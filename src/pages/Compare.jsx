import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowUpDown, ShoppingCart, Scale, ChevronUp, ChevronDown } from "lucide-react";
import { useApp } from "../context/AppContext";
import StarRating from "../components/StarRating";
import "./Compare.css";

export default function Compare() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { normalizedItems, menuItems, restaurants, addToCart, isLoading } = useApp();
  
  const [sortDir, setSortDir] = useState("asc");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [addedId, setAddedId] = useState(null);

  // Search logic
  const normalizedItem = useMemo(() => {
    if (!query) return null;
    const q = query.toLowerCase();
    return normalizedItems.find((ni) =>
      ni.canonical_name.toLowerCase() === q ||
      (ni.aliases && ni.aliases.some((a) => a.toLowerCase() === q)) ||
      ni.canonical_name.toLowerCase().includes(q) ||
      (ni.aliases && ni.aliases.some((a) => a.toLowerCase().includes(q)))
    );
  }, [query, normalizedItems]);

  const entries = useMemo(() => {
    if (!normalizedItem) return [];
    return menuItems
      .filter((m) => Number(m.normalized_item_id) === normalizedItem.id || Number(m.normalizedItemId) === normalizedItem.id)
      .map((m) => {
        const rest = restaurants.find((r) => r.id === Number(m.restaurant_id) || r.id === Number(m.restaurantId));
        return { ...m, restaurant: rest };
      })
      .filter((e) => e.restaurant);
  }, [normalizedItem, menuItems, restaurants]);

  const cuisines = useMemo(() => {
    return ["All", ...new Set(entries.map((e) => e.restaurant.cuisine))];
  }, [entries]);

  const filtered = useMemo(() => {
    return entries
      .filter((e) => cuisineFilter === "All" || e.restaurant.cuisine === cuisineFilter)
      .sort((a, b) => sortDir === "asc" ? a.price - b.price : b.price - a.price);
  }, [entries, cuisineFilter, sortDir]);

  const minPrice = filtered.length ? Math.min(...filtered.map((e) => e.price)) : null;

  const handleAdd = (entry) => {
    addToCart({
      menuItemId: entry.id,
      name: entry.name,
      price: entry.price,
      restaurantId: entry.restaurant_id || entry.restaurantId,
      restaurantName: entry.restaurant.name,
      image: entry.image,
    });
    setAddedId(entry.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const suggestions = !normalizedItem && query
    ? normalizedItems.filter((ni) =>
        ni.canonical_name.toLowerCase().includes(query.toLowerCase().slice(0, 3)) ||
        (ni.aliases && ni.aliases.some((a) => a.toLowerCase().includes(query.toLowerCase().slice(0, 3))))
      ).slice(0, 3)
    : [];

  if (isLoading) return <div className="page container empty-state"><h3>Loading Comparison...</h3></div>;

  return (
    <div className="page container">
      <div className="compare-header fade-up">
        <div>
          <h1 className="heading-lg">
            {normalizedItem ? (
              <><span className="text-accent">{normalizedItem.canonical_name}</span> Comparison</>
            ) : (
              <>Search Results for "{query}"</>
            )}
          </h1>
          {normalizedItem && normalizedItem.aliases && (
            <p className="text-muted text-sm" style={{ marginTop: 6 }}>
              Also listed as: {normalizedItem.aliases.join(" · ")}
            </p>
          )}
        </div>
        {normalizedItem && (
          <img src={normalizedItem.image} alt={normalizedItem.canonical_name} className="compare-hero-img" />
        )}
      </div>

      {normalizedItem ? (
        <>
          {/* Controls */}
          <div className="compare-controls">
            <div className="cuisine-pills">
              {cuisines.map((c) => (
                <button
                  key={c}
                  className={`cuisine-pill ${cuisineFilter === c ? "active" : ""}`}
                  onClick={() => setCuisineFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              className="btn btn-ghost btn-sm sort-btn"
              onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
            >
              <ArrowUpDown size={14} />
              Price: {sortDir === "asc" ? "Low → High" : "High → Low"}
            </button>
          </div>

          {/* Table */}
          <div className="compare-table-wrap fade-up">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Cuisine</th>
                  <th>Rating</th>
                  <th>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      Price
                      {sortDir === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr key={entry.id} className={entry.price === minPrice ? "best-row" : ""}>
                    <td>
                      <Link to={`/restaurants/${entry.restaurant_id || entry.restaurantId}`} className="rest-link">
                        <img src={entry.restaurant.image} alt="" className="rest-thumb" />
                        <div>
                          <div className="rest-link-name">{entry.restaurant.name}</div>
                          <div className="text-xs text-muted">{entry.restaurant.address}</div>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-grey">{entry.restaurant.cuisine}</span>
                    </td>
                    <td>
                      <StarRating rating={entry.restaurant.rating} />
                    </td>
                    <td>
                      <div className="price-cell">
                        <span className={`price-tag ${entry.price === minPrice ? "price-best" : ""}`}>
                          Rs {entry.price}
                        </span>
                        {entry.price === minPrice && (
                          <span className="badge badge-green">🏆 Best Price</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${entry.available ? "badge-green" : "badge-grey"}`}>
                        {entry.available ? "✓ Available" : "Unavailable"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${addedId === entry.id ? "btn-ghost" : "btn-primary"}`}
                        onClick={() => handleAdd(entry)}
                        disabled={!entry.available}
                      >
                        <ShoppingCart size={13} />
                        {addedId === entry.id ? "Added!" : "Add to Cart"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Scale size={48} />
          <h3>No exact match found for "{query}"</h3>
          <p>Did you mean one of these?</p>
          {suggestions.length > 0 && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              {suggestions.map((s) => (
                <Link
                  key={s.id}
                  to={`/compare?q=${encodeURIComponent(s.canonical_name)}`}
                  className="btn btn-outline"
                >
                  {s.canonical_name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
