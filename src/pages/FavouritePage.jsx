import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductCard from "../components/product/ProductCard";
import { getFavouritesByUser } from "../slices/FavouriteSlice";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function FavouritePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { favourites } = useSelector((state) => state.favourite);
  const loading = useSelector((state) => state.loading.isLoading);
  const themeMode = useSelector(selectThemeMode);

  // Load favourites khi component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getFavouritesByUser(user.id));
    }
  }, [dispatch, user]);

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart
            className={`h-24 w-24 mx-auto mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Danh sách yêu thích của bạn
          </h2>
          <p
            className={`mb-6 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Vui lòng đăng nhập để xem sản phẩm yêu thích
          </p>
          <button
            onClick={() => navigate("/login")}
            className={`text-white px-6 py-3 rounded-lg transition shadow-sm ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // Nếu danh sách yêu thích rỗng
  if (!loading && favourites.length === 0) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart
            className={`h-24 w-24 mx-auto mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Danh sách yêu thích trống
          </h2>
          <p
            className={`mb-6 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và thêm sản phẩm
            yêu thích của bạn!
          </p>
          <button
            onClick={() => navigate("/products")}
            className={`text-white px-6 py-3 rounded-lg transition shadow-sm ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-linear-to-b from-white to-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
            <h1
              className={`text-3xl font-bold transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Danh sách yêu thích
            </h1>
          </div>
          <p
            className={`transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Bạn có {favourites.length} sản phẩm yêu thích
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p
              className={`mt-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Đang tải...
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((favourite) => {
              const product = favourite.product;
              if (!product) return null;

              return (
                <ProductCard
                  key={`${favourite.favouriteID.userId}-${favourite.favouriteID.productId}`}
                  product={product}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
