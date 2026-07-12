export default function CategoryStrip({ categories, active, onSelect }) {
  const all = ["All", ...categories];
  return (
    <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
      {all.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition ${
            active === c
              ? "bg-ink text-gold border-ink"
              : "bg-transparent text-ink border-ink/30"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
