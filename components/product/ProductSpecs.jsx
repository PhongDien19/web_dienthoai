export default function ProductSpecs({ product, detailed = false }) {
  if (!product) return null;

  const rows = [
    ["Chieu dai", product.lengthCm ? `${product.lengthCm} cm` : null],
    ["Chieu rong", product.widthCm ? `${product.widthCm} cm` : null],
    ["Chieu cao", product.heightCm ? `${product.heightCm} cm` : null],
    ["Khoi luong", product.weightKg ? `${product.weightKg} kg` : null],
    ["Chat lieu", product.material || null],
    ["Mau sac", product.color || null],
    ["Phong cach", product.style || null],
  ].filter(([, v]) => v);

  if (rows.length === 0) return null;

  if (!detailed) {
    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        {rows.slice(0, 4).map(([k, v]) => (
          <div key={k} className="bg-gray-50 border rounded-lg px-3 py-2">
            <p className="text-gray-500">{k}</p>
            <p className="font-medium text-gray-800">{v}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl rounded-2xl border border-gray-200 overflow-hidden">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 border-b last:border-b-0">
          <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50">{k}</div>
          <div className="px-4 py-3 text-sm text-gray-800 col-span-2">{v}</div>
        </div>
      ))}
    </div>
  );
}
