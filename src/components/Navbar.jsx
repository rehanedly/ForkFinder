import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, ChefHat } from "lucide-react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabase";
import "./Navbar.css";

export default function Navbar() {
  const { cartCount, searchQuery, setSearchQuery, normalizedItems, user } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const allNames = normalizedItems.flatMap((ni) => [ni.canonical_name, ...(ni.aliases || [])]);

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val) {
      setShowSug(false);
      return;
    }
    const matches = allNames
      .filter((n) => n.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 5);
    setSuggestions([...new Set(matches)]);
    setShowSug(matches.length > 0);
  };

  const handleSelect = (sug) => {
    setSearchQuery(sug);
    setShowSug(false);
    navigate(`/compare?q=${encodeURIComponent(sug)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      setShowSug(false);
      navigate(`/compare?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSug(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <ChefHat size={26} />
          <span>Fork<span className="text-accent">Finder</span></span>
        </Link>

        {/* Desktop Search */}
        <div className="nav-search" ref={inputRef}>
          <form className="nav-search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search e.g. Zinger Burger..."
              value={searchQuery}
              onChange={handleChange}
              onFocus={() => { if (searchQuery) setShowSug(true); }}
            />
            <button type="submit" className="btn btn-primary nav-search-btn">
              Search
            </button>
          </form>
          {showSug && (
            <ul className="autocomplete-dropdown fade-up">
              {suggestions.map((s, idx) => (
                <li key={idx} onClick={() => handleSelect(s)}>
                  <Search size={14} /> {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop Links */}
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/restaurants" className="nav-link" onClick={() => setMenuOpen(false)}>Restaurants</Link>
          <Link to="/cuisines" className="nav-link" onClick={() => setMenuOpen(false)}>Menu Items</Link>
          <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <span className="text-sm font-medium hide-mobile">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <button 
                className="btn btn-outline btn-sm hide-mobile" 
                onClick={() => supabase.auth.signOut()}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm hide-mobile" style={{ marginLeft: 8 }} onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          )}

          <Link to="/cart" className="nav-cart-btn btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={16} />
            <span className="hide-mobile" style={{ marginLeft: 6 }}>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {user && (
           <button 
             className="nav-link nav-mobile-only" 
             style={{ display: 'none', background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '12px 16px', textAlign: 'left', fontWeight: 600, width: '100%' }}
             onClick={() => { supabase.auth.signOut(); setMenuOpen(false); }}
           >
             Logout
           </button>
          )}
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile-only styles block purely for the logout trigger rendering logic if open */}
      <style>{`
        @media (max-width: 768px) {
          .nav-mobile-only { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
