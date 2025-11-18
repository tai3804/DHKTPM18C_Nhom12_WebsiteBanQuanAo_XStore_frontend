import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductActionButtons({
  isAddingToCart,
  isBuying,
  onAddToCart,
  onBuyNow,
}) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  return (
    <div className="flex gap-3">
      <button
        onClick={onAddToCart}
        disabled={isAddingToCart}
        className={`flex-1 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
          isDark
            ? "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white"
        } disabled:cursor-not-allowed`}
      >
        {isAddingToCart ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang thêm...
          </div>
        ) : (
          "Thêm vào giỏ hàng"
        )}
      </button>

      <button
        onClick={onBuyNow}
        disabled={isBuying}
        className={`flex-1 font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg bg-linear-to-r ${
          isDark
            ? " from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 text-white"
            : " from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white"
        } disabled:cursor-not-allowed`}
      >
        {isBuying ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang mua...
          </div>
        ) : (
          "Mua ngay"
        )}
      </button>
    </div>
  );
}
