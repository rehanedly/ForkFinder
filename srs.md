# Software Requirements Specification (SRS)
## Restaurant Menu Aggregator, Comparison & Ordering Platform

## 1. 📌 Overview

### 1.1 Purpose
This system is a web-based platform that allows users to:
- Browse restaurants and cuisines (menu items)
- Search food items and compare prices across restaurants
- View restaurant details, reviews, and menus
- Add items to cart and place orders
- Payment Method: Cash on delivery
- Track order status
- Restaurants can manage menus and orders and update the status of orders, while admins manage the platform. Customers can place orders and see the status of their orders.

### 1.2 Core Idea
A food intelligence platform that:
- Extracts menus (manual + seeded + future OCR)
- Normalizes food items (e.g., “Zinger Burger” = “Chicken Zinger”)
- Enables cross-restaurant price comparison
- Allows direct ordering from comparison results

---

## 2. 🧱 System Modules

### 2.1 Frontend Pages
- Home Page
- Restaurant Listing Page
- Restaurant Detail Page
- Cuisine / Menu Item Listing Page
- Comparison Results Page
- Cart & Checkout Page
- Order Tracking Page
- Admin Dashboard
  - Users management
  - Resturants Management
  - Orders Management
  - Menus Management
  - Review Management
  - Marking a Featured Cuisine (Food Items)
  - Making a restaurant as featured
  - Making a comparison as popular
- Restaurant Dashboard
  - Update restaurant profile
  - Orders Management
  - Menus Management

### 2.2 Backend Modules
- Authentication Service (JWT)
- Restaurant Management Service
- Menu & Cuisine Service
- Normalization Engine
- Comparison Engine
- Order Service
- Review Service

---

## 3. 👥 User Roles

### 3.1 Admin
- Manage restaurants
- Manage users
- Manage featured items
- Merge/split normalized items
- Seed and manage comparison data
- Orders Management
- Menus Management
- Review Management
- Marking a Featured Cuisine (Food Items)
- Making a restaurant as featured
- Making a comparison as popular

### 3.2 Restaurant Owner
- Add/update menu items
- Upload menu (PDF/image future support)
- View and manage orders
- Update order status

### 3.3 Customer
- Search for food items
- Compare prices
- Add items to cart
- Place orders
- Leave reviews

---

## 4. 🧭 Core User Flows

### 4.1 Home Page Flow
**Sections:**
- 🔥 Featured Restaurants
- 🔥 Featured Cuisines (Food Items)
- 🔥 Popular Comparisons
- 🔍 Smart Search Bar (VERY IMPORTANT)

**🔍 Search Behavior**
- User types: “Zinger Burger”
- System Autocomplete suggestions:
  - Zinger Burger
  - Chicken Zinger
  - Spicy Zinger
- On submit: Redirect to 👉 Comparison Page

### 4.2 Comparison Page (Core Feature)
**Input:** Food item (normalized name)
**Output:** Zinger Burger Comparison

| Restaurant | Price | Action |
|------------|-------|--------|
| KFC | Rs 520 | 🛒 Add |
| Foodie Hut | Rs 430 | 🛒 Add |
| Burger Lab | Rs 490 | 🛒 Add |

**Features:**
- Sort by price (low → high)
- Filter by cuisine
- Add to cart per restaurant
- Show availability badge
- Show rating per restaurant

### 4.3 Restaurant Listing Page
**Shows:**
- Restaurant name
- Rating
- Cuisine
- Location
- Featured badge

**Filters:**
- Cuisine
- Rating
- Price range

### 4.4 Restaurant Detail Page
**Includes:**
- Restaurant info
- Opening hours
- Address
- Ratings & reviews
- Full menu (categorized)

**Menu structure:**
- Burgers
- Pizza
- Drinks
- Fries

**Each item shows:**
- Name
- Price
- Image
- Add to cart button

### 4.5 Cuisine / Menu Items Listing Page
This page shows all normalized food items.
**Example:** Zinger Burger, Chicken Burger, Margherita Pizza, Fries, Shawarma.

**Each item has:**
- Image
- Average price
- “Compare” button
- “Add to cart” shortcut
- Click → opens comparison page

### 4.6 Cart & Checkout
- Cart supports multiple restaurants
- Items grouped by restaurant
- Payment method: Cash on delivery only
- Ask the user to login on place order button (if not logged in)
- Save user address in the DB and confirm the address before placing the order. Fetch the address from the DB if the user has already saved an address.

**Checkout fields:**
- If the user is not logged in, open the signup form with fields:
  - Name
  - Phone
  - Email
  - Password
  - Address
- If the user is logged in, display:
  - Phone
  - Address

### 4.7 Order Tracking
**Status flow:**
Pending → Confirmed → Preparing → Out for Delivery → Delivered

### 4.8 Reviews System
- Rating (1–5)
- Comment
- One review per user per restaurant

---

## 5. 🧠 Data Model

### 5.1 Restaurant
```json
{
  "id": "uuid",
  "name": "string",
  "cuisine": "string",
  "address": "string",
  "image": "string",
  "rating": "number"
}
```

### 5.2 Menu Item
```json
{
  "id": "uuid",
  "name": "string",
  "price": "number",
  "restaurant_id": "uuid",
  "image": "string",
  "normalized_item_id": "uuid"
}
```

### 5.3 Normalized Item (Core Comparison Entity)
```json
{
  "id": "uuid",
  "canonical_name": "string"
}
```
**Example:** “Zinger Burger” and “Chicken Zinger” → mapped to: `Zinger Burger`

### 5.4 Order
```json
{
  "id": "uuid",
  "customer_id": "uuid",
  "items": "array",
  "total": "number",
  "status": "string"
}
```

### 5.5 Review
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "restaurant_id": "uuid",
  "rating": "number",
  "comment": "string"
}
```

---

## 6. 🌱 SEED DATA (IMPORTANT FOR SYSTEM START)

### 6.1 Restaurants (5–6)
1. **KFC** (Cuisine: Fast Food, Rating: 4.5)
2. **Burger Lab** (Cuisine: Burgers, Rating: 4.4)
3. **Foodie Hut** (Cuisine: Fast Food, Rating: 4.2)
4. **Pizza Max** (Cuisine: Pizza, Rating: 4.3)
5. **Shawarma Corner** (Cuisine: Middle Eastern, Rating: 4.1)

### 6.2 Normalized Items
- Zinger Burger
- Chicken Burger
- Fries
- Margherita Pizza
- Chicken Shawarma
- Cold Drink

### 6.3 Menu Items (Sample)
- **KFC**
  - Zinger Burger → 520
  - Fries → 180
  - Chicken Burger → 450
- **Burger Lab**
  - Zinger Burger → 430
  - Fries → 200
  - Chicken Burger → 470
- **Foodie Hut**
  - Zinger Burger → 390
  - Fries → 160

### 6.4 Featured Comparisons (Home Page)
**Zinger Burger:**
- KFC → 520
- Burger Lab → 430
- Foodie Hut → 390

**Fries:**
- KFC → 180
- Burger Lab → 200
- Foodie Hut → 160

---

## 7. 🎨 UI/UX REQUIREMENTS
**Theme:**
- Dark mode (default)
- Black background
- Red accents
- White text

**Style:**
- Card-based layout
- Food imagery-heavy UI
- Smooth animations:
  - hover scale
  - fade transitions
  - slide-in lists

---

## 8. 🔌 API DESIGN (SIMPLIFIED)
- **Search:** `GET /search?q=zinger`
- **Comparison:** `GET /compare?item=zinger-burger`
- **Restaurants:** `GET /restaurants`, `GET /restaurants/:id`
- **Menu:** `GET /menu/:restaurantId`
- **Orders:** `POST /orders`, `GET /orders/:id`

---

## 9. ⚙️ SYSTEM RULES
- Comparison always uses normalized item mapping
- If item not found → suggest closest matches
- Cart supports multi-restaurant orders
- Reviews tied to the restaurant only
- Prices always restaurant-specific

---

## 10. 🚀 FUTURE EXPANSION
- AI-based menu extraction (OCR + vision)
- Smart recommendations (“People also order”)
- Delivery integration (Bykea / Foodpanda APIs)
- Online payments (Stripe/JazzCash/EasyPaisa)
- Mobile app (React Native)
- Ranking algorithm based on price + rating
