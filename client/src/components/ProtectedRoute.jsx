import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuthStore from "../context/authStore";

const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
