import { Navigate } from "react-router";
import { isAuthenticated, getStoredUser } from "../features/auth/utils/session";

/**
 * Wraps a route so that:
 *   - Unauthenticated users are sent to /login
 *   - Users whose role is not in `roles` (if specified) are sent to /dashboard
 */
export default function ProtectedRoute({ children, roles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles) {
    const user = getStoredUser();
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
