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

  if (!productColors?.length) return null;

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
            key={color.id}
            onClick={() => onSelectColor(color)}
            className={`relative w-12 h-12 rounded-full border-2 transition-all ${
              selectedColor?.id === color.id
                ? `border-blue-500 ${
                    isDark ? "dark:border-blue-400" : ""
                  } scale-110`
                : `border-gray-300 ${isDark ? "dark:border-gray-600" : ""}`
            }`}
            style={{ backgroundColor: color.hexCode }}
            title={color.name}
          >
            {selectedColor?.id === color.id && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      {selectedColor && (
        <p
          className={`text-sm font-medium mt-2 px-2 py-1 rounded ${
            isDark ? "text-gray-300 bg-gray-600" : "text-gray-600 bg-white"
          }`}
        >
          Đã chọn: {selectedColor.name}
        </p>
      )}
    </div>
  );
}
