import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductDescription({ product }) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  if (!product.description) return null;

  return (
    <div
      className={`rounded-lg p-6 shadow-sm mb-8 ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Mô tả sản phẩm
      </h2>
      <div
        className={`p-4 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}
      >
        <div
          className={`leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      </div>
    </div>
  );
}
