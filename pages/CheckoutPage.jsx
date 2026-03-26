// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { formatVnd } from "../utils/format";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import PaymentQR from "../components/payment/PaymentQR";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");

  const [form, setForm] = useState({
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
  });

  const finalAmount =
    state?.finalAmount ??
    items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handlePlaceOrder() {
    if (submitted) return;

    if (!form.receiverName || !form.receiverPhone || !form.receiverAddress) {
      return toast.error("Vui lòng điền đầy đủ thông tin");
    }

    setLoading(true);
    setSubmitted(true);

    try {
      const res = await apiClient.post("/orders", {
        type: "Retail",
        paymentMethod,
        ...form,
        voucherCode: state?.voucherCode ?? null,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          mainImageUrl: i.mainImageUrl,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      });

      // 🔥 VNPay
      if (paymentMethod === "vnpay" && res.data.paymentUrl) {
        clearCart();
        toast.success("Đang chuyển sang VNPay...");
        window.location.href = res.data.paymentUrl;
        return;
      }

      // 🔥 COD
      if (paymentMethod === "cod") {
        clearCart();
        toast.success("Đặt hàng thành công!");
        navigate("/dat-hang-thanh-cong", {
          state: {
            orderId: res.data.id,
            amount: finalAmount,
          },
        });
        return;
      }

      // 🔥 QR → giữ lại để user quét
      toast.success("Vui lòng quét mã để thanh toán");
    } catch (err) {
      setSubmitted(false);

      const msg =
        err.response?.data?.message ?? "Có lỗi xảy ra, vui lòng thử lại";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* FORM */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-bold mb-4">Thông tin giao hàng</h2>

            <div className="grid gap-4">
              <input
                name="receiverName"
                placeholder="Họ tên"
                value={form.receiverName}
                onChange={handleChange}
                className="input"
              />

              <input
                name="receiverPhone"
                placeholder="SĐT"
                value={form.receiverPhone}
                onChange={handleChange}
                className="input"
              />

              <textarea
                name="receiverAddress"
                placeholder="Địa chỉ"
                value={form.receiverAddress}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-bold mb-4">Phương thức thanh toán</h2>

            <div className="space-y-3">
              {/* VNPay */}
              <div
                onClick={() => setPaymentMethod("vnpay")}
                className={`p-4 border rounded-xl cursor-pointer flex justify-between ${
                  paymentMethod === "vnpay" ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <span>VNPay</span>
                <span>ATM · QR · Visa</span>
              </div>

              {/* QR */}
              <div
                onClick={() => setPaymentMethod("qr")}
                className={`p-4 border rounded-xl cursor-pointer ${
                  paymentMethod === "qr" ? "border-green-500 bg-green-50" : ""
                }`}
              >
                Chuyển khoản QR
              </div>

              {/* COD */}
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 border rounded-xl cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-orange-500 bg-orange-50"
                    : ""
                }`}
              >
                Thanh toán khi nhận hàng (COD)
              </div>
            </div>
          </div>

          {/* QR SHOW */}
          {paymentMethod === "qr" && (
            <PaymentQR amount={finalAmount} orderId={Date.now()} />
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* CART */}
          <div className="bg-white rounded-2xl p-5 border">
            <h2 className="font-bold mb-3">Đơn hàng</h2>

            {items.map((i) => (
              <div
                key={i.productId}
                className="flex justify-between text-sm py-2"
              >
                <span>
                  {i.productName} x{i.quantity}
                </span>
                <span>{formatVnd(i.unitPrice * i.quantity)}</span>
              </div>
            ))}

            <div className="flex justify-between font-bold text-lg mt-3">
              <span>Tổng</span>
              <span className="text-blue-600">{formatVnd(finalAmount)}</span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading || submitted}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            {loading ? "Đang xử lý..." : `Thanh toán ${formatVnd(finalAmount)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
