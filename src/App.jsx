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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
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
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/*"             element={<AdminDashboard />} />
          </Route>

          {/* Protected Restaurant Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Restaurant Owner']} />}>
            <Route path="/restaurant/*"        element={<RestaurantDashboard />} />
          </Route>
        </Routes>
        <Footer />
      </AppProvider>
    </BrowserRouter>
  );
}
