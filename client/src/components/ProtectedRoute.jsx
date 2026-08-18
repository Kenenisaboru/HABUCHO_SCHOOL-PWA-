import { Navigate, useLocation, Outlet } from "react-router-dom";
import useAuthStore from "../context/authStore";

const ProtectedRoute = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
