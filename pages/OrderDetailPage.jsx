import { useParams } from "react-router-dom";

export default function OrderDetailPage() {
  const { id } = useParams();

  // fake data (sau này gọi API)
  const order = {
    id,
    status: "shipping",
    steps: [
      { label: "Đã đặt hàng", done: true },
      { label: "Xác nhận", done: true },
      { label: "Đang giao", done: true },
      { label: "Đã giao", done: false },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-6">Đơn hàng #{id}</h1>

      {/* TRACKING */}
      <div className="bg-white rounded-2xl p-6 border">
        <div className="space-y-6">
          {order.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* DOT */}
              <div
                className={`w-4 h-4 rounded-full ${
                  step.done ? "bg-green-500" : "bg-gray-300"
                }`}
              />

              {/* LINE */}
              <div className="flex-1 border-b border-dashed" />

              <span
                className={`text-sm ${
                  step.done ? "text-green-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
