import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import ProductFilter from "../components/product/ProductFilter";
import { productApi } from "../api/products";
import { resolveImage } from "../utils/imageResolver";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = {
    categorySlug: searchParams.get("category") || undefined,
    q: searchParams.get("q") || undefined,

    // ✅ FILTER MỚI
    brand: searchParams.get("brand") || undefined,
    ram: searchParams.get("ram") || undefined,
    storage: searchParams.get("storage") || undefined,

    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,

    sortBy: searchParams.get("sortBy") || "newest",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: 12,
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    productApi
      .getProducts({}) // 🔥 lấy toàn bộ rồi filter local
      .then((res) => {
        if (cancelled) return;

        let data = res.items || [];

        // 🔍 SEARCH
        if (filters.q) {
          data = data.filter((p) =>
            p.name.toLowerCase().includes(filters.q.toLowerCase()),
          );
        }

        // ✅ BRAND
        if (filters.brand) {
          data = data.filter((p) => p.brand === filters.brand);
        }

        // ✅ RAM
        if (filters.ram) {
          data = data.filter((p) => p.ram === filters.ram);
        }

        // ✅ STORAGE
        if (filters.storage) {
          data = data.filter((p) => p.storage === filters.storage);
        }

        // 💰 PRICE
        if (filters.minPrice) {
          data = data.filter((p) => p.price >= filters.minPrice);
        }

        if (filters.maxPrice) {
          data = data.filter((p) => p.price <= filters.maxPrice);
        }

        // 🔃 SORT
        if (filters.sortBy === "price_asc") {
          data.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === "price_desc") {
          data.sort((a, b) => b.price - a.price);
        }

        // 🖼 IMAGE
        const mapped = data.map((p) => ({
          ...p,
          mainImageUrl: resolveImage(p.images?.[0]),
        }));

        // 📄 PAGINATION
        const start = (filters.page - 1) * filters.pageSize;
        const end = start + filters.pageSize;
        const paginated = mapped.slice(start, end);

        setProducts(paginated);
        setTotal(mapped.length);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleFilterChange(changed) {
    const next = new URLSearchParams(searchParams);

    Object.entries(changed).forEach(([k, v]) => {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });

    next.set("page", "1");
    setSearchParams(next);
  }

  const totalPages = Math.ceil(total / filters.pageSize);

  const pageTitle = filters.q
    ? `Kết quả tìm kiếm: "${filters.q}"`
    : "Tất cả sản phẩm";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{total} sản phẩm</p>
        </div>

        <button
          onClick={() => setFilterOpen((v) => !v)}
          className="md:hidden flex items-center gap-2 btn-outline text-sm py-2"
        >
          <SlidersHorizontal size={16} /> Bộ lọc
        </button>
      </div>

      <div className="flex gap-6">
        {/* SIDEBAR */}
        <aside
          className={`
          ${filterOpen ? "fixed inset-0 z-40 bg-white p-4" : "hidden"}
          md:block md:static md:z-auto md:bg-transparent md:p-0
          w-full md:w-64
        `}
        >
          {filterOpen && (
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Bộ lọc</span>
              <button onClick={() => setFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>
          )}

          <ProductFilter filters={filters} onChange={handleFilterChange} />
        </aside>

        {/* PRODUCT */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p>Không tìm thấy sản phẩm</p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 btn-outline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => handleFilterChange({ page: p })}
                        className={`w-9 h-9 rounded-xl
                        ${
                          p === filters.page
                            ? "bg-amber-500 text-white"
                            : "bg-white border"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
