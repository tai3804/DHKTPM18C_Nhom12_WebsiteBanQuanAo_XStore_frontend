import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import ProductCard from "../components/product/ProductCard";
import { getFavouritesByUser } from "../slices/FavouriteSlice";

export default function FavouritePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { favourites } = useSelector((state) => state.favourite);
  const loading = useSelector((state) => state.loading.isLoading);

  // Load favourites khi component mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getFavouritesByUser(user.id));
    }
  }, [dispatch, user]);

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Danh sách yêu thích của bạn
          </h2>
          <p className="text-gray-700 mb-6">
            Vui lòng đăng nhập để xem sản phẩm yêu thích
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Đăng nhập ngay
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Nếu danh sách yêu thích rỗng
  if (!loading && favourites.length === 0) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Heart className="h-24 w-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Danh sách yêu thích trống
          </h2>
          <p className="text-gray-700 mb-6">
            Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và thêm sản phẩm
            yêu thích của bạn!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Khám phá sản phẩm
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500" fill="currentColor" />
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách yêu thích
            </h1>
          </div>
          <p className="text-gray-700">
            Bạn có {favourites.length} sản phẩm yêu thích
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-700">Đang tải...</p>
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
      <Footer />
    </div>
  );
}
