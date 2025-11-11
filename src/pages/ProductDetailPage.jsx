import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import {
  getProductById,
  getProductStocks,
  getProductColors,
  getProductSizes,
} from "../slices/ProductSlice";
import { addToCart } from "../slices/CartSlice";
import { toggleFavourite, getFavouritesByUser } from "../slices/FavouriteSlice";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, productStocks, productColors, productSizes } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { favourites } = useSelector((state) => state.favourite);
  const loading = useSelector((state) => state.loading.isLoading);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getProductStocks(id));
      dispatch(getProductColors(id));
      dispatch(getProductSizes(id));
    }
  }, [dispatch, id]);

  // Load favourites and check if current product is favourite
  useEffect(() => {
    if (user?.id) {
      dispatch(getFavouritesByUser(user.id));
    }
  }, [dispatch, user]);

  // Check if product is in favourites
  useEffect(() => {
    if (favourites && product) {
      const found = favourites.some((fav) => fav.product?.id === product.id);
      setIsFavourite(found);
    }
  }, [favourites, product]);

  useEffect(() => {
    // Reset selections when product changes
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedStock(null);
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product]);

  useEffect(() => {
    // Auto-select first available stock when stocks are loaded
    if (productStocks?.length > 0) {
      const firstAvailableStock = productStocks.find(
        (stock) => stock.quantity > 0
      );
      setSelectedStock(firstAvailableStock || null);
    }
  }, [productStocks]);

  useEffect(() => {
    // Auto-select first color when colors are loaded
    if (productColors?.length > 0) {
      setSelectedColor(productColors[0]);
    }
  }, [productColors]);

  useEffect(() => {
    // Auto-select first size when sizes are loaded
    if (productSizes?.length > 0) {
      setSelectedSize(productSizes[0]);
    }
  }, [productSizes]);

  // Update main image when color changes
  useEffect(() => {
    if (selectedColor?.image) {
      setSelectedImage(0); // Reset to main image for new color
    }
  }, [selectedColor]);

  // Validate quantity when stock changes
  useEffect(() => {
    const maxQuantity = getAvailableQuantity();
    if (quantity > maxQuantity && maxQuantity > 0) {
      setQuantity(maxQuantity);
    }
  }, [selectedStock]);

  const handleAddToCart = async () => {
    // Prevent multiple calls
    if (isAddingToCart) return;

    // Check if user is logged in
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    // Check if stock is selected (only if product has stocks)
    if (productStocks?.length > 0 && !selectedStock) {
      toast.error("Vui lòng chọn kho!");
      return;
    }

    // Check if color is selected (only if product has colors)
    if (productColors?.length > 0 && !selectedColor) {
      toast.error("Vui lòng chọn màu sắc!");
      return;
    }

    // Check if size is selected (only if product has sizes)
    if (productSizes?.length > 0 && !selectedSize) {
      toast.error("Vui lòng chọn kích thước!");
      return;
    }

    // Check quantity validation
    if (quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0!");
      return;
    }

    const availableQuantity = getAvailableQuantity();
    if (availableQuantity === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    if (quantity > availableQuantity) {
      toast.error(`Chỉ còn lại ${availableQuantity} sản phẩm trong kho!`);
      return;
    }

    try {
      setIsAddingToCart(true);
      await dispatch(
        addToCart({
          cartId: cart?.id,
          productId: product.id,
          quantity: quantity,
        })
      ).unwrap();

      toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // Prevent multiple calls
    if (isBuying) return;

    // Same validations as add to cart
    if (!user) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }

    if (productStocks?.length > 0 && !selectedStock) {
      toast.error("Vui lòng chọn kho!");
      return;
    }

    if (quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0!");
      return;
    }

    const availableQuantity = getAvailableQuantity();
    if (availableQuantity === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    if (quantity > availableQuantity) {
      toast.error(`Chỉ còn lại ${availableQuantity} sản phẩm trong kho!`);
      return;
    }

    try {
      setIsBuying(true);
      // Add to cart first
      await dispatch(
        addToCart({
          cartId: cart?.id,
          productId: product.id,
          quantity: quantity,
        })
      ).unwrap();

      // Redirect to cart for checkout
      navigate("/cart");
    } catch (error) {
      console.error("Buy now error:", error);
      toast.error("Có lỗi xảy ra khi mua hàng!");
    } finally {
      setIsBuying(false);
    }
  };

  const getAvailableQuantity = () => {
    if (!selectedStock) return 0;
    return selectedStock.quantity;
  };

  const getTotalStock = () => {
    if (!productStocks?.length) return 0;
    return productStocks.reduce((total, stock) => total + stock.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    const maxQuantity = getAvailableQuantity();
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    setQuantity(validQuantity);
  };

  const handleToggleFavourite = async () => {
    if (!user) {
      if (
        window.confirm(
          "Vui lòng đăng nhập để thêm vào danh sách yêu thích. Chuyển đến trang đăng nhập?"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Không tìm thấy sản phẩm
            </h1>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const availableQuantity = getAvailableQuantity();
  const totalStock = getTotalStock();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm">
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-gray-700"
          >
            Trang chủ
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <button
            onClick={() => navigate("/products")}
            className="text-gray-500 hover:text-gray-700"
          >
            Sản phẩm
          </button>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            {/* Ảnh chính */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <img
                src={product.image || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">
                Danh mục:{" "}
                <span className="font-medium">
                  {product.productType?.name || product.type?.name}
                </span>
              </p>
            </div>

            {/* Giá */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
            </div>

            {/* Tổng số lượng trong kho */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Tổng kho:</span> {totalStock}{" "}
                sản phẩm
              </p>
            </div>

            {/* Chọn kho */}
            {productStocks?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Chọn kho:</h3>
                <div className="flex flex-wrap gap-2">
                  {productStocks.map((stock) => (
                    <button
                      key={stock.stockId}
                      onClick={() => setSelectedStock(stock)}
                      disabled={stock.quantity === 0}
                      className={`px-4 py-2 border rounded-lg font-medium ${
                        selectedStock?.stockId === stock.stockId
                          ? "bg-blue-500 text-white border-blue-500"
                          : stock.quantity === 0
                          ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{stock.stockName}</div>
                        <div className="text-xs">
                          {stock.quantity === 0
                            ? "Hết hàng"
                            : `${stock.quantity} còn lại`}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {selectedStock && (
                  <p className="text-sm font-medium mt-2 text-green-600">
                    Kho: {selectedStock.stockName} - Còn lại:{" "}
                    {availableQuantity} sản phẩm
                  </p>
                )}
              </div>
            )}

            {/* Chọn màu sắc */}
            {productColors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Chọn màu sắc:</h3>
                <div className="flex flex-wrap gap-3">
                  {productColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                        selectedColor?.id === color.id
                          ? "border-blue-500 scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: color.hexCode }}
                      title={color.name}
                    >
                      {selectedColor?.id === color.id && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm font-medium mt-2 text-gray-600">
                    Đã chọn: {selectedColor.name}
                  </p>
                )}
              </div>
            )}

            {/* Chọn kích thước */}
            {productSizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Chọn kích thước:</h3>
                <select
                  value={selectedSize?.id || ""}
                  onChange={(e) => {
                    const sizeId = parseInt(e.target.value);
                    const size = productSizes.find((s) => s.id === sizeId);
                    setSelectedSize(size || null);
                  }}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn kích thước --</option>
                  {productSizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                      {size.description && ` - ${size.description}`}
                    </option>
                  ))}
                </select>
                {selectedSize && (
                  <p className="text-sm font-medium mt-2 text-gray-600">
                    Đã chọn: {selectedSize.name}
                    {selectedSize.description &&
                      ` - ${selectedSize.description}`}
                  </p>
                )}
              </div>
            )}

            {/* Chọn số lượng */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Số lượng:</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    handleQuantityChange(val);
                  }}
                  min="1"
                  max={availableQuantity}
                  className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= availableQuantity}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">
                  / {availableQuantity} có sẵn
                </span>
              </div>
            </div>

            {/* Nút thêm vào giỏ hàng và mua ngay */}
            <div className="space-y-3">
              {/* Favourite Button */}
              <button
                onClick={handleToggleFavourite}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isFavourite
                    ? "bg-red-50 text-red-600 border-2 border-red-500 hover:bg-red-100"
                    : "bg-gray-50 text-gray-700 border-2 border-gray-300 hover:bg-gray-100"
                }`}
              >
                <Heart
                  className="h-5 w-5"
                  fill={isFavourite ? "currentColor" : "none"}
                />
                {isFavourite ? "Đã yêu thích" : "Thêm vào yêu thích"}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={
                  (productStocks?.length > 0 && !selectedStock) ||
                  availableQuantity === 0 ||
                  isAddingToCart
                }
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isAddingToCart
                  ? "Đang thêm..."
                  : availableQuantity === 0
                  ? "Hết hàng"
                  : "Thêm vào giỏ hàng"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={
                  (productStocks?.length > 0 && !selectedStock) ||
                  availableQuantity === 0 ||
                  isBuying
                }
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isBuying
                  ? "Đang mua..."
                  : availableQuantity === 0
                  ? "Hết hàng"
                  : "Mua ngay"}
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        {product.description && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
            <div className="text-gray-700 leading-relaxed">
              {showFullDescription ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.description.substring(0, 300) + "...",
                    }}
                  />
                  {product.description.length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-blue-500 hover:text-blue-600 font-medium mt-2"
                    >
                      Xem thêm
                    </button>
                  )}
                </div>
              )}

              {showFullDescription && product.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(false)}
                  className="text-blue-500 hover:text-blue-600 font-medium mt-2"
                >
                  Thu gọn
                </button>
              )}
            </div>
          </div>
        )}

        {/* Thông tin chi tiết */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Thông tin chi tiết</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Mã sản phẩm:</span> #
                {product.id}
              </p>
              <p>
                <span className="font-semibold">Danh mục:</span>{" "}
                {product.productType?.name}
              </p>
              <p>
                <span className="font-semibold">Thương hiệu:</span> XStore
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Tình trạng:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    getAvailableQuantity() > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {getAvailableQuantity() > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
              </p>
              <p>
                <span className="font-semibold">Kho có sẵn:</span>
                {productStocks?.length > 0
                  ? productStocks.map((stock) => stock.stockName).join(", ")
                  : "Không có"}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Thông tin chi tiết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Danh mục:</span>
              <span className="text-gray-800">
                {product.productType?.name || product.type?.name}
              </span>
            </div>
            {productStocks?.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">
                  Các kho có sẵn:
                </span>
                <span className="text-gray-800">
                  {productStocks.map((stock) => stock.stockName).join(", ")}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Tổng số lượng:</span>
              <span className="text-gray-800">{totalStock} sản phẩm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="font-medium text-gray-600">Trạng thái:</span>
              <span
                className={`font-medium ${
                  totalStock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalStock > 0 ? "Còn hàng" : "Hết hàng"}
              </span>
            </div>
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Sản phẩm liên quan
          </h2>
          <div className="text-center py-8">
            <p className="text-gray-500">Đang cập nhật...</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
