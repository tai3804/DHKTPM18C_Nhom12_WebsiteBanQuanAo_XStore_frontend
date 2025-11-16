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

  if (!productSizes?.length) {
    return null;
  }

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
      <div className="flex flex-wrap gap-3">
        {productSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectSize(size)}
            className={`relative px-4 py-2 border-2 rounded-lg transition-all font-medium ${
              selectedSize === size
                ? `border-blue-500 bg-blue-500 text-white ${
                    isDark ? "dark:border-blue-400 dark:bg-blue-400" : ""
                  } scale-105`
                : `border-gray-300 ${
                    isDark
                      ? "dark:border-gray-600 bg-gray-600 text-gray-200"
                      : "bg-white text-gray-700"
                  } hover:border-gray-400`
            }`}
            title={size}
          >
            {size}
            {selectedSize === size && (
              <div className="absolute -top-1 -right-1 rounded-full bg-green-500 p-0.5">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
