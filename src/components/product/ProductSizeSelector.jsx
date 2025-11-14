import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductSizeSelector({
  productSizes,
  selectedSize,
  onSelectSize,
}) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  if (!productSizes?.length) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
    >
      <h3
        className={`text-lg font-semibold mb-3 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Chọn kích thước:
      </h3>
      <select
        value={selectedSize?.id || ""}
        onChange={(e) => {
          const sizeId = parseInt(e.target.value);
          const size = productSizes.find((s) => s.id === sizeId);
          onSelectSize(size || null);
        }}
        className={`w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          isDark
            ? "border-gray-600 bg-gray-600 text-gray-200 focus:ring-blue-400"
            : "border-gray-300 bg-white text-gray-700"
        }`}
      >
        <option value="">-- Chọn kích thước --</option>
        {productSizes.map((size) => (
          <option key={size.id} value={size.id}>
            {size.name}
            {size.description && ` - ${size.description}`}
          </option>
        ))}
      </select>
      {selectedSize && (
        <p
          className={`text-sm font-medium mt-2 px-2 py-1 rounded ${
            isDark ? "text-gray-300 bg-gray-600" : "text-gray-600 bg-white"
          }`}
        >
          Đã chọn: {selectedSize.name}
          {selectedSize.description && ` - ${selectedSize.description}`}
        </p>
      )}
    </div>
  );
}
