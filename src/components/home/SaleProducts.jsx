import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../product/ProductCard";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function SaleProducts({ products = [] }) {
  const themeMode = useSelector(selectThemeMode);

  // Lọc sản phẩm đang có sale (có productSales)
  const saleProducts = products
    .filter((product) => product.productSales != null)
    .slice(0, 8);

  console.log("Total products:", products.length);
  console.log("Sale products:", saleProducts.length);
  console.log("Sample sale product:", saleProducts[0]);

  if (
    !Array.isArray(products) ||
    products.length === 0 ||
    saleProducts.length === 0
  ) {
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
        <Link
          to="/sale"
          className="w-full flex flex-col justify-center items-center gap-1 py-8 hover:underline"
        >
          <h2 className="text-2xl text-green-600 font-semibold">Sản phẩm Sale</h2>
          <span className="text-base font-normal">Ưu đãi đặc biệt - Giảm giá khủng cho bạn</span>
        </Link>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
