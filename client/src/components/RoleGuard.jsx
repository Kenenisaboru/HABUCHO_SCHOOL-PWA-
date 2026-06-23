import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../context/authStore";
import { getDashboardPath } from "../utils/helpers";

const RoleGuard = ({ allowedRoles = [] }) => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
