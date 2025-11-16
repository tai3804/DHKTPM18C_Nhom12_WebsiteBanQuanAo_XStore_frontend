import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductPriceInfo({ product, formatPrice }) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  // Tính giá hiển thị và discount
  const displayPrice =
    product.sale && product.productSales
      ? product.productSales.discountedPrice
      : product.price;

  const originalPrice =
    product.sale && product.productSales
      ? product.productSales.originalPrice
      : null;

  const discountPercent =
    product.sale && product.productSales
      ? product.productSales.discountPercent
      : 0;

  return (
    <div className="mb-6">
      <div
        className={`text-3xl font-bold mb-2 ${
          isDark ? "text-red-400" : "text-red-600"
        }`}
      >
        {formatPrice(displayPrice)}
      </div>
      {originalPrice && originalPrice > displayPrice && (
        <div className="flex items-center space-x-2">
          <span
            className={`text-lg line-through ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {formatPrice(originalPrice)}
          </span>
          <span
            className={`px-2 py-1 rounded-md text-sm font-medium ${
              isDark ? "bg-red-900 text-red-400" : "bg-red-100 text-red-600"
            }`}
          >
            -{discountPercent}%
          </span>
        </div>
      )}
    </div>
  );
}
