import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { addToCart, createCart } from "../../slices/CartSlice";
import {
  toggleFavourite,
  getFavouritesByUser,
} from "../../slices/FavouriteSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { toast } from "react-toastify";
import CartToast from "../common/CartToast";
import { getImageUrl } from "../../utils/imageUrl";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { favourites } = useSelector((state) => state.favourite);
  const { selectedStock } = useSelector((state) => state.stock);
  const loading = useSelector((state) => state.loading.isLoading);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    if (favourites && product) {
      const found = favourites.some((fav) => fav.product?.id === product.id);
      setIsFavourite(found);
    }
  }, [favourites, product]);

  // Load favourites khi user đăng nhập
  useEffect(() => {
    if (user?.id && (!favourites || favourites.length === 0)) {
      dispatch(getFavouritesByUser(user.id));
    }
  }, [user, dispatch]);

  // Tính % giảm giá
  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };

  // ✅ Xử lý thêm vào giỏ hàng - TẠO CART NẾU CHƯA CÓ
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // Kiểm tra đăng nhập
    if (!user) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    setIsAdding(true);

    try {
      let currentCart = cart;

      // ✅ Nếu chưa có cart, tạo mới
      if (!currentCart?.id) {
        const createResult = await dispatch(createCart(user.id));

        if (createResult.error) {
          toast.error("Không thể tạo giỏ hàng");
          setIsAdding(false);
          return;
        }

        currentCart = createResult.payload;
      }

      // ✅ Thêm sản phẩm vào cart
      const cartId = currentCart.id;
      const productId = product.id;
      const stockId = selectedStock?.id || 1; // Use selected stock from header

      if (cartId && productId) {
        const result = await dispatch(
          addToCart({
            cartId,
            productId,
            quantity: 1,
            stockId,
          })
        );

        if (!result.error) {
          // Hiển thị thông báo thành công với custom component
          toast.success(<CartToast product={product} />, {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: false, // Tắt icon mặc định vì đã có trong component
          });
        } else {
          toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        }
      } else {
        toast.error("Lỗi xác định giỏ hàng hoặc sản phẩm");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  // Xử lý yêu thích
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    // Kiểm tra đăng nhập
    if (!user) {
      if (
        window.confirm(
          "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích. Chuyển đến trang đăng nhập?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    try {
      await dispatch(
        toggleFavourite({
          userId: user.id,
          productId: product.id,
        })
      );
    } catch (error) {
      console.error("Toggle favourite error:", error);
    }
  };

  // Xử lý click vào sản phẩm
  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const discount = calculateDiscount();

  return (
    <div
      className={`relative group rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${
        themeMode === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        </div>
      )}

      {/* Favourite Icon */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md hover:shadow-lg transition-all ${
          themeMode === "dark"
            ? "bg-gray-700 text-gray-400"
            : "bg-white text-gray-400"
        } ${isFavourite ? "text-red-500" : "hover:text-red-500"}`}
        title={isFavourite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart
          className="h-5 w-5"
          fill={isFavourite ? "currentColor" : "none"}
        />
      </button>

      {/* Product Image */}
      <div
        onClick={handleProductClick}
        className={`relative aspect-square overflow-hidden ${
          themeMode === "dark" ? "bg-gray-700" : "bg-gray-50"
        }`}
      >
        <img
          src={
            product.image
              ? getImageUrl(product.image)
              : "https://via.placeholder.com/400"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Add to Cart Button - Hiện khi hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            isHovered
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full text-white py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              themeMode === "dark"
                ? "bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600"
                : "bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600"
            }`}
          >
            <ShoppingCart
              className={`h-5 w-5 ${isAdding ? "animate-bounce" : ""}`}
            />
            {isAdding ? "Đang thêm..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4" onClick={handleProductClick}>
        {/* Category */}
        {product.type?.name && (
          <p
            className={`text-xs mb-1 uppercase tracking-wide transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {product.type.name}
          </p>
        )}

        {/* Product Name */}
        <h3
          className={`font-semibold mb-2 line-clamp-2 min-h-12 transition-colors duration-300 ${
            themeMode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {product.name}
        </h3>

        {/* Rating - Mock data */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[1, 2, 3, 4].map((star) => (
              <svg
                key={star}
                className="w-4 h-4 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <svg
              className={`w-4 h-4 fill-current ${
                themeMode === "dark" ? "text-gray-600" : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </div>
          <span
            className={`text-xs transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            (124)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            ${product.price?.toLocaleString("vi-VN")}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span
              className={`text-sm line-through transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              ${product.originalPrice?.toLocaleString("vi-VN")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
