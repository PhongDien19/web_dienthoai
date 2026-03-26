import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId || "N/A";
  const amount = state?.amount || 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full space-y-5">
        {/* ICON */}
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-2xl">
          ✅
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Đặt hàng thành công!
        </h1>

        <p className="text-gray-500">
          Mã đơn: <b>#{orderId}</b>
        </p>

        <p className="text-gray-500">
          Tổng tiền: <b>{amount.toLocaleString()}đ</b>
        </p>

        {/* BUTTON */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-2 rounded-lg bg-gray-200"
          >
            Trang chủ
          </button>

          <button
            onClick={() => navigate(`/don-hang/${orderId}`)}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}
