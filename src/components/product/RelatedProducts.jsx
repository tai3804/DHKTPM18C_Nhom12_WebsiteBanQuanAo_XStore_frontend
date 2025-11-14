import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function RelatedProducts() {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  return (
    <div
      className={`rounded-lg p-6 shadow-sm ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Sản phẩm liên quan
      </h2>
      <div
        className={`text-center py-8 rounded-lg ${
          isDark ? "bg-gray-700/50" : "bg-gray-50"
        }`}
      >
        <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Đang cập nhật...
        </p>
      </div>
    </div>
  );
}
