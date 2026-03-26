// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import PolicyPage from "./pages/PolicyPage";
import CollectionPage from "./pages/CollectionPage";
import WishlistPage from "./pages/WishlistPage";
import VnPayReturnPage from "./pages/VnPayReturnPage";
import ContactPage from "./pages/ContactPage";

// 🔥 NEW
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderDetailPage from "./pages/OrderDetailPage";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="flex-1">
          <Routes>
            {/* Trang chính */}
            <Route path="/" element={<HomePage />} />
            <Route path="/danh-muc" element={<ProductListPage />} />
            <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
            <Route path="/bo-suu-tap" element={<CollectionPage />} />

            {/* Giỏ hàng */}
            <Route path="/gio-hang" element={<CartPage />} />
            <Route path="/thanh-toan" element={<CheckoutPage />} />

            {/* 🔥 SUCCESS + TRACKING */}
            <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
            <Route path="/don-hang/:id" element={<OrderDetailPage />} />

            {/* Auth */}
            <Route path="/dang-nhap" element={<LoginPage />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            {/* Chính sách */}
            <Route path="/chinh-sach" element={<PolicyPage />} />
            <Route path="/chinh-sach/:type" element={<PolicyPage />} />

            {/* Liên hệ */}
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="/dat-lich" element={<ContactPage />} />

            {/* Khác */}
            <Route path="/yeu-thich" element={<WishlistPage />} />

            {/* VNPay return */}
            <Route path="/vnpay-return" element={<VnPayReturnPage />} />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <h1 className="text-3xl font-bold mb-2">404</h1>
                  <p className="text-gray-500 mb-4">
                    Trang bạn tìm không tồn tại
                  </p>
                  <a
                    href="/"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Về trang chủ
                  </a>
                </div>
              }
            />
          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </Router>
  );
}
