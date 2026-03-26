import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import FlashSaleCountdown from "../components/common/FlashSaleCountdown";
import { productApi } from "../api/products";
import { blogApi } from "../api/blogs";
import { resolveImage } from "../utils/imageResolver";

// helper chống lỗi response
const toArray = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  return [];
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // flash sale 6h
  const [flashSaleEnd] = useState(
    () => new Date(Date.now() + 6 * 60 * 60 * 1000),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // PRODUCTS
        const productRes = await productApi.getProducts({});
        const productArr = toArray(productRes).map((p) => ({
          ...p,
          mainImageUrl: resolveImage(
            p.mainImageUrl || p.image || p.images?.[0],
          ),
        }));
        setProducts(productArr);

        // BLOGS
        let blogArr = [];
        if (blogApi?.getAll) {
          blogArr = toArray(await blogApi.getAll());
        } else if (blogApi?.getBlogs) {
          blogArr = toArray(await blogApi.getBlogs());
        }
        setBlogs(blogArr);
      } catch (error) {
        console.error("Lỗi load dữ liệu:", error);
        setProducts([]);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const flashSale = products.slice(0, 6);
  const newProducts = products.slice(6, 12);

  return (
    <div className="bg-slate-50">
      {/* 🔥 HERO */}
      <section className="relative h-[420px] overflow-hidden">
        <img
          src="https://cdn.tgdd.vn/2023/08/banner/iphone-15-1200x300.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]"
          alt="banner"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Mua sắm công nghệ <br />
              <span className="text-blue-400">chính hãng 100%</span>
            </h1>

            <p className="mb-6 text-slate-300 max-w-lg">
              iPhone, Samsung, Xiaomi giá tốt nhất thị trường.
            </p>

            <div className="flex gap-4">
              <Link
                to="/danh-muc"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Mua ngay <ArrowRight size={18} />
              </Link>

              <Link
                to="/danh-muc"
                className="border border-white/40 px-6 py-3 rounded-lg"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ FLASH SALE */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">⚡ Flash Sale</h2>
          <FlashSaleCountdown endAt={flashSaleEnd} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : flashSale.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* 🆕 SẢN PHẨM MỚI */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">🆕 Sản phẩm mới</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* 🔥 PROMO */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative rounded-2xl p-8 text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Giảm đến 30% phụ kiện 🔥</h3>
              <p>Sạc, cáp, tai nghe chính hãng</p>
            </div>

            <Link
              to="/danh-muc"
              className="bg-white text-blue-600 px-5 py-2 rounded-lg"
            >
              Xem ngay
            </Link>
          </div>
        </div>
      </section>

      {/* 📰 BLOG */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">📰 Tin công nghệ</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-60 bg-gray-200 animate-pulse rounded-xl"
                />
              ))
            : blogs.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="bg-white rounded-xl overflow-hidden border hover:shadow-lg"
                >
                  <img
                    src={resolveImage(b.image)}
                    className="h-40 w-full object-cover"
                    alt={b.title}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-gray-500">{b.description}</p>
                  </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}
