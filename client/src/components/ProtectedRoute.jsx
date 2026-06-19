/**
 * ProtectedRoute — Redirects unauthenticated users to /login
 */
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../context/authStore";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
