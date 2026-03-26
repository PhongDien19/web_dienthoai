import { useEffect, useState } from "react";

export default function FlashSaleCountdown({ endAt }) {
  // ✅ init state bằng function (KHÔNG cần setState trong effect)
  const [timeLeft, setTimeLeft] = useState(() => {
    if (!endAt) return { hours: 0, minutes: 0, seconds: 0 };

    const diff = new Date(endAt).getTime() - Date.now();

    if (isNaN(diff) || diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor(diff / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    };
  });

  useEffect(() => {
    const calcTimeLeft = () => {
      if (!endAt) return { hours: 0, minutes: 0, seconds: 0 };

      const diff = new Date(endAt).getTime() - Date.now();

      if (isNaN(diff) || diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor(diff / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endAt]);

  const pad = (n) => String(n || 0).padStart(2, "0");

  const units = [
    { label: "Giờ", value: timeLeft.hours },
    { label: "Phút", value: timeLeft.minutes },
    { label: "Giây", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((unit, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <span className="bg-gradient-to-b from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md tabular-nums min-w-[40px] text-center">
              {pad(unit.value)}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {unit.label}
            </span>
          </div>

          {i < 2 && (
            <span className="text-red-500 font-bold text-lg -mt-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
