import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { formatINR } from "../utils/format";

export default function CartDrawer({ open, onClose, products }) {
  const { cart, setQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const items = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full bg-white flex flex-col border-l-2 border-ink">
        <div className="flex items-center justify-between p-4 border-b-2 border-ink">
          <h2 className="font-display font-bold text-lg text-ink">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={20} color="#1E2A4A" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <p className="text-sm opacity-60 text-center mt-10">Your cart is empty.</p>
          )}
          {items.map((i) => (
            <div key={i.id} className="flex gap-3 border-2 border-ink/20 rounded-md p-3">
              <div className="w-10 h-10 rounded shrink-0 bg-paper overflow-hidden">
                {i.image && <img src={i.image} alt={i.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-ink">{i.name}</p>
                <p className="font-mono-brand text-xs opacity-60">
                  {formatINR(i.price)} × {i.qty}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setQty(i.id, i.qty - 1)}
                    className="w-6 h-6 rounded border border-ink flex items-center justify-center"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-mono-brand text-xs">{i.qty}</span>
                  <button
                    onClick={() => setQty(i.id, i.qty + 1)}
                    className="w-6 h-6 rounded border border-ink flex items-center justify-center"
                  >
                    <Plus size={12} />
                  </button>
                  <button onClick={() => removeFromCart(i.id)} className="ml-auto" aria-label="Remove item">
                    <Trash2 size={14} color="#E15241" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t-2 border-ink">
            <div className="flex justify-between mb-3">
              <span className="font-semibold text-sm text-ink">Total</span>
              <span className="font-mono-brand font-bold text-ink">{formatINR(total)}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full py-3 rounded-md font-bold bg-ink text-gold"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
