import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../slices/ProductSlice";
import ProductCard from "./ProductCard";

export default function ProductList() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="bg-gray-50 p-6 mx-25">
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6">
        {products.length != 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Không có sản phẩm nào để hiển thị.
          </div>
        )}
      </div>
    </div>
  );
}
