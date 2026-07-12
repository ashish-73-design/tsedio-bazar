import { Heart, Plus, Minus, Star } from "lucide-react";
import { formatINR } from "../utils/format";

export default function ProductCard({ product, qty, onAdd, onChangeQty, wished, onToggleWish }) {
  const discount = product.mrp > product.price
    ? Math.round(100 - (product.price / product.mrp) * 100)
    : 0;
  const outOfStock = Number(product.stock) <= 0;

  return (
    <div className="bg-white rounded-lg border-2 border-ink overflow-hidden flex flex-col">
      <div className="aspect-square bg-paper flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono-brand text-xs opacity-40">No image</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono-brand text-[11px] font-bold px-2 py-0.5 rounded bg-paper text-ink">
            {product.category}
          </span>
          <button onClick={() => onToggleWish(product.id)} aria-label="Toggle wishlist">
            <Heart size={18} fill={wished ? "#E15241" : "none"} color={wished ? "#E15241" : "#1E2A4A"} />
          </button>
        </div>

        <h3 className="font-semibold text-sm leading-snug mb-2 text-ink flex-1">{product.name}</h3>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={13} fill="#F5C518" color="#F5C518" />
            <span className="text-xs font-medium text-ink">{product.rating}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono-brand font-bold text-lg text-ink">{formatINR(product.price)}</span>
          {discount > 0 && (
            <>
              <span className="font-mono-brand text-xs line-through opacity-40">{formatINR(product.mrp)}</span>
              <span className="text-xs font-bold text-coral">{discount}% OFF</span>
            </>
          )}
        </div>

        {outOfStock ? (
          <div className="w-full py-2 rounded-md font-semibold text-sm text-center bg-gray-200 text-gray-500">
            Out of Stock
          </div>
        ) : qty === 0 ? (
          <button
            onClick={() => onAdd(product.id)}
            className="w-full py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 bg-ink text-gold"
          >
            <Plus size={15} /> Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-between border-t-2 border-dashed border-ink/25 pt-3">
            <button
              onClick={() => onChangeQty(product.id, -1)}
              className="w-8 h-8 rounded-md border-2 border-ink flex items-center justify-center text-ink"
            >
              <Minus size={14} />
            </button>
            <span className="font-bold font-mono-brand text-ink">{qty}</span>
            <button
              onClick={() => onChangeQty(product.id, 1)}
              className="w-8 h-8 rounded-md flex items-center justify-center bg-ink text-gold"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
