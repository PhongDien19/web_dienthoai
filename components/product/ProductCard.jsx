import { Link } from "react-router-dom";
import { formatVnd } from "../../utils/format";
import { resolveImage } from "../../utils/imageResolver";

const FALLBACK_IMG = "https://placehold.co/600x600/e5e7eb/6b7280?text=No+Image";

export default function ProductCard({ product }) {
  if (!product) return null;

  const image = resolveImage(product.mainImageUrl || product.image || product.images?.[0]) || FALLBACK_IMG;
  const slug = product.slug || product.id;
  const originalPrice = Number(product.price || 0);
  const salePrice = Number(product.promotionalPrice || product.salePrice || 0);
  const isSale = Boolean(product.promotionalPrice || (product.isOnSale && product.salePrice));
  const finalPrice = isSale ? salePrice : originalPrice;

  return (
    <Link
      to={`/san-pham/${slug}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        <img
          src={image}
          alt={product.name || "San pham"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
          loading="lazy"
        />
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">{product.name}</p>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className={`font-bold ${isSale ? "text-red-600" : "text-gray-900"}`}>{formatVnd(finalPrice)}</span>
          {isSale && originalPrice > finalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatVnd(originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
