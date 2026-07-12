import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { Search } from "lucide-react";
import { db } from "../firebase";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  async function handleTrack(e) {
    e.preventDefault();
    setError("");
    const id = orderId.trim().toUpperCase();
    if (!id) return;
    setChecking(true);
    try {
      const snap = await get(ref(db, `orders/${id}`));
      if (snap.exists()) {
        navigate(`/order/${id}`);
      } else {
        setError("No order found with that ID. Double-check and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg border-2 border-ink p-6">
        <h1 className="font-display text-xl font-bold text-ink mb-1">Track Your Order</h1>
        <p className="text-sm opacity-60 text-ink mb-5">
          Enter the order ID from your receipt (starts with TB).
        </p>
        <form onSubmit={handleTrack} className="space-y-3">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. TB12345678"
            className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none font-mono-brand"
          />
          {error && <p className="text-xs text-coral">{error}</p>}
          <button
            type="submit"
            disabled={checking}
            className="w-full py-3 rounded-md font-bold flex items-center justify-center gap-2 bg-ink text-gold disabled:opacity-60"
          >
            <Search size={16} /> {checking ? "Checking..." : "Track Order"}
          </button>
        </form>
        <Link to="/" className="block text-center text-xs text-ink underline mt-4">
          Back to store
        </Link>
      </div>
    </div>
  );
}
