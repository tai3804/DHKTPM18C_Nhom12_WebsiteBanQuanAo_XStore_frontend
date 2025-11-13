import React from "react";
import { useSelector } from "react-redux";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { getImageUrl } from "../../utils/imageUrl";

export default function CartToast({ product }) {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div className="flex items-center gap-3">
      {/* Icon Success */}
      <div className="shrink-0">
        <CheckCircle className="h-6 w-6 text-green-500" />
      </div>

      {/* Product Image */}
      {product?.image && (
        <div className="shrink-0">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-12 h-12 object-cover rounded"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold transition-colors duration-300 ${
            themeMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Đã thêm vào giỏ hàng!
        </p>
        <p
          className={`text-xs truncate transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {product?.name}
        </p>
      </div>

      {/* Cart Icon */}
      <div className="shrink-0">
        <ShoppingCart
          className={`h-5 w-5 transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-600" : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );
}
