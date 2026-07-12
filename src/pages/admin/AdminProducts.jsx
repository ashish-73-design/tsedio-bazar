import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ref, onValue, remove } from "firebase/database";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { db } from "../../firebase";
import { formatINR } from "../../utils/format";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const data = snap.val() || {};
      setProducts(Object.entries(data).map(([id, p]) => ({ id, ...p })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await remove(ref(db, `products/${id}`));
  }

  if (loading) return <p className="text-sm opacity-60">Loading products...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-bold text-lg text-ink">Products ({products.length})</h2>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-ink text-gold"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {products.length === 0 && (
        <p className="text-sm opacity-60">No products yet. Add your first one.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border-2 border-ink rounded-lg overflow-hidden">
            <div className="aspect-video bg-paper overflow-hidden flex items-center justify-center">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs opacity-40 font-mono-brand">No image</span>
              )}
            </div>
            <div className="p-3">
              <p className="font-mono-brand text-[11px] font-bold text-ink opacity-60">{p.category}</p>
              <p className="text-sm font-semibold text-ink truncate">{p.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono-brand font-bold text-ink">{formatINR(p.price)}</span>
                <span
                  className={`text-xs font-semibold ${
                    Number(p.stock) > 0 ? "text-[#1F6D46]" : "text-coral"
                  }`}
                >
                  {Number(p.stock) > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Link
                  to={`/admin/products/${p.id}`}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md border-2 border-ink text-xs font-semibold text-ink"
                >
                  <Pencil size={12} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md border-2 border-coral text-xs font-semibold text-coral"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
