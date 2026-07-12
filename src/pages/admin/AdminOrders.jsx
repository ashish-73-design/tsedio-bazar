import { useEffect, useMemo, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { db } from "../../firebase";
import { formatINR, formatDate } from "../../utils/format";

const STATUSES = ["pending", "verified", "shipped", "delivered", "cancelled"];

const STATUS_STYLE = {
  pending: { bg: "#FDEEC2", color: "#8A6D00" },
  verified: { bg: "#D6EEE0", color: "#1F6D46" },
  shipped: { bg: "#DCE6FA", color: "#28418C" },
  delivered: { bg: "#D6EEE0", color: "#1F6D46" },
  cancelled: { bg: "#F9D8D3", color: "#A32A1B" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data)
        .map(([id, o]) => ({ id, ...o }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setOrders(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  async function updateStatus(orderId, status) {
    await update(ref(db, `orders/${orderId}`), { status });
  }

  if (loading) return <p className="text-sm opacity-60">Loading orders...</p>;

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border-2 capitalize ${
              filter === s ? "bg-ink text-gold border-ink" : "border-ink/30 text-ink"
            }`}
          >
            {s} {s !== "all" && `(${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-sm opacity-60">No orders in this view.</p>}

      <div className="space-y-3">
        {filtered.map((o) => {
          const style = STATUS_STYLE[o.status] || STATUS_STYLE.pending;
          const isOpen = expanded === o.id;
          return (
            <div key={o.id} className="bg-white border-2 border-ink rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : o.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <p className="font-mono-brand text-sm font-bold text-ink">#{o.id}</p>
                  <p className="text-xs opacity-60 text-ink">
                    {o.customerName} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-brand font-bold text-ink">{formatINR(o.total)}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-bold capitalize"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {o.status}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t-2 border-dashed border-ink/20 pt-3">
                  <div className="text-sm text-ink space-y-1 mb-3">
                    <p><strong>Phone:</strong> {o.customerPhone}</p>
                    <p><strong>Address:</strong> {o.customerAddress}</p>
                    {o.upiRef && <p><strong>UPI Ref:</strong> {o.upiRef}</p>}
                  </div>
                  <div className="space-y-1 mb-3">
                    {(o.items || []).map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-ink">
                        <span>{i.name} × {i.qty}</span>
                        <span className="font-mono-brand">{formatINR(i.price * i.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(o.id, s)}
                        disabled={o.status === s}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-2 capitalize ${
                          o.status === s
                            ? "bg-ink text-gold border-ink opacity-50"
                            : "border-ink/30 text-ink"
                        }`}
                      >
                        Mark {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
