import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductDetails({ product, colors = [], sizes = [] }) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

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
        Thông tin chi tiết
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-semibold">Mã sản phẩm:</span> #{product.id}
          </p>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-semibold">Danh mục:</span>{" "}
            {product.productType?.name}
          </p>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-semibold">Thương hiệu:</span> XStore
          </p>
        </div>
        <div className="space-y-2">
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-semibold">Tình trạng:</span>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                isDark
                  ? "bg-green-900 text-green-200"
                  : "bg-green-100 text-green-800"
              }`}
            >
              Còn hàng
            </span>
          </p>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-semibold">Có sẵn:</span> Tại tất cả các kho
          </p>
          {/* Mô tả sản phẩm */}
          {product.description && (
            <div className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
              <span className="font-semibold">Mô tả:</span>
              <div
                className={`leading-relaxed mt-1 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
