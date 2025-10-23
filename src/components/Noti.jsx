import { useEffect, useState } from "react";

export default function Noti({ message, type = "info", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // slide in
    setVisible(true);

    // timer riêng cho từng noti
    const timer = setTimeout(() => {
      setVisible(false);          // trigger slide out
      setTimeout(onClose, 300);   // đợi animation xong mới remove
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  const bgColor =
    type === "success" ? "bg-green-100" :
    type === "error" ? "bg-red-100" :
    "bg-blue-100";

  const borderColor =
    type === "success" ? "border-green-600" :
    type === "error" ? "border-red-600" :
    "border-blue-600";

  return (
    <div className={`
      relative max-w-xs w-auto px-6 py-4 rounded shadow-lg ${bgColor} border-l-2 ${borderColor}
      transform transition-all duration-300 ease-in-out
      ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
    `}>
      {message}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="absolute top-1 right-2 text-gray-700 font-bold hover:text-black"
      >
        ×
      </button>
    </div>
  );
}
