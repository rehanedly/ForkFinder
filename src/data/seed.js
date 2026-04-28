// ─── RESTAURANTS ─────────────────────────────────────────────────────────────
export const restaurants = [
  {
    id: 1,
    name: "KFC",
    cuisine: "Fast Food",
    address: "Main Boulevard, Lahore",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    rating: 4.5,
    reviews: 1240,
    featured: true,
    openHours: "10:00 AM – 11:00 PM",
    priceRange: "$$",
    tags: ["Chicken", "Burgers", "Fast Food"],
  },
  {
    id: 2,
    name: "Burger Lab",
    cuisine: "Burgers",
    address: "DHA Phase 5, Lahore",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    rating: 4.4,
    reviews: 870,
    featured: true,
    openHours: "12:00 PM – 12:00 AM",
    priceRange: "$$$",
    tags: ["Gourmet Burgers", "Wraps"],
  },
  {
    id: 3,
    name: "Foodie Hut",
    cuisine: "Fast Food",
    address: "Gulberg III, Lahore",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    rating: 4.2,
    reviews: 560,
    featured: false,
    openHours: "11:00 AM – 10:00 PM",
    priceRange: "$",
    tags: ["Budget Bites", "Chicken", "Fast Food"],
  },
  {
    id: 4,
    name: "Pizza Max",
    cuisine: "Pizza",
    address: "Canal Road, Lahore",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    rating: 4.3,
    reviews: 730,
    featured: true,
    openHours: "12:00 PM – 11:00 PM",
    priceRange: "$$",
    tags: ["Pizza", "Pasta", "Italian"],
  },
  {
    id: 5,
    name: "Shawarma Corner",
    cuisine: "Middle Eastern",
    address: "MM Alam Road, Lahore",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    rating: 4.1,
    reviews: 410,
    featured: false,
    openHours: "1:00 PM – 2:00 AM",
    priceRange: "$",
    tags: ["Shawarma", "Middle Eastern", "Wraps"],
  },
];

// ─── NORMALIZED ITEMS ─────────────────────────────────────────────────────────
export const normalizedItems = [
  {
    id: 1,
    canonical_name: "Zinger Burger",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    aliases: ["Chicken Zinger", "Spicy Zinger", "Zinger"],
    category: "Burgers",
    avgPrice: 447,
  },
  {
    id: 2,
    canonical_name: "Chicken Burger",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    aliases: ["Crispy Chicken Burger", "Classic Chicken"],
    category: "Burgers",
    avgPrice: 453,
  },
  {
    id: 3,
    canonical_name: "Fries",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    aliases: ["French Fries", "Crispy Fries", "Regular Fries"],
    category: "Sides",
    avgPrice: 180,
  },
  {
    id: 4,
    canonical_name: "Margherita Pizza",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    aliases: ["Cheese Pizza", "Classic Margherita"],
    category: "Pizza",
    avgPrice: 750,
  },
  {
    id: 5,
    canonical_name: "Chicken Shawarma",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    aliases: ["Shawarma", "Chicken Roll"],
    category: "Wraps",
    avgPrice: 320,
  },
  {
    id: 6,
    canonical_name: "Cold Drink",
    image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready",
    aliases: ["Soft Drink", "Pepsi", "Coke"],
    category: "Drinks",
    avgPrice: 90,
  },
];

// ─── MENU ITEMS ───────────────────────────────────────────────────────────────
export const menuItems = [
  // KFC
  { id: 101, name: "Zinger Burger", price: 520, restaurantId: 1, normalizedItemId: 1, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Burgers" },
  { id: 102, name: "Chicken Burger", price: 450, restaurantId: 1, normalizedItemId: 2, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Burgers" },
  { id: 103, name: "Fries", price: 180, restaurantId: 1, normalizedItemId: 3, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Sides" },
  { id: 104, name: "Cold Drink", price: 80, restaurantId: 1, normalizedItemId: 6, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Drinks" },
  // Burger Lab
  { id: 201, name: "Zinger Burger", price: 430, restaurantId: 2, normalizedItemId: 1, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Burgers" },
  { id: 202, name: "Chicken Burger", price: 470, restaurantId: 2, normalizedItemId: 2, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Burgers" },
  { id: 203, name: "Fries", price: 200, restaurantId: 2, normalizedItemId: 3, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Sides" },
  { id: 204, name: "Cold Drink", price: 100, restaurantId: 2, normalizedItemId: 6, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Drinks" },
  // Foodie Hut
  { id: 301, name: "Zinger Burger", price: 390, restaurantId: 3, normalizedItemId: 1, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Burgers" },
  { id: 302, name: "Fries", price: 160, restaurantId: 3, normalizedItemId: 3, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Sides" },
  { id: 303, name: "Cold Drink", price: 70, restaurantId: 3, normalizedItemId: 6, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Drinks" },
  // Pizza Max
  { id: 401, name: "Margherita Pizza", price: 750, restaurantId: 4, normalizedItemId: 4, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Pizza" },
  { id: 402, name: "Cold Drink", price: 90, restaurantId: 4, normalizedItemId: 6, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Drinks" },
  // Shawarma Corner
  { id: 501, name: "Chicken Shawarma", price: 280, restaurantId: 5, normalizedItemId: 5, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Wraps" },
  { id: 502, name: "Cold Drink", price: 80, restaurantId: 5, normalizedItemId: 6, image: "https://placehold.co/800x600/3d1218/e63946?text=Food+Ready", available: true, category: "Drinks" },
];

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
export const reviews = [
  { id: 1, restaurantId: 1, userId: "u1", userName: "Ali Hassan", rating: 5, comment: "Best Zinger in town! Crispy and juicy every time.", date: "2026-04-10" },
  { id: 2, restaurantId: 1, userId: "u2", userName: "Sara Khan", rating: 4, comment: "Great food but seating can get crowded on weekends.", date: "2026-04-12" },
  { id: 3, restaurantId: 2, userId: "u3", userName: "Umar Riaz", rating: 5, comment: "Burger Lab never disappoints. The patties are incredibly fresh.", date: "2026-04-08" },
  { id: 4, restaurantId: 2, userId: "u1", userName: "Ali Hassan", rating: 4, comment: "Slightly pricey but worth every rupee.", date: "2026-04-15" },
  { id: 5, restaurantId: 3, userId: "u4", userName: "Hina Malik", rating: 4, comment: "Super affordable and tasty! Go-to for a quick meal.", date: "2026-04-05" },
  { id: 6, restaurantId: 4, userId: "u2", userName: "Sara Khan", rating: 4, comment: "Pizza Max has the best cheese pull. Won't disappoint a pizza lover.", date: "2026-04-11" },
  { id: 7, restaurantId: 5, userId: "u5", userName: "Bilal Chaudhry", rating: 4, comment: "The shawarma is massive and full of flavor. Best value.", date: "2026-04-14" },
];

// ─── FEATURED COMPARISONS ─────────────────────────────────────────────────────
export const featuredComparisons = [
  { normalizedItemId: 1, label: "Zinger Burger" },
  { normalizedItemId: 3, label: "Fries" },
  { normalizedItemId: 2, label: "Chicken Burger" },
];
