import React from "react";
import ProductCard from "../product/ProductCard";

// Component giả lập cho ProductGrid
const ProductGrid = ({ products }) => (
  <section className="container mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4 text-gray-900">
        Sản Phẩm Nổi Bật
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Khám phá những sản phẩm được yêu thích nhất tuần này
      </p>
    </div>

    {products.length === 0 ? (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-500">Đang tải sản phẩm...</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )}
  </section>
);

export default function FeaturedProducts({
  products = [], // ✅ Default value để tránh undefined
  onAddToCart,
  onToggleFavorite,
  onProductClick,
}) {
  // Debug logs
  console.log("FeaturedProducts - received products:", products);
  console.log("FeaturedProducts - products length:", products.length);
  console.log("FeaturedProducts - is array?", Array.isArray(products));

  // ✅ Kiểm tra products có tồn tại và là array
  if (!Array.isArray(products)) {
    console.warn("FeaturedProducts - products is not array:", typeof products);
    return null;
  }

  // Lấy một số sản phẩm để hiển thị (ví dụ 8 sản phẩm đầu)
  const featured = products.slice(0, 8);
  console.log("FeaturedProducts - featured products:", featured);

  return (
    <ProductGrid
      products={featured}
      onAddToCart={onAddToCart}
      onToggleFavorite={onToggleFavorite}
      onProductClick={onProductClick}
    />
  );
}
