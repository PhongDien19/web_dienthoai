// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ChevronRight, ZoomIn } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';
import ProductGallery from '../components/product/ProductGallery';
import ProductSpecs from '../components/product/ProductSpecs';
import { productApi } from '../api/products';
import { formatVnd } from '../utils/format';
import { resolveImage } from '../utils/imageResolver';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuthStore();
  const wishlistIds = useWishlistStore(s => s.ids);
  const toggleWishlist = useWishlistStore(s => s.toggle);
  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  useEffect(() => {
    setLoading(true);
    productApi.getProductBySlug(slug)
      .then(res => setProduct(res))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[60, 40, 30, 80].map(w => (
            <div key={w} className={`h-6 bg-gray-100 rounded animate-pulse w-${w}/100`} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">😔</p>
      <p className="text-lg text-gray-600">Không tìm thấy sản phẩm</p>
      <Link to="/danh-muc" className="btn-primary mt-4 inline-block">Quay lại</Link>
    </div>
  );

  function handleAddToCart() {
    addItem(product, qty);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  async function handleToggleWishlist() {
    if (!user) {
      toast.error('Vui lòng đăng nhập để sử dụng danh sách yêu thích!');
      return;
    }
    try {
      const result = await toggleWishlist(product.id);
      toast.success(result.message);
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  }

  const flashSalePrice = product.promotionalPrice ?? null;
  const displayPrice = flashSalePrice ?? (product.isOnSale && product.salePrice ? product.salePrice : product.price);
  const originalPrice = product.price;
  const discountPct = displayPrice < originalPrice
    ? Math.round((1 - displayPrice / originalPrice) * 100) : 0;

  // Resolve ảnh từ DB path → bundled Vite URL
  const resolvedMainImage = resolveImage(product.mainImageUrl);
  const resolvedSubImages = (product.subImages ?? []).map(img => ({
    ...img,
    url: resolveImage(img.url),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/" className="hover:text-amber-500">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/danh-muc" className="hover:text-amber-500">Sản phẩm</Link>
        <ChevronRight size={14} />
        <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Gallery */}
        <ProductGallery mainImageUrl={resolvedMainImage} subImages={resolvedSubImages} name={product.name} />

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
            <button onClick={handleToggleWishlist}
              className={`p-2 rounded-full transition-colors flex-shrink-0 ${isWishlisted ? 'bg-red-50' : 'hover:bg-red-50'}`}
              title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>
              <Heart size={22} className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16}
                  className={i < Math.round(product.averageRating ?? 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.averageRating?.toFixed(1) ?? '—'} ({product.reviewCount} đánh giá)</span>
            <span className="text-sm text-gray-400">· Đã bán {product.soldCount}</span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            {flashSalePrice ? (
              <>
                {/* Flash Sale badge */}
                <div className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  ⚡ FLASH SALE
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-bold text-red-600">{formatVnd(flashSalePrice)}</span>
                  <span className="text-gray-400 line-through text-lg">{formatVnd(originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">-{discountPct}%</span>
                </div>
              </>
            ) : product.isOnSale && product.salePrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">{formatVnd(product.salePrice)}</span>
                <span className="text-gray-400 line-through text-lg">{formatVnd(product.price)}</span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">-{discountPct}%</span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">{formatVnd(product.price)}</span>
            )}
          </div>

          {/* Category + Material */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
              {product.category?.name}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {product.material}
            </span>
            {product.style && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                {product.style}
              </span>
            )}
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              🎨 {product.color}
            </span>
          </div>

          {/* Kích thước */}
          <ProductSpecs product={product} />

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {product.stock > 0 ? `✓ Còn hàng (${product.stock})` : '✗ Hết hàng'}
          </p>

          {/* Qty + Add to cart */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(v => Math.max(1, v - 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg font-medium">−</button>
              <span className="w-12 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(v => Math.min(product.stock, v + 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-50 text-gray-600 text-lg font-medium">+</button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 btn-primary flex items-center justify-center gap-2">
              <ShoppingCart size={18} /> Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Mô tả / Thông số / Đánh giá */}
      <div className="border-b border-gray-200 flex gap-6 mb-6">
        {[
          { key: 'desc', label: 'Mô tả' },
          { key: 'spec', label: 'Thông số kỹ thuật' },
          { key: 'review', label: `Đánh giá (${product.reviewCount})` },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors
     ${activeTab === t.key ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'desc' && (
        <div className="max-w-2xl text-gray-700 leading-relaxed text-sm">{product.description}</div>
      )}

      {activeTab === 'spec' && <ProductSpecs product={product} detailed />}

      {activeTab === 'review' && (
        <div className="space-y-4 max-w-2xl">
          {product.latestReviews?.length === 0 && (
            <p className="text-gray-400 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          )}
          {product.latestReviews?.map(r => (
            <div key={r.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs">
                  {r.userName[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.userName}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12}
                        className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                    ))}

                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{r.comment}</p>
              {r.adminReply && (
                <div className="mt-2 pl-3 border-l-2 border-amber-300 text-xs text-gray-500">
                  💬 Phản hồi: {r.adminReply}
                </div>
              )}
            </div>
          ))}

        </div>
      )}

      {/* Sản phẩm mua kèm */}
      {product.bundledProducts?.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Sản phẩm mua kèm</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.bundledProducts.map(b => (
              <ProductCard key={b.id} product={{ ...b, mainImageUrl: resolveImage(b.mainImageUrl) }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
