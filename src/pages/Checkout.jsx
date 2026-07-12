import { useEffect, useMemo, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ScanLine, Copy, Check } from "lucide-react";
import { db } from "../firebase";
import { useCart } from "../contexts/CartContext";
import { formatINR, generateOrderId } from "../utils/format";
import { buildUpiUri, buildUpiQrImage, UPI_ID } from "../utils/upi";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [upiRef, setUpiRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const data = snap.val() || {};
      setProducts(Object.entries(data).map(([id, p]) => ({ id, ...p })));
    });
    return () => unsub();
  }, []);

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const p = products.find((x) => x.id === id);
        return p ? { ...p, qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const orderIdPreview = useMemo(() => generateOrderId(), []);
  const upiUri = buildUpiUri({ amount: total, note: `Order ${orderIdPreview}` });
  const qrSrc = buildUpiQrImage(upiUri);

  async function handleConfirmPayment() {
    setError("");
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in your name, phone number, and address.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    try {
      const orderId = orderIdPreview;
      await set(ref(db, `orders/${orderId}`), {
        id: orderId,
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        total,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerAddress: address.trim(),
        upiRef: upiRef.trim() || null,
        status: "pending",
        createdAt: Date.now(),
      });
      clearCart();
      navigate(`/order/${orderId}`);
    } catch (e) {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm font-semibold mb-6 text-ink"
        >
          <ArrowLeft size={16} /> Continue shopping
        </button>

        <div className="bg-white rounded-lg border-2 border-ink overflow-hidden">
          <div className="px-5 py-3 bg-[#1F3D2B]">
            <p className="font-mono-brand text-white text-xs tracking-widest">CHECKOUT</p>
          </div>

          <div className="p-5 space-y-3 border-b-2 border-dashed border-ink/25">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-ink">
                  {i.name} × {i.qty}
                </span>
                <span className="font-mono-brand text-ink">{formatINR(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2">
              <span className="text-ink">Total</span>
              <span className="font-mono-brand text-ink">{formatINR(total)}</span>
            </div>
          </div>

          <div className="p-5 space-y-3 border-b-2 border-dashed border-ink/25">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none"
            />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              rows={2}
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none resize-none"
            />
          </div>

          <div className="p-5 flex flex-col items-center">
            <p className="text-xs opacity-60 mb-3 flex items-center gap-1 text-ink">
              <ScanLine size={14} /> Scan with any UPI app — amount is pre-filled
            </p>
            <img
              src={qrSrc}
              alt="UPI QR Code"
              className="w-48 h-48 rounded-md border-2 border-ink"
            />
            <div className="flex items-center gap-2 mt-3">
              <span className="font-mono-brand text-sm font-semibold text-ink">{UPI_ID}</span>
              <Copy
                size={14}
                className="text-ink cursor-pointer"
                onClick={() => navigator.clipboard?.writeText(UPI_ID)}
              />
            </div>

            <input
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              placeholder="UPI transaction ID (optional, speeds up verification)"
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-xs outline-none mt-4"
            />

            {error && <p className="text-xs text-coral mt-3 text-center">{error}</p>}

            <button
              onClick={handleConfirmPayment}
              disabled={submitting}
              className="w-full py-3 rounded-md font-bold mt-4 flex items-center justify-center gap-2 bg-gold text-ink disabled:opacity-60"
            >
              <Check size={18} /> {submitting ? "Placing order..." : "I've Paid — Place Order"}
            </button>
            <p className="text-[11px] opacity-50 mt-2 text-center text-ink">
              Payment will be verified manually by the seller before dispatch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
