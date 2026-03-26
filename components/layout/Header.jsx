import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  Phone,
} from "lucide-react";

import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCategoriesStore } from "../../store/categoriesStore";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/danh-muc", label: "Sản phẩm", hasDropdown: true },
  { to: "/bo-suu-tap", label: "Nổi bật" },
  { to: "/chinh-sach", label: "Chính sách" },
  { to: "/blog", label: "Tin tức" },
  { to: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  // CART
  const items = useCartStore((s) => s.items || []);
  const totalItems = items.reduce((s, i) => s + (i.quantity || 0), 0);

  // AUTH
  const { user, logout } = useAuthStore();

  // WISHLIST
  const wishlistIds = useWishlistStore((s) => s.ids || []);
  const fetchWishlistIfNeeded = useWishlistStore((s) => s.fetchIfNeeded);
  const resetWishlist = useWishlistStore((s) => s.reset);

  // CATEGORIES
  const { categories, fetchIfEmpty } = useCategoriesStore();

  useEffect(() => {
    fetchIfEmpty();
  }, [fetchIfEmpty]);

  useEffect(() => {
    if (user) fetchWishlistIfNeeded();
    else resetWishlist();
  }, [user, fetchWishlistIfNeeded, resetWishlist]);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const quickCategories = safeCategories.slice(0, 6);

  function handleSearch(e) {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/danh-muc?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setSearchVal("");
    }
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="hidden md:block bg-[#020617] text-gray-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-xs">
          <span className="flex items-center gap-2">
            <Phone size={12} />
            Hotline: <strong className="text-blue-400">1900 2345</strong> · Miễn
            phí ship từ 500k
          </span>

          <div className="flex gap-4">
            <Link to="/lien-he" className="hover:text-blue-400">
              Tư vấn
            </Link>
            <Link to="/blog" className="hover:text-blue-400">
              Tin tức
            </Link>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 mr-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow">
              📱
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-blue-600">TechStore</span>
              <span className="block text-[10px] text-gray-400">
                Mobile & Accessories
              </span>
            </div>
          </Link>

          {/* NAV */}
          <nav className="hidden lg:flex gap-2 flex-1">
            {navLinks.map((l) => (
              <div key={l.to} className="relative group">
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`
                  }
                >
                  {l.label}
                  {l.hasDropdown && <ChevronDown size={12} />}
                </NavLink>

                {/* DROPDOWN */}
                {l.hasDropdown && quickCategories.length > 0 && (
                  <div className="absolute top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200">
                    {quickCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/danh-muc?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2 ml-auto">
            {/* SEARCH */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="p-2 hover:bg-blue-50 rounded-full transition"
            >
              <Search size={18} />
            </button>

            {/* WISHLIST */}
            <Link
              to="/yeu-thich"
              className="relative p-2 hover:bg-blue-50 rounded-full transition"
            >
              <Heart size={18} />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full shadow">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link
              to="/gio-hang"
              className="relative p-2 hover:bg-blue-50 rounded-full transition"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 rounded-full shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {user ? (
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:underline"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                to="/dang-nhap"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm shadow hover:opacity-90 transition"
              >
                Đăng nhập
              </Link>
            )}

            {/* MOBILE */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* SEARCH BOX */}
        {searchOpen && (
          <div className="p-3 border-t bg-white animate-fade-in">
            <form
              onSubmit={handleSearch}
              className="max-w-lg mx-auto flex shadow-sm"
            >
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Tìm điện thoại, phụ kiện..."
                className="flex-1 border px-3 py-2 rounded-l outline-none"
              />
              <button className="bg-blue-600 text-white px-4 rounded-r">
                Tìm
              </button>
            </form>
          </div>
        )}

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t p-4 space-y-2 animate-fade-in">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
