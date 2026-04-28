import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPin, Clock, ArrowLeft, ShoppingCart, Scale } from "lucide-react";
import { useApp } from "../context/AppContext";
import StarRating from "../components/StarRating";
import "./RestaurantDetail.css";

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, menuItems, reviews, addToCart, isLoading, user, addReview } = useApp();
  const restaurant = restaurants.find((r) => r.id === Number(id));
  const [activeCategory, setActiveCategory] = useState("All");

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    
    // Check if user already reviewed (from SRS: One review per user per restaurant)
    const alreadyReviewed = reviews.some(r => (Number(r.restaurant_id) === Number(id) || Number(r.restaurantId) === Number(id)) && r.user_id === user.id);
    if (alreadyReviewed) {
      alert("You have already reviewed this restaurant.");
      setSubmittingReview(false);
      return;
    }

    const newReview = {
      restaurant_id: Number(id),
      user_id: user.id,
      user_name: user.user_metadata?.full_name || user.email.split('@')[0],
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString().split('T')[0]
    };

    const success = await addReview(newReview);
    if (success) {
      setReviewForm({ rating: 5, comment: "" });
      alert("Review posted successfully!");
    } else {
      alert("Failed to submit review.");
    }
    setSubmittingReview(false);
  };

  if (isLoading) return <div className="page container empty-state"><h3>Loading...</h3></div>;

  if (!restaurant) {
    return (
      <div className="page container empty-state">
        <h3>Restaurant not found</h3>
        <Link to="/restaurants" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const items = menuItems.filter((m) => Number(m.restaurant_id) === restaurant.id || Number(m.restaurantId) === restaurant.id);
  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const restaurantReviews = reviews.filter((r) => Number(r.restaurant_id) === restaurant.id || Number(r.restaurantId) === restaurant.id);
  const displayItems = activeCategory === "All"
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="page">
      {/* Banner */}
      <div className="rest-detail-banner">
        <img src={restaurant.image} alt={restaurant.name} />
        <div className="rest-detail-banner-overlay" />
        <div className="container rest-detail-banner-content">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Back
          </button>
          <div className="rest-detail-info fade-up">
            {restaurant.featured && (
              <span className="badge badge-gold">⭐ Featured</span>
            )}
            <h1 className="heading-xl" style={{ color: "#fff" }}>{restaurant.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }}>
              {restaurant.cuisine} · {restaurant.priceRange}
            </p>
            <StarRating rating={restaurant.rating} count={restaurant.reviews} />
            <div className="rest-meta">
              <span><MapPin size={13} /> {restaurant.address}</span>
              <span><Clock size={13} /> {restaurant.openHours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40 }}>
        <div className="rest-detail-layout">
          {/* Menu */}
          <div className="rest-detail-main">
            <div className="section-header">
              <h2>Menu</h2>
              <div className="cuisine-pills" style={{ marginBottom: 0 }}>
                {categories.map((c) => (
                  <button
                    key={c}
                    className={`cuisine-pill ${activeCategory === c ? "active" : ""}`}
                    onClick={() => setActiveCategory(c)}
                    style={{ fontSize: "0.78rem", padding: "4px 12px" }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-list">
              {displayItems.map((item) => (
                <div key={item.id} className="menu-row fade-up">
                  <img src={item.image} alt={item.name} className="menu-row-img" />
                  <div className="menu-row-body">
                    <div>
                      <h3 className="menu-row-name">{item.name}</h3>
                      <span className="badge badge-grey text-xs" style={{ marginTop: 4 }}>
                        {item.category}
                      </span>
                    </div>
                    <div className="menu-row-actions">
                      <div className="menu-row-price">Rs {item.price}</div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/compare?q=${encodeURIComponent(item.name)}`)}
                      >
                        <Scale size={12} /> Compare
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!item.available}
                        onClick={() =>
                          addToCart({
                            menuItemId: item.id,
                            name: item.name,
                            price: item.price,
                            restaurantId: restaurant.id,
                            restaurantName: restaurant.name,
                            image: item.image,
                          })
                        }
                      >
                        <ShoppingCart size={12} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Sidebar */}
          <div className="rest-detail-sidebar">
            <h2 style={{ marginBottom: 20 }}>Reviews</h2>
            
            {user ? (
              <form className="review-form card fade-up" onSubmit={handleReviewSubmit} style={{ padding: 20, marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12 }}>Leave a Review</h4>
                <div className="form-group">
                  <label>Rating (1-5)</label>
                  <select 
                    className="input" 
                    value={reviewForm.rating} 
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  >
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment</label>
                  <textarea 
                    className="input" 
                    rows={3} 
                    placeholder="What did you think?"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="card fade-up" style={{ padding: 20, marginBottom: 24, textAlign: "center" }}>
                <p className="text-muted text-sm" style={{ marginBottom: 12 }}>You must be logged in to leave a review.</p>
                <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
              </div>
            )}

            {restaurantReviews.length === 0 ? (
              <p className="text-muted text-sm">No reviews yet.</p>
            ) : (
              restaurantReviews.map((rv) => (
                <div key={rv.id} className="review-card fade-up">
                  <div className="review-header">
                    <div className="review-avatar">{rv.user_name?.[0] || 'A'}</div>
                    <div>
                      <div className="review-name">{rv.user_name}</div>
                      <div className="review-date text-xs text-muted">{new Date(rv.date || rv.created_at || Date.now()).toLocaleDateString()}</div>
                    </div>
                    <StarRating rating={rv.rating} />
                  </div>
                  <p className="review-comment text-sm text-muted">{rv.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
