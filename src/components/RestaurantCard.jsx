import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import StarRating from "./StarRating";
import "./RestaurantCard.css";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`} className="restaurant-card card fade-up">
      <div className="restaurant-img-wrap">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" loading="lazy" />
        <div className="restaurant-img-overlay" />
        {restaurant.featured && (
          <span className="badge badge-gold restaurant-featured">⭐ Featured</span>
        )}
        <div className="restaurant-price-range badge badge-grey">{restaurant.priceRange}</div>
      </div>
      <div className="card-body restaurant-body">
        <div className="restaurant-top">
          <h3 className="heading-md">{restaurant.name}</h3>
        </div>
        <p className="text-sm text-muted restaurant-cuisine">{restaurant.cuisine}</p>
        <StarRating rating={restaurant.rating} count={restaurant.reviews} />
        <div className="restaurant-tags">
          {restaurant.tags.slice(0, 3).map((t) => (
            <span key={t} className="badge badge-grey">{t}</span>
          ))}
        </div>
        <div className="restaurant-address">
          <MapPin size={12} />
          <span>{restaurant.address}</span>
        </div>
        <div className="restaurant-hours text-xs text-muted">
          🕐 {restaurant.openHours}
        </div>
      </div>
    </Link>
  );
}
