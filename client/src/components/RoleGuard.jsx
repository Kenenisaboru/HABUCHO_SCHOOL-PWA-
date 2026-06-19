/**
 * RoleGuard — Restricts routes to specific user roles
 * Redirects unauthorized users to their own dashboard or home.
 */
import { Navigate } from "react-router-dom";
import useAuthStore from "../context/authStore";
import { getDashboardPath } from "../utils/helpers";

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default RoleGuard;
