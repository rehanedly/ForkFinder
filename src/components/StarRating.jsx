import { Star, StarHalf } from "lucide-react";

export default function StarRating({ rating, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div className="stars">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={13} fill="currentColor" className="star" />
        ))}
        {half && <StarHalf size={13} fill="currentColor" className="star" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={13} className="star" style={{ opacity: 0.25 }} />
        ))}
      </div>
      <span style={{ fontSize: "0.8rem", color: "var(--text2)" }}>
        {rating.toFixed(1)}
        {count !== undefined && ` (${count.toLocaleString()})`}
      </span>
    </div>
  );
}
