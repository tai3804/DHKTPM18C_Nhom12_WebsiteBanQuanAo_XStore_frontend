import React, { useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { selectThemeMode } from "../../slices/ThemeSlice";
import ProductCard from "./ProductCard";

export default function RelatedProducts({ currentProduct }) {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const scrollRef = useRef(null);

  // Lấy tất cả sản phẩm từ Redux store (giống như ProductsPage)
  const allProducts = useSelector((state) => state.product.products) || [];

  // Tạo danh sách sản phẩm liên quan
  const relatedProducts = useMemo(() => {
    if (!allProducts.length || !currentProduct) return [];

    // Lọc sản phẩm liên quan: cùng loại hoặc cùng brand, loại trừ sản phẩm hiện tại
    const related = allProducts.filter((product) => {
      if (product.id === currentProduct.id) return false;

      // Ưu tiên sản phẩm cùng loại
      const sameType =
        product.type?.name === currentProduct.type?.name ||
        product.productType?.name === currentProduct.productType?.name;

      // Hoặc sản phẩm cùng brand (nếu có)
      const sameBrand = product.brand === currentProduct.brand;

      return sameType || sameBrand;
    });

    // Giới hạn 6 sản phẩm
    return related.slice(0, 6);
  }, [allProducts, currentProduct]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Không hiển thị nếu không có sản phẩm liên quan
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-lg p-6 shadow-sm ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDark ? "text-white" : "text-gray-800"
        }`}
      >
        Sản phẩm liên quan
      </h2>

      <div className="relative">
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all ${
            isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          title="Cuộn sang trái"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {relatedProducts.map((product) => (
            <div key={product.id} className="shrink-0 w-72">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg transition-all ${
            isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
          title="Cuộn sang phải"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
