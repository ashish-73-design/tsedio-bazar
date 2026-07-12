import { useEffect, useMemo, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { useCart } from "../contexts/CartContext";
import Header from "../components/Header";
import CategoryStrip from "../components/CategoryStrip";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState({});
  const { cart, addToCart, setQty } = useCart();

  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsub = onValue(productsRef, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, p]) => ({ id, ...p }));
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQuery = p.name?.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, category, query]);

  function toggleWish(id) {
    setWishlist((w) => ({ ...w, [id]: !w[id] }));
  }

  return (
    <div className="min-h-screen bg-paper">
      <Header query={query} onQueryChange={setQuery} onCartClick={() => setCartOpen(true)} />
      <CategoryStrip categories={categories} active={category} onSelect={setCategory} />

      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="rounded-2xl px-6 py-8 md:px-10 md:py-10 bg-[#1F3D2B]">
          <p className="font-mono-brand text-xs tracking-widest uppercase mb-2 text-gold">
            Today's Deals
          </p>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white leading-snug">
            Everything you need, one bazar away
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-lg">
            Electronics, fashion, groceries, and more — with fast UPI checkout.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && <p className="text-sm opacity-60 text-center py-10">Loading products...</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-sm opacity-60 text-center py-10">
            No products found. Try a different category or search.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] || 0}
              onAdd={addToCart}
              onChangeQty={(id, delta) => setQty(id, (cart[id] || 0) + delta)}
              wished={!!wishlist[p.id]}
              onToggleWish={toggleWish}
            />
          ))}
        </div>
      </div>

      <div className="border-t-2 border-ink py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-6 justify-center text-xs font-mono-brand opacity-70 text-ink">
          <span>✓ Verified Sellers</span>
          <span>✓ Instant UPI Checkout</span>
          <span>✓ Order Tracking</span>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} products={products} />
    </div>
  );
}
