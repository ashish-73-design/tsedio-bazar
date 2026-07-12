import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, push, set, get } from "firebase/database";
import { db } from "../../firebase";

const EMPTY = {
  name: "",
  category: "",
  price: "",
  mrp: "",
  stock: "",
  image: "",
  description: "",
  rating: "",
};

export default function AdminProductForm() {
  const { productId } = useParams();
  const isNew = !productId || productId === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    get(ref(db, `products/${productId}`)).then((snap) => {
      if (snap.exists()) setForm(snap.val());
      setLoading(false);
    });
  }, [productId, isNew]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.category.trim() || !form.price) {
      setError("Name, category, and price are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        mrp: Number(form.mrp) || Number(form.price),
        stock: Number(form.stock) || 0,
        image: form.image.trim(),
        description: form.description.trim(),
        rating: form.rating ? Number(form.rating) : null,
        updatedAt: Date.now(),
      };
      if (isNew) {
        const newRef = push(ref(db, "products"));
        await set(newRef, { ...payload, createdAt: Date.now() });
      } else {
        await set(ref(db, `products/${productId}`), payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm opacity-60">Loading product...</p>;

  return (
    <div className="max-w-xl">
      <h2 className="font-display font-bold text-lg text-ink mb-4">
        {isNew ? "Add Product" : "Edit Product"}
      </h2>
      <form onSubmit={handleSubmit} className="bg-white border-2 border-ink rounded-lg p-5 space-y-3">
        <div>
          <label className="text-xs font-semibold text-ink">Product Name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink">Category</label>
          <input
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            placeholder="e.g. Electronics, Fashion, Grocery"
            className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink">Price (₹)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink">MRP (₹, optional)</label>
            <input
              type="number"
              value={form.mrp}
              onChange={(e) => update("mrp", e.target.value)}
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-ink">Stock Quantity</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink">Rating (optional)</label>
            <input
              type="number"
              step="0.1"
              max="5"
              value={form.rating}
              onChange={(e) => update("rating", e.target.value)}
              className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-ink">Image URL</label>
          <input
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-ink">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-md border-2 border-ink/30 text-sm outline-none mt-1 resize-none"
          />
        </div>

        {error && <p className="text-xs text-coral">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-md font-bold bg-ink text-gold disabled:opacity-60"
          >
            {saving ? "Saving..." : isNew ? "Add Product" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2.5 rounded-md font-semibold border-2 border-ink text-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
