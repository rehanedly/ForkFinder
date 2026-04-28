import { createContext, useContext, useReducer, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AppContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.menuItemId === action.payload.menuItemId);
      if (existing) {
        return state.map((i) =>
          i.menuItemId === action.payload.menuItemId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.menuItemId !== action.payload);
    case "UPDATE_QTY":
      return state.map((i) =>
        i.menuItemId === action.payload.menuItemId ? { ...i, qty: action.payload.qty } : i
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  
  // Supabase Data States
  const [restaurants, setRestaurants] = useState([]);
  const [normalizedItems, setNormalizedItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch from Supabase on mount
  useEffect(() => {
    async function fetchAll() {
      try {
        setIsLoading(true);
        const [rRes, niRes, miRes, rvRes, oRes] = await Promise.all([
          supabase.from("restaurants").select("*"),
          supabase.from("normalized_items").select("*"),
          supabase.from("menu_items").select("*"),
          supabase.from("reviews").select("*"),
          supabase.from("orders").select("*, order_items(*)").order('created_at', { ascending: false }),
        ]);

        if (rRes.data) setRestaurants(rRes.data);
        if (niRes.data) setNormalizedItems(niRes.data);
        if (miRes.data) setMenuItems(miRes.data);
        if (rvRes.data) setReviews(rvRes.data);
        
        // Map backend orders data shape to frontend shape if needed
        if (oRes.data) {
          const mappedOrders = oRes.data.map(o => ({
            id: o.id,
            customer: { name: o.customer_name, phone: o.customer_phone, address: o.customer_address },
            total: Number(o.total),
            status: o.status,
            createdAt: o.created_at,
            items: o.order_items ? o.order_items.map(i => ({
              menuItemId: i.menu_item_id,
              qty: i.quantity,
              price: Number(i.price),
              name: i.name,
              restaurantName: i.restaurant_name,
              image: i.image
            })) : []
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error("Error fetching native Supabase records:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Cart operations
  const addToCart = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeFromCart = (menuItemId) => dispatch({ type: "REMOVE_ITEM", payload: menuItemId });
  const updateQty = (menuItemId, qty) => {
    if (qty <= 0) return removeFromCart(menuItemId);
    dispatch({ type: "UPDATE_QTY", payload: { menuItemId, qty } });
  };
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // Place order into Supabase
  const placeOrder = async (customerInfo) => {
    const orderData = {
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      total: cartTotal,
      status: "Pending"
    };

    const { data: insertedOrder, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError || !insertedOrder) {
      console.error("Order insertion failed", orderError);
      return null;
    }

    // Insert line items
    const orderItemsData = cart.map(item => ({
      order_id: insertedOrder.id,
      menu_item_id: item.menuItemId,
      quantity: item.qty,
      price: item.price,
      name: item.name,
      restaurant_name: item.restaurantName,
      image: item.image
    }));

    await supabase.from("order_items").insert(orderItemsData);

    const newOrder = {
      id: insertedOrder.id,
      customer: customerInfo,
      items: [...cart],
      total: cartTotal,
      status: "Pending",
      createdAt: insertedOrder.created_at
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return insertedOrder.id;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  const getOrder = (orderId) => orders.find((o) => o.id === Number(orderId));

  return (
    <AppContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
        orders, placeOrder, updateOrderStatus, getOrder,
        user, setUser, searchQuery, setSearchQuery,
        // Global Datasets exposed to app 
        restaurants, normalizedItems, menuItems, reviews, isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
