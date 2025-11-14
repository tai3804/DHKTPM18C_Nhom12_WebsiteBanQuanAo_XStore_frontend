import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductQuantitySelector({
  quantity,
  onQuantityChange,
}) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  return (
    <div
      className={`mb-6 p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
    >
      <h3
        className={`text-lg font-semibold mb-3 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Số lượng:
      </h3>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold disabled:cursor-not-allowed transition-all ${
            isDark
              ? "border-gray-600 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-800 text-gray-200"
              : "border-gray-300 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700"
          }`}
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 1;
            onQuantityChange(val);
          }}
          min="1"
          className={`w-20 h-10 text-center border rounded-lg font-semibold transition-all ${
            isDark
              ? "border-gray-600 bg-gray-600 text-gray-200"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        />
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold transition-all ${
            isDark
              ? "border-gray-600 bg-gray-600 hover:bg-gray-500 text-gray-200"
              : "border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
}
