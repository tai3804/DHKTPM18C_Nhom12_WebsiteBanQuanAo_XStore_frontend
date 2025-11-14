import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductColorSelector({
  productColors,
  selectedColor,
  onSelectColor,
}) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  if (!productColors?.length) {
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
        Chọn màu sắc:
      </h3>
      <div className="flex flex-wrap gap-3">
        {productColors.map((color) => (
          <button
            key={color}
            onClick={() => onSelectColor(color)}
            className={`relative px-4 py-2 border-2 rounded-lg transition-all font-medium ${
              selectedColor === color
                ? `border-blue-500 bg-blue-500 text-white ${
                    isDark ? "dark:border-blue-400 dark:bg-blue-400" : ""
                  } scale-105`
                : `border-gray-300 ${
                    isDark
                      ? "dark:border-gray-600 bg-gray-600 text-gray-200"
                      : "bg-white text-gray-700"
                  } hover:border-gray-400`
            }`}
            title={color}
          >
            {color}
            {selectedColor === color && (
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
