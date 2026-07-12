import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { Check } from "lucide-react";
import { db } from "../firebase";
import { formatINR, formatDate } from "../utils/format";

const STATUS_LABELS = {
  pending: { label: "Pending Verification", bg: "#FDEEC2", color: "#8A6D00" },
  verified: { label: "Payment Verified", bg: "#D6EEE0", color: "#1F6D46" },
  shipped: { label: "Shipped", bg: "#DCE6FA", color: "#28418C" },
  delivered: { label: "Delivered", bg: "#D6EEE0", color: "#1F6D46" },
  cancelled: { label: "Cancelled", bg: "#F9D8D3", color: "#A32A1B" },
};

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderRef = ref(db, `orders/${orderId}`);
    const unsub = onValue(orderRef, (snap) => {
      setOrder(snap.val());
      setLoading(false);
    });
    return () => unsub();
  }, [orderId]);

  if (loading) {
    return <div className="p-10 text-center text-sm opacity-60">Loading order...</div>;
  }
  if (!order) {
    return (
      <div className="p-10 text-center text-sm opacity-60">
        Order not found.{" "}
        <Link to="/" className="text-ink font-semibold underline">
          Go home
        </Link>
      </div>
    );
  }

  const status = STATUS_LABELS[order.status] || STATUS_LABELS.pending;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border-2 border-ink overflow-hidden">
          <div className="px-5 py-4 text-center bg-ink">
            <p className="font-mono-brand text-xs tracking-widest text-gold">ORDER RECEIPT</p>
          </div>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 bg-[#2D6A4F]">
              <Check size={26} color="white" />
            </div>
            <h2 className="font-display text-xl font-bold mb-1 text-ink">Order Placed!</h2>
            <p className="font-mono-brand text-sm opacity-70 mb-1 text-ink">#{order.id}</p>
            <p className="text-xs opacity-50 mb-4 text-ink">{formatDate(order.createdAt)}</p>

            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6"
              style={{ background: status.bg, color: status.color }}
            >
              Status: {status.label}
            </div>

            <div className="text-left border-t-2 border-dashed border-ink/25 pt-4 space-y-2">
              {(order.items || []).map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-ink">
                    {i.name} × {i.qty}
                  </span>
                  <span className="font-mono-brand text-ink">{formatINR(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-2">
                <span className="text-ink">Total Paid</span>
                <span className="font-mono-brand text-ink">{formatINR(order.total)}</span>
              </div>
            </div>

            <div className="text-left border-t-2 border-dashed border-ink/25 pt-4 mt-4 space-y-1">
              <p className="text-xs text-ink">
                <strong>Delivering to:</strong> {order.customerName}
              </p>
              <p className="text-xs text-ink opacity-70">{order.customerAddress}</p>
              <p className="text-xs text-ink opacity-70">{order.customerPhone}</p>
            </div>

            <Link
              to="/"
              className="w-full py-3 rounded-md font-bold mt-6 block bg-ink text-gold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
