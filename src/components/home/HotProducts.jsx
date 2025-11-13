import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Flame } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function HotProducts({ products = [] }) {
  const themeMode = useSelector(selectThemeMode);
  // Lấy 8 sản phẩm đầu tiên
  const hotProducts = products.slice(0, 8);

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
          themeMode === "dark" ? "bg-gray-800/60" : "bg-orange-50/60"
        }`}
      >
        <div className="text-center mb-12 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 py-8 rounded-2xl shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="h-8 w-8 text-white animate-pulse" />
            <h2 className="text-3xl font-bold text-white">Sản Phẩm HOT 🔥</h2>
            <Flame className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-white/90 max-w-2xl mx-auto mb-6">
            Những sản phẩm được yêu thích nhất tại XStore
          </p>
          <Link
            to="/hot"
            className="inline-flex items-center gap-2 text-white hover:text-white/90 font-semibold hover:underline"
          >
            Xem tất cả sản phẩm HOT
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {hotProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
