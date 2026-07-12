import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Package, ClipboardList } from "lucide-react";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

export default function AdminDashboard() {
  const { logout, user } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b-2 border-ink bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg text-ink">Tsedio Bazar Admin</h1>
            <p className="text-xs opacity-60 text-ink">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm font-semibold text-ink border-2 border-ink rounded-full px-3 py-1.5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-2 pb-3">
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${
                isActive ? "bg-ink text-gold border-ink" : "border-ink/30 text-ink"
              }`
            }
          >
            <ClipboardList size={14} /> Orders
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${
                isActive ? "bg-ink text-gold border-ink" : "border-ink/30 text-ink"
              }`
            }
          >
            <Package size={14} /> Products
          </NavLink>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
