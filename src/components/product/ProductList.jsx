import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  // ✅ Kiểm tra products có phải là array không
  if (!Array.isArray(products)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Không có sản phẩm nào
        </p>
      </div>
    );
  }

  // ✅ Kiểm tra products có rỗng không
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Không tìm thấy sản phẩm nào
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
