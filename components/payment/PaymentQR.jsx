export default function PaymentQR({ amount = 0, orderId }) {
  const safeAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border">
      <h3 className="font-bold mb-2">Quet ma QR de thanh toan</h3>
      <p className="text-sm text-gray-500 mb-4">
        Don hang #{orderId} - So tien:{" "}
        <span className="font-semibold text-gray-800">{safeAmount.toLocaleString("vi-VN")} VND</span>
      </p>

      <div className="rounded-xl border bg-gray-50 p-4 flex justify-center">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=ORDER-${orderId}-AMOUNT-${safeAmount}`}
          alt="QR thanh toan"
          className="w-56 h-56"
          loading="lazy"
        />
      </div>
    </div>
  );
}
