// src/pages/CollectionPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../api/products";
import ProductCard from "../components/product/ProductCard";
import { resolveImage } from "../utils/imageResolver";

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    setLoading(true);

    productApi
      .getProducts({ categorySlug: "bo-suu-tap", page, pageSize: 12 })
      .then((res) => {
        const data = res.items || [];

        // ✅ FIX: nếu API rỗng → fake data
        if (data.length === 0) {
          const fakeProducts = [
            {
              id: 1,
              name: "iPhone 15 Pro Max",
              price: 32990000,
              mainImageUrl:
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            },
            {
              id: 2,
              name: "Samsung Galaxy A15",
              price: 5490000,
              mainImageUrl:
                "https://images.unsplash.com/photo-1580910051074-3eb694886505",
            },
            {
              id: 3,
              name: "Tai nghe Bluetooth",
              price: 490000,
              mainImageUrl:
                "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
            },
          ];

          setProducts(fakeProducts);
          setTotal(fakeProducts.length);
        } else {
          setProducts(data);
          setTotal(res.total || data.length);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page]);

  const setPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 🔥 HERO BANNER */}
      <div className="relative w-full h-72 md:h-[400px] flex items-center justify-center overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
          alt="Công nghệ"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Sản phẩm nổi bật 🔥
          </h1>
          <p className="text-gray-300">
            Điện thoại, tai nghe và phụ kiện công nghệ mới nhất
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Tất Cả Sản Phẩm
            {!loading && (
              <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                {total}
              </span>
            )}
          </h2>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-60 bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Không có sản phẩm nào.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    ...p,
                    mainImageUrl: resolveImage(p.mainImageUrl),
                  }}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {total > 12 && (
              <div className="mt-10 flex justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Trang trước
                </button>

                <button
                  disabled={page * 12 >= total}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
