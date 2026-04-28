import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, ChefHat } from "lucide-react";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount, searchQuery, setSearchQuery, normalizedItems } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  const allNames = normalizedItems.flatMap((ni) => [
    ni.canonical_name,
    ...ni.aliases,
  ]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const filtered = [...new Set(allNames.filter((n) =>
        n.toLowerCase().includes(q.toLowerCase())
      ))].slice(0, 6);
      setSuggestions(filtered);
      setShowSug(true);
    } else {
      setShowSug(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSug(false);
      navigate(`/compare?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const pickSuggestion = (s) => {
    setSearchQuery(s);
    setShowSug(false);
    navigate(`/compare?q=${encodeURIComponent(s)}`);
  };

  // close dropdown on outside click
  useEffect(() => {
    const h = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target))
        setShowSug(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/restaurants", label: "Restaurants" },
    { to: "/cuisines", label: "Menu Items" },
    { to: "/orders", label: "My Orders" },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <ChefHat size={28} />
          <span>Fork<span className="text-accent">Finder</span></span>
        </Link>

        {/* Search */}
        <div className="nav-search" ref={inputRef}>
          <form onSubmit={handleSubmit} className="input-wrap nav-search-form">
            <Search size={16} style={{ left: 14 }} />
            <input
              className="input input-icon nav-search-input"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm nav-search-btn">
              Search
            </button>
          </form>
          {showSug && suggestions.length > 0 && (
            <ul className="autocomplete-dropdown slide-down">
              {suggestions.map((s) => (
                <li key={s} onClick={() => pickSuggestion(s)}>
                  <Search size={13} />
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link to="/cart" className="nav-cart-btn btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen((p) => !p)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
