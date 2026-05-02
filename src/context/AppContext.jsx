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

  // Auth Listener
  useEffect(() => {
    async function handleAuthChange(session) {
      if (session?.user) {
        // Fetch profile to get role
        let { data: profile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        // Fallback: If profile missing but user is auth-ed, sync basic info
        // This handles cases where public.users was reset but auth.users persists
        if (error || !profile) {
          const { data: newProfile } = await supabase
            .from('users')
            .upsert({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email,
              email: session.user.email,
              role: session.user.user_metadata?.role || "Customer"
            })
            .select()
            .single();
          if (newProfile) profile = newProfile;
        }
        
        setUser({ ...session.user, ...profile });
      } else {
        setUser(null);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const addReview = async (reviewData) => {
    try {
      const { data, error } = await supabase.from('reviews').insert([reviewData]).select();
      if (error) throw error;
      if (data && data.length > 0) {
        setReviews((prev) => [data[0], ...prev]);
      }
      return true;
    } catch (err) {
      console.error("Error submitting review:", err.message);
      return false;
    }
  };

  // Place order into Supabase
  const placeOrder = async (customerInfo) => {
    const orderData = {
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      customer_id: user?.id || null, // Link to public.users
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

  const updateUserProfile = async (profileUpdate) => {
    if (!user) return;
    const { error } = await supabase
      .from('users')
      .upsert({ 
        id: user.id, 
        email: user.email, // Required field
        name: user.name,   // Keep existing or use update
        ...profileUpdate 
      });
    
    if (!error) {
      setUser(prev => ({ ...prev, ...profileUpdate }));
    }
  };

  const getOrder = (orderId) => orders.find((o) => o.id === Number(orderId));

  return (
    <AppContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
        orders, placeOrder, updateOrderStatus, getOrder,
        user, setUser, searchQuery, setSearchQuery,
        addReview, updateUserProfile,
        // Global Datasets exposed to app 
        restaurants, normalizedItems, menuItems, reviews, isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
