import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ProductSummary = ({ cartItems }) => {
  const themeMode = useSelector(selectThemeMode);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div
        className={`p-6 rounded-lg border-2 border-dashed transition-colors ${
          themeMode === "dark"
            ? "border-gray-600 bg-gray-800/50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="text-center py-8">
          <p
            className={`text-lg font-semibold ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Giỏ hàng trống
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 ${
          themeMode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Sản phẩm đặt mua ({cartItems.length} sản phẩm)
      </h3>

      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <div
            key={item.id || index}
            className={`flex gap-4 p-4 rounded-lg border transition-colors ${
              themeMode === "dark"
                ? "bg-gray-900/50 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Product Image */}
            <div className="shrink-0">
              <img
                src={item.product?.image || "/placeholder-image.jpg"}
                alt={item.product?.name || "Sản phẩm"}
                className="w-20 h-20 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold text-sm mb-2 line-clamp-2 ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {item.product?.name}
              </h4>

              {/* Product Variants */}
              <div
                className={`flex flex-wrap gap-3 mb-2 text-xs ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.color && (
                  <span
                    className={`px-2 py-1 rounded-full ${
                      themeMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    Màu: {item.color}
                  </span>
                )}
                {item.size && (
                  <span
                    className={`px-2 py-1 rounded-full ${
                      themeMode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    Size: {item.size}
                  </span>
                )}
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Số lượng:{" "}
                  <span className="font-semibold">{item.quantity}</span>
                </span>

                <div className="text-right">
                  <div
                    className={`text-sm ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {(item.product?.price || 0).toLocaleString("vi-VN")}đ ×{" "}
                    {item.quantity}
                  </div>
                  <div
                    className={`font-bold ${
                      themeMode === "dark"
                        ? "text-indigo-400"
                        : "text-indigo-600"
                    }`}
                  >
                    {(
                      (item.product?.price || 0) * item.quantity
                    ).toLocaleString("vi-VN")}
                    đ
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className={`mt-4 pt-4 border-t ${
          themeMode === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Tạm tính ({cartItems.length} sản phẩm):
          </span>
          <span
            className={`text-lg font-bold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {cartItems
              .reduce(
                (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                0
              )
              .toLocaleString("vi-VN")}
            đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
