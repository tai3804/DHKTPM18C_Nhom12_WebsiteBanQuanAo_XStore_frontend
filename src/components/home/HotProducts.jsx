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
        className={`p-6 w-full rounded-3xl transition-colors duration-300 ${
          themeMode === "dark" ? "bg-gray-800/60" : "bg-orange-50/60"
        }`}
      >
        <Link
          to="/hot"
          className="w-full flex flex-col justify-center items-center gap-1 py-8 hover:underline"
        >
          <h2 className="text-2xl text-red-500 font-semibold">Sản phẩm HOT</h2>
          <span className="text-base font-normal">Các sản phẩm bán chạy nhất trong cửa hàng</span>
        </Link>



        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {hotProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
