import { ShoppingCart } from "lucide-react";
import { useApp } from "../context/AppContext";
import StarRating from "./StarRating";
import "./MenuItemCard.css";

export default function MenuItemCard({ item }) {
  const { addToCart, restaurants } = useApp();
  const restaurant = restaurants.find((r) => r.id === item.restaurant_id);

  const handleAdd = () => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      restaurantId: item.restaurant_id,
      restaurantName: restaurant?.name,
      image: item.image,
    });
  };

  return (
    <div className="menu-item-card card fade-up">
      <div className="menu-item-img-wrap">
        <img src={item.image} alt={item.name} className="menu-item-img" loading="lazy" />
        {!item.available && (
          <div className="unavailable-overlay">Unavailable</div>
        )}
        <div className="menu-item-category badge badge-accent">{item.category}</div>
      </div>
      <div className="card-body">
        <div className="menu-item-top">
          <div>
            <h3 className="menu-item-name">{item.name}</h3>
            {restaurant && (
              <p className="menu-item-rest text-sm text-muted">{restaurant.name}</p>
            )}
          </div>
          <div className="menu-item-price">Rs {item.price}</div>
        </div>
        {restaurant && (
          <StarRating rating={restaurant.rating} />
        )}
        <button
          className="btn btn-primary btn-sm menu-item-add"
          onClick={handleAdd}
          disabled={!item.available}
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
