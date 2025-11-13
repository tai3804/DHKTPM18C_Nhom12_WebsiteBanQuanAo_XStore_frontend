import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tag } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function SaleProducts({ products = [] }) {
  const themeMode = useSelector(selectThemeMode);
  // Lấy 8 sản phẩm đầu tiên
  const saleProducts = products.slice(0, 8);

  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section
      className={`container mx-auto px-4 py-16 transition-colors duration-300 ${
        themeMode === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div
        className={`p-6 rounded-3xl transition-colors duration-300 ${
          themeMode === "dark" ? "bg-gray-800/60" : "bg-green-50/60"
        }`}
      >
        <div className="text-center mb-12 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 py-8 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tag className="h-8 w-8 text-white" />
            <h2 className="text-3xl font-bold text-white">Sản Phẩm Sale 🏷️</h2>
            <Tag className="h-8 w-8 text-white" />
          </div>
          <p className="text-white/90 max-w-2xl mx-auto mb-6">
            Ưu đãi đặc biệt - Giảm giá khủng cho bạn
          </p>
          <Link
            to="/sale"
            className="inline-flex items-center gap-2 text-white hover:text-white/90 font-semibold hover:underline"
          >
            Xem tất cả sản phẩm Sale
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
