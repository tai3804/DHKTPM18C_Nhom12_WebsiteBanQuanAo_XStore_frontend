import { Edit3, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { getImageUrl } from "../../utils/imageUrl";

export default function ProductItem({ product, onEdit, onDelete }) {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div
      className={`
        group rounded-2xl border overflow-hidden
        transition-all duration-300 ease-in-out
        hover:shadow-lg ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700 hover:border-gray-600"
            : "bg-white border-gray-200 hover:border-gray-300"
        }
      `}
    >
      {/* Header with Image and Actions */}
      <div className="flex gap-6 p-6">
        {/* Product Image */}
        <div
          className={`w-40 h-40 rounded-xl overflow-hidden shrink-0 ${
            themeMode === "dark" ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <img
            src={
              product.image
                ? getImageUrl(product.image)
                : "https://via.placeholder.com/150x150?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          {/* Product Name */}
          <h3
            className={`text-lg font-bold mb-2 truncate transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p
            className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {product.description || "Không có mô tả"}
          </p>

          {/* Info Labels Row */}
          <div
            className={`grid grid-cols-5 gap-8 mb-2 pb-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {product.brand && (
              <p className="font-medium text-xs">Thương hiệu</p>
            )}
            {product.type?.name && <p className="font-medium text-xs">Loại</p>}
            {product.fabric && <p className="font-medium text-xs">Chất liệu</p>}
            {product.colors && product.colors.length > 0 && (
              <p className="font-medium text-xs">Màu sắc</p>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <p className="font-medium text-xs">Kích cỡ</p>
            )}
          </div>

          {/* Info Values Row */}
          <div
            className={`grid grid-cols-5 gap-8 pb-4 border-b transition-colors duration-300 ${
              themeMode === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {/* Brand */}
            {product.brand && (
              <p
                className={`text-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {product.brand}
              </p>
            )}

            {/* Type */}
            {product.type?.name && (
              <p
                className={`text-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {product.type.name}
              </p>
            )}

            {/* Fabric */}
            {product.fabric && (
              <p
                className={`text-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {product.fabric}
              </p>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-2 items-center">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: color.hexCode }}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span
                    className={`text-xs font-semibold ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex gap-1 flex-wrap items-center">
                {product.sizes.slice(0, 3).map((size, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                    title={size.description}
                  >
                    {size.name}
                  </span>
                ))}
                {product.sizes.length > 3 && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 ${
                      themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    +{product.sizes.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={`p-3 rounded-lg transition-all duration-300 cursor-pointer ${
              themeMode === "dark"
                ? "bg-blue-900/50 hover:bg-blue-900 text-blue-300 hover:text-blue-200"
                : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
            }`}
            title="Chỉnh sửa sản phẩm"
          >
            <Edit3 size={20} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`p-3 rounded-lg transition-all duration-300 cursor-pointer ${
              themeMode === "dark"
                ? "bg-red-900/50 hover:bg-red-900 text-red-300 hover:text-red-200"
                : "bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
            }`}
            title="Xóa sản phẩm"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Footer with Price */}
      <div
        className={`px-6 py-4 border-t border-b transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-600"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <div className="flex items-end justify-between">
          <div>
            <p
              className={`text-xs font-medium mb-1 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Giá bán
            </p>
            <p
              className={`text-2xl font-bold transition-colors duration-300 ${
                themeMode === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {product.price?.toLocaleString()}₫
            </p>
          </div>
          <div
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors duration-300 ${
              product.priceInStock > 0
                ? themeMode === "dark"
                  ? "bg-green-900/30 text-green-300"
                  : "bg-green-100 text-green-700"
                : themeMode === "dark"
                ? "bg-red-900/30 text-red-300"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.priceInStock > 0 ? "Còn hàng" : "Hết hàng"}
          </div>
        </div>
      </div>
    </div>
  );
}
