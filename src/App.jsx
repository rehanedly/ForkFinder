import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cuisines from "./pages/Cuisines";
import Compare from "./pages/Compare";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import Auth from "./pages/Auth";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navbar />
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/login"               element={<Auth />} />
          <Route path="/restaurants"         element={<Restaurants />} />
          <Route path="/restaurants/:id"     element={<RestaurantDetail />} />
          <Route path="/cuisines"            element={<Cuisines />} />
          <Route path="/compare"             element={<Compare />} />
          <Route path="/cart"                element={<Cart />} />
          <Route path="/orders"              element={<Orders />} />
          <Route path="/orders/:id"          element={<OrderTracking />} />
        </Routes>
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
}
