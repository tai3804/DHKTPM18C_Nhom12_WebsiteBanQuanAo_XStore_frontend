import React from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ProductSummary = ({ cartItems }) => {
  const themeMode = useSelector(selectThemeMode);
  const { productSales } = useSelector((state) => state.productSales);

  // Helper function to get product price (sale price or regular price)
  const getProductPrice = (product) => {
    if (!product) return 0;
    const productSale = productSales?.find(
      (ps) => ps.product?.id === product.id
    );
    return productSale ? productSale.discountedPrice : product.price || 0;
  };

  // Helper function to get original price (for showing strikethrough)
  const getOriginalPrice = (product) => {
    if (!product) return 0;
    const productSale = productSales?.find(
      (ps) => ps.product?.id === product.id
    );
    return productSale ? productSale.originalPrice : product.price || 0;
  };

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
            className={`border rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition-all ${
              themeMode === "dark"
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <img
              src={item.product?.image || "/placeholder-image.jpg"}
              alt={item.product?.name || "Sản phẩm"}
              className="w-24 h-24 object-contain rounded"
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
            <div className="flex-1">
              <h4
                className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {item.product?.name}
              </h4>
              <p
                className={`text-sm mb-2 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.product?.brand} • {item.productInfo?.sizeName} •{" "}
                {item.productInfo?.colorName}
              </p>
              <div className="mb-2">
                {getProductPrice(item.product) !==
                getOriginalPrice(item.product) ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg font-bold transition-colors duration-300 ${
                        themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {getProductPrice(item.product)?.toLocaleString("vi-VN")}đ
                    </span>
                    <span
                      className={`text-sm line-through transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {getOriginalPrice(item.product)?.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                ) : (
                  <p
                    className={`text-lg font-bold transition-colors duration-300 ${
                      themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {getProductPrice(item.product)?.toLocaleString("vi-VN")}đ
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                x{item.quantity}
              </span>
              <span
                className={`text-xl font-bold px-2 py-1 rounded transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "text-green-300  border-green-700"
                    : "text-green-700 border-green-300"
                }`}
              >
                {(
                  getProductPrice(item.product) * item.quantity
                )?.toLocaleString("vi-VN")}
                đ
              </span>
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
                (sum, item) =>
                  sum + getProductPrice(item.product) * item.quantity,
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
