import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  ShoppingBag,
  Tag,
  Star,
  FileText,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useState } from "react";

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/san-pham", label: "Sản phẩm", icon: Package },
  { to: "/admin/don-hang", label: "Đơn hàng", icon: ShoppingBag },
  { to: "/admin/lich-hen", label: "Lịch hẹn", icon: CalendarDays },
  { to: "/admin/khuyen-mai", label: "Khuyến mãi", icon: Tag },
  { to: "/admin/danh-gia", label: "Đánh giá", icon: Star },
  { to: "/admin/bai-viet", label: "Blog / Lookbook", icon: FileText },
];

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // 🔒 Protect admin route
  if (!user || user.role !== "Admin") {
    return <Navigate to="/dang-nhap" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-60"
        } flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-200`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100 gap-3">
          {!collapsed && (
            <span className="font-bold text-gray-900">🏮 Admin Panel</span>
          )}

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto p-1 rounded hover:bg-gray-100"
          >
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {adminNav.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-amber-100 text-amber-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-gray-100">
          {!collapsed && (
            <div className="flex items-center gap-2 mb-2 px-2">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
                {user.fullName?.[0] || "A"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={16} />
            {!collapsed && "Đăng xuất"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6">
          <h1 className="text-base font-semibold text-gray-800">
            Quản trị viên
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
