import { useMemo, useState } from "react";
import { resolveImage } from "../../utils/imageResolver";

const FALLBACK_IMG = "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image";

export default function ProductGallery({ mainImageUrl, subImages = [], name = "San pham" }) {
  const images = useMemo(() => {
    const arr = [mainImageUrl, ...(subImages || []).map((i) => i?.url || i)];
    return arr
      .map((u) => resolveImage(u) || FALLBACK_IMG)
      .filter(Boolean)
      .filter((u, idx, self) => self.indexOf(u) === idx);
  }, [mainImageUrl, subImages]);

  const [active, setActive] = useState(images[0] || FALLBACK_IMG);

  return (
    <div className="space-y-3">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border">
        <img
          src={active}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((img) => (
            <button
              key={img}
              onClick={() => setActive(img)}
              className={`aspect-square rounded-lg overflow-hidden border ${
                active === img ? "border-amber-500" : "border-gray-200"
              }`}
            >
              <img src={img} alt={name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
