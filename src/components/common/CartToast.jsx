import React from "react";
import { ShoppingCart, CheckCircle } from "lucide-react";

export default function CartToast({ product }) {
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
            src={product.image}
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
        <p className="text-sm font-semibold text-gray-900">
          Đã thêm vào giỏ hàng!
        </p>
        <p className="text-xs text-gray-600 truncate">{product?.name}</p>
      </div>

      {/* Cart Icon */}
      <div className="shrink-0">
        <ShoppingCart className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
}
