import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Store } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function Header({ query, onQueryChange, onCartClick }) {
  const { cart } = useCart();
  const navigate = useNavigate();
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-md bg-ink flex items-center justify-center">
            <Store size={20} color="#F5C518" />
          </div>
          <span className="font-display text-xl font-bold text-ink">
            Tsedio <span className="text-coral">Bazar</span>
          </span>
        </Link>

        <div className="flex-1 relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink opacity-50"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="w-full pl-9 pr-3 py-2 rounded-full border-2 border-ink text-sm outline-none bg-white"
          />
        </div>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 px-3 py-2 rounded-full border-2 border-ink font-semibold text-sm text-ink shrink-0"
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center bg-coral text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
