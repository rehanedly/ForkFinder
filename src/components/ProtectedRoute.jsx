import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="page container empty-state">
        <h3>Loading session...</h3>
      </div>
    );
  }

  // If no user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed
  const userRole = user.role || user.user_metadata?.role;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
