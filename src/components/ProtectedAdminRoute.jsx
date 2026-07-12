import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { user, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return <div className="p-10 text-center text-sm opacity-60">Checking access...</div>;
  }
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
