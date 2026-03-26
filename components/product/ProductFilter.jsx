export default function ProductFilter({ filters, onChange }) {
  const update = (key, value) => {
    onChange?.({ [key]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Bo loc</h3>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Sap xep</label>
        <select
          value={filters.sortBy || "newest"}
          onChange={(e) => update("sortBy", e.target.value)}
          className="input text-sm"
        >
          <option value="newest">Moi nhat</option>
          <option value="price_asc">Gia tang dan</option>
          <option value="price_desc">Gia giam dan</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Gia tu</label>
          <input
            type="number"
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value)}
            className="input text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Den</label>
          <input
            type="number"
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="input text-sm"
            placeholder="50000000"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Hang</label>
        <input
          value={filters.brand || ""}
          onChange={(e) => update("brand", e.target.value)}
          className="input text-sm"
          placeholder="Apple, Samsung..."
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">RAM</label>
          <input
            value={filters.ram || ""}
            onChange={(e) => update("ram", e.target.value)}
            className="input text-sm"
            placeholder="8GB"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bo nho</label>
          <input
            value={filters.storage || ""}
            onChange={(e) => update("storage", e.target.value)}
            className="input text-sm"
            placeholder="256GB"
          />
        </div>
      </div>
    </div>
  );
}
