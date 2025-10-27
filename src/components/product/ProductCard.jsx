import { setProducts } from "../../slices/ProductSlice";

export default function ProductCard({ product }) {
  //Hàm xử lý yêu thích (cần tạo FavouriteSlice và thunk)
  const handleToggleFavorite = (productId) => {
    console.log("Toggling favorite:", productId);
    // Cập nhật state tạm thời
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
    // dispatch(toggleFavoriteThunk(productId));
  };

  //Hàm xử lý khi click vào sản phẩm (điều hướng đến trang chi tiết)
  const handleProductClick = (product) => {
    console.log("Navigating to product:", product);
    // navigate(`/products/${product.id}`); // Điều hướng đến trang chi tiết
  };

  //Hàm xử lý thêm vào giỏ hàng (cần tạo CartSlice và thunk)
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    // dispatch(addToCartThunk(product));
    alert(`${product.name} đã được thêm vào giỏ!`); // tạm thời
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
        {/* Thay bằng ảnh sản phẩm */}
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
      </div>
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="text-gray-600">
        {product.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => handleAddToCart(product)}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          Thêm
        </button>
        <button
          onClick={() => handleToggleFavorite(product.id)}
          className="text-xs border px-2 py-1 rounded"
        >
          {product.isFavorite ? "❤️" : "🤍"}
        </button>
        <button
          onClick={() => handleProductClick(product)}
          className="text-xs border px-2 py-1 rounded"
        >
          Xem
        </button>
      </div>
    </div>
  );
}
