import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RelatedProducts() {
  const { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Tìm sản phẩm hiện tại theo id từ products
  const currentProduct = useMemo(() => {
    return products?.find((p) => p.id === Number(id)) || null;
  }, [products, id]);

  // Lấy sản phẩm liên quan: 5 cùng type, 5 cùng brand
  const relatedProducts = useMemo(() => {
    if (!currentProduct || !products) return [];

    const relatedByType = products
      .filter(
        (p) =>
          p.type?.id === currentProduct.type?.id && p.id !== currentProduct.id
      )
      .slice(0, 5);

    const relatedByBrand = products
      .filter(
        (p) =>
          p.brand?.id === currentProduct.brand?.id &&
          p.id !== currentProduct.id &&
          !relatedByType.some((rp) => rp.id === p.id)
      )
      .slice(0, 5);

    return [...relatedByType, ...relatedByBrand];
  }, [products, currentProduct]);

  const productsPerSlide = 3;
  const totalSlides = Math.ceil(relatedProducts.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-play carousel
  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentSlide, totalSlides, isHovered]);

  if (relatedProducts.length === 0) return null;

  const displayedProducts = relatedProducts.slice(
    currentSlide * productsPerSlide,
    (currentSlide + 1) * productsPerSlide
  );

  return (
    <div
      className={`rounded-lg p-6 shadow-sm mt-8 ${
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
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div
              key={slideIndex}
              className="shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {relatedProducts
                .slice(
                  slideIndex * productsPerSlide,
                  (slideIndex + 1) * productsPerSlide
                )
                .map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
            </div>
          ))}
        </div>
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full shadow-md transition-colors ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
