import { Link } from "react-router-dom";
import "./Footer.css";

function ChefHatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-1.2 0-2.4.6-3 1.7A3.6 3.6 0 0 0 4.6 9c-1 0-2 .8-2 1.9C2.6 13 4 14 5.6 14h12.8c1.6 0 3-1 3-3.1 0-1.1-1-1.9-2-1.9a3.6 3.6 0 0 0-4.4-4.3C14.4 3.6 13.2 3 12 3Z"/>
      <path d="M7 14v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="nav-logo" style={{ marginBottom: 12 }}>
            <ChefHatIcon />
            <span>Fork<span className="text-accent">Finder</span></span>
          </Link>
          <p className="text-sm text-muted" style={{ maxWidth: 260 }}>
            Compare food prices across restaurants and order your favorites — all in one place.
          </p>
          <div className="footer-socials">
            <a href="#"><InstagramIcon /></a>
            <a href="#"><TwitterIcon /></a>
            <a href="#"><FacebookIcon /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/cuisines">Menu Items</Link>
          <Link to="/compare?q=Zinger+Burger">Compare Prices</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="text-xs text-muted">© 2026 ForkFinder. All rights reserved.</p>
      </div>
    </footer>
  );
}
