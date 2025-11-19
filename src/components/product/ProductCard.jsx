import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Zap, X } from "lucide-react";
import { addToCart, createCart } from "../../slices/CartSlice";
import {
  toggleFavouriteInstant,
  getFavouritesByUser,
} from "../../slices/FavouriteSlice";
import { getProductStocks } from "../../slices/StockSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { toast } from "react-toastify";
import CartToast from "../common/CartToast";
import { getImageUrl } from "../../utils/imageUrl";
import { API_BASE_URL } from "../../config/api";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { favourites } = useSelector((state) => state.favourite);
  const { selectedStock } = useSelector((state) => state.stock);
  const { productStocks } = useSelector((state) => state.stock);
  const { productSales } = useSelector((state) => state.productSales);
  const loading = useSelector((state) => state.loading.isLoading);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [actionType, setActionType] = useState(""); // "addToCart" or "buyNow"
  const [variantStock, setVariantStock] = useState({}); // Lưu stock cho từng variant
  const [totalQuantities, setTotalQuantities] = useState({}); // Total quantities from all stocks
  const [selectedStockQuantities, setSelectedStockQuantities] = useState({}); // Quantities from selected stock

  console.log(
    "ProductCard render - selectedStock:",
    selectedStock,
    "variantStock:",
    variantStock,
    "productStocks:",
    productStocks
  );

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    if (favourites && product) {
      const found = favourites.some((fav) => fav.product?.id === product.id);
      setIsFavourite(found);
    }
  }, [favourites, product]);

  // Fetch stock information khi component mount hoặc product thay đổi
  useEffect(() => {
    if (product?.id) {
      console.log("Fetching total stock for product:", product.id);
      fetchTotalQuantities();
    }
    if (product?.id && selectedStock?.id) {
      fetchSelectedStockQuantities();
    }
  }, [product?.id, selectedStock?.id, dispatch]);

  // Cập nhật variant stock khi productStocks thay đổi
  useEffect(() => {
    if (productStocks && productStocks.length > 0 && selectedStock) {
      const stockMap = {};
      productStocks.forEach((stockItem) => {
        if (stockItem.stockId === selectedStock.id) {
          // Giả sử stockItem có productInfoId và quantity
          stockMap[stockItem.productInfoId] = stockItem.quantity || 0;
        }
      });
      console.log("Updated variant stock:", stockMap);
      setVariantStock(stockMap);
    } else if (!selectedStock) {
      // Nếu chưa chọn stock, cho phép tất cả variant
      setVariantStock({});
    }
  }, [productStocks, selectedStock]);

  const fetchTotalQuantities = async () => {
    if (!product?.id) return;

    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/stocks/products/${product.id}/total-quantities`,
        {
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTotalQuantities(data.result || {});
        console.log("Fetched total stock quantities:", data.result);
      }
    } catch (error) {
      console.error("Error fetching total stock quantities:", error);
    }
  };

  const fetchSelectedStockQuantities = async () => {
    if (!selectedStock?.id || !product?.id) return;

    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_BASE_URL}/api/stocks/${selectedStock.id}/items`,
        {
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const quantities = {};
        (data.result || []).forEach((product) => {
          (product.variants || []).forEach((variant) => {
            if (variant.id) {
              quantities[variant.id] = variant.quantity;
            }
          });
        });
        setSelectedStockQuantities(quantities);
        console.log("Fetched selected stock quantities:", quantities);
      }
    } catch (error) {
      console.error("Error fetching selected stock quantities:", error);
    }
  };

  // Tính % giảm giá
  const calculateDiscount = () => {
    if (productSales && productSales.length > 0) {
      const sale = productSales.find((ps) => ps.product?.id === product.id);
      return sale ? sale.discountPercent : 0;
    }
    return 0;
  };

  // Lấy thông tin sale cho sản phẩm này
  const getProductSale = () => {
    if (productSales && productSales.length > 0) {
      return productSales.find((ps) => ps.product?.id === product.id);
    }
    return null;
  };

  // ✅ Xử lý thêm vào giỏ hàng - TẠO CART NẾU CHƯA CÓ (DEPRECATED - now uses modal)
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // Kiểm tra đăng nhập
    if (!user) {
      toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!", {
        autoClose: 2000,
      });
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    // Kiểm tra đã chọn kho hàng
    if (!selectedStock) {
      toast.error(
        "Vui lòng chọn khu vực giao hàng trước khi thêm vào giỏ hàng!",
        {
          autoClose: 3000,
        }
      );
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
      const stockId = selectedStock?.id || 2; // Use selected stock from header, default to TP.HCM

      // Lấy color và size mặc định từ productInfos
      const defaultInfo = product.productInfos?.[0];
      const productInfoId = defaultInfo?.id;

      if (cartId && productId) {
        const result = await dispatch(
          addToCart({
            cartId,
            productId,
            quantity: 1,
            stockId,
            productInfoId,
          })
        );

        if (!result.error) {
          // Hiển thị thông báo thành công với custom component
          toast.success(<CartToast product={product} />, {
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
        toggleFavouriteInstant({
          userId: user.id,
          productId: product.id,
        })
      );
    } catch (error) {
      console.error("Toggle favourite error:", error);
    }
  };

  // Xử lý mua ngay
  const handleBuyNow = async (e) => {
    e.stopPropagation();
    setActionType("buyNow");
    setShowVariantModal(true);
  };

  // Xử lý xác nhận variant và thực hiện action
  const handleConfirmVariant = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Vui lòng chọn size và màu sắc!");
      return;
    }

    // Kiểm tra stock availability trong kho đã chọn
    if (selectedStock && Object.keys(selectedStockQuantities).length > 0) {
      const stockQuantity = getSelectedStockQuantity(
        selectedSize,
        selectedColor
      );
      if (stockQuantity <= 0) {
        toast.error("Variant này đã hết hàng trong khu vực đã chọn!");
        return;
      }
    }

    // Kiểm tra đăng nhập
    if (!user) {
      toast.info("Vui lòng đăng nhập!", {
        autoClose: 2000,
      });
      setTimeout(() => navigate("/login"), 500);
      setShowVariantModal(false);
      return;
    }

    // Kiểm tra đã chọn kho hàng
    if (!selectedStock) {
      toast.error("Vui lòng chọn khu vực giao hàng!", {
        autoClose: 3000,
      });
      setShowVariantModal(false);
      return;
    }

    // Tìm productInfo phù hợp
    const selectedProductInfo = product.productInfos?.find(
      (info) =>
        info.sizeName === selectedSize && info.colorName === selectedColor
    );

    if (!selectedProductInfo) {
      toast.error("Không tìm thấy variant phù hợp!");
      return;
    }

    setIsAdding(true);
    setShowVariantModal(false);

    try {
      if (actionType === "addToCart") {
        // Logic thêm vào giỏ hàng
        let currentCart = cart;

        if (!currentCart?.id) {
          const createResult = await dispatch(createCart(user.id));
          if (createResult.error) {
            toast.error("Không thể tạo giỏ hàng");
            setIsAdding(false);
            return;
          }
          currentCart = createResult.payload;
        }

        const result = await dispatch(
          addToCart({
            cartId: currentCart.id,
            productId: product.id,
            quantity: 1,
            stockId: selectedStock?.id || 2,
            productInfoId: selectedProductInfo.id,
          })
        );

        if (!result.error) {
          toast.success(<CartToast product={product} />, {
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: false,
          });
        } else {
          toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        }
      } else if (actionType === "buyNow") {
        // Logic mua ngay - chuyển đến trang thanh toán
        let currentCart = cart;

        if (!currentCart?.id) {
          const createResult = await dispatch(createCart(user.id));
          if (createResult.error) {
            toast.error("Không thể tạo giỏ hàng");
            setIsAdding(false);
            return;
          }
          currentCart = createResult.payload;
        }

        // Thêm sản phẩm vào cart
        await dispatch(
          addToCart({
            cartId: currentCart.id,
            productId: product.id,
            quantity: 1,
            stockId: selectedStock?.id || 2,
            productInfoId: selectedProductInfo.id,
          })
        );

        // Chuyển đến trang thanh toán
        navigate("/checkout");
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsAdding(false);
    }
  };

  // Xử lý click vào sản phẩm
  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  // Tính rating trung bình và tổng số đánh giá
  const calculateRating = () => {
    if (!product.comments || product.comments.length === 0) {
      return { average: 0, total: 0 };
    }

    const totalComments = product.comments.length;
    const totalRating = product.comments.reduce(
      (sum, comment) => sum + (comment.rate || 0),
      0
    );
    const average = totalComments > 0 ? totalRating / totalComments : 0;

    return { average, total: totalComments };
  };

  const { average: averageRating, total: totalComments } = calculateRating();

  // Lấy stock quantity cho một variant cụ thể (tổng từ tất cả kho)
  const getVariantStock = (sizeName, colorName) => {
    // Tìm productInfo phù hợp
    const selectedProductInfo = product.productInfos?.find(
      (info) => info.sizeName === sizeName && info.colorName === colorName
    );
    if (
      selectedProductInfo &&
      totalQuantities[selectedProductInfo.id] !== undefined
    ) {
      return totalQuantities[selectedProductInfo.id] || 0;
    }
    // Nếu không có data, hiển thị 0
    return 0;
  };

  // Lấy stock quantity từ kho đã chọn
  const getSelectedStockQuantity = (sizeName, colorName) => {
    // Tìm productInfo phù hợp
    const selectedProductInfo = product.productInfos?.find(
      (info) => info.sizeName === sizeName && info.colorName === colorName
    );
    if (
      selectedProductInfo &&
      selectedStockQuantities[selectedProductInfo.id] !== undefined
    ) {
      return selectedStockQuantities[selectedProductInfo.id] || 0;
    }
    // Nếu không có data, hiển thị 0
    return 0;
  };

  // Kiểm tra variant có còn stock không (dùng theo kho đã chọn nếu có, ngược lại dùng tổng)
  const isVariantAvailable = (sizeName, colorName) => {
    if (selectedStock) {
      const stock = getSelectedStockQuantity(sizeName, colorName);
      return stock > 0;
    } else {
      const stock = getVariantStock(sizeName, colorName);
      return stock > 0;
    }
  };

  const discount = calculateDiscount();
  const productSale = getProductSale();

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
            onClick={(e) => {
              e.stopPropagation();
              setActionType("addToCart");
              setShowVariantModal(true);
            }}
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
            {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
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

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(averageRating)
                    ? "text-yellow-400 fill-current"
                    : star === Math.ceil(averageRating) &&
                      averageRating % 1 !== 0
                    ? "text-yellow-400 fill-current opacity-50"
                    : themeMode === "dark"
                    ? "text-gray-300 fill-current"
                    : "text-gray-200 fill-current"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span
            className={`text-xs transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            ({totalComments})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                themeMode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {productSale
                ? productSale.discountedPrice?.toLocaleString("vi-VN")
                : product.price?.toLocaleString("vi-VN")}
              đ
            </span>
            {productSale ? (
              <span
                className={`text-sm line-through transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {productSale.originalPrice?.toLocaleString("vi-VN")}đ
              </span>
            ) : null}
          </div>

          {/* Buy Now Button - Chỉ hiển thị khi hover */}
          <div
            className={`transition-all duration-300 ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <button
              onClick={handleBuyNow}
              disabled={isAdding}
              className={`py-2 px-3 font-medium text-sm rounded transition-colors ${
                themeMode === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white"
                  : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white"
              }`}
            >
              {isAdding ? "..." : "Mua ngay"}
            </button>
          </div>
        </div>
      </div>

      {/* Variant Selection Modal */}
      {showVariantModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowVariantModal(false)}
        >
          <div
            className={`relative max-w-lg w-full mx-4 rounded-2xl shadow-2xl border ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3
                className={`text-xl font-bold ${
                  themeMode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Chọn thông tin
              </h3>
              <button
                onClick={() => setShowVariantModal(false)}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Product Info */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl">
                <img
                  src={
                    product.image
                      ? getImageUrl(product.image)
                      : "https://via.placeholder.com/400"
                  }
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4
                    className={`font-semibold text-lg mb-1 ${
                      themeMode === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {product.name}
                  </h4>
                  <p
                    className={`text-base font-medium mb-2 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {productSale
                      ? productSale.discountedPrice?.toLocaleString("vi-VN")
                      : product.price?.toLocaleString("vi-VN")}
                    đ
                  </p>
                  {selectedColor && selectedSize && (
                    <div className="mt-2">
                      <p
                        className={`text-sm font-medium ${
                          themeMode === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        Còn lại:{" "}
                        {getSelectedStockQuantity(selectedSize, selectedColor)}{" "}
                        sản phẩm
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Color Selection */}
              <div className="mb-6">
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    ...new Set(
                      product.productInfos?.map((info) => info.colorName)
                    ),
                  ].map((color) => {
                    const availableSizes = product.productInfos
                      ?.filter((info) => info.colorName === color)
                      .filter((info) =>
                        isVariantAvailable(info.sizeName, color)
                      );
                    const isColorAvailable = availableSizes.length > 0;

                    return (
                      <button
                        key={color}
                        onClick={() =>
                          isColorAvailable &&
                          setSelectedColor(
                            selectedColor === color ? null : color
                          )
                        }
                        disabled={!isColorAvailable}
                        className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                          !isColorAvailable
                            ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100 dark:bg-gray-600"
                            : selectedColor === color
                            ? themeMode === "dark"
                              ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105"
                              : "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105"
                            : themeMode === "dark"
                            ? "border-gray-600 text-gray-300 hover:border-gray-500 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {color}
                        {!isColorAvailable && (
                          <span className="absolute -top-1 -right-1 text-xs text-red-500 font-bold">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>{" "}
              {/* Size Selection */}
              <div className="mb-8">
                <label
                  className={`block text-sm font-semibold mb-3 ${
                    themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Size
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    ...new Set(
                      product.productInfos?.map((info) => info.sizeName)
                    ),
                  ].map((size) => {
                    const availableColors = product.productInfos
                      ?.filter((info) => info.sizeName === size)
                      .filter((info) =>
                        isVariantAvailable(size, info.colorName)
                      );
                    const isSizeAvailable = availableColors.length > 0;

                    return (
                      <button
                        key={size}
                        onClick={() =>
                          isSizeAvailable &&
                          setSelectedSize(selectedSize === size ? null : size)
                        }
                        disabled={!isSizeAvailable}
                        className={`px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                          !isSizeAvailable
                            ? "opacity-50 cursor-not-allowed border-gray-300 text-gray-400 bg-gray-100 dark:bg-gray-600"
                            : selectedSize === size
                            ? themeMode === "dark"
                              ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105"
                              : "border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105"
                            : themeMode === "dark"
                            ? "border-gray-600 text-gray-300 hover:border-gray-500 bg-gray-700 hover:bg-gray-600"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {size}
                        {!isSizeAvailable && (
                          <span className="absolute -top-1 -right-1 text-xs text-red-500 font-bold">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowVariantModal(false)}
                  className={`flex-1 py-3 px-6 border-2 rounded-lg font-semibold transition-all duration-200 ${
                    themeMode === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmVariant}
                  disabled={isAdding || !selectedSize || !selectedColor}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    themeMode === "dark"
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isAdding
                    ? "Đang xử lý..."
                    : actionType === "buyNow"
                    ? "Mua ngay"
                    : "Thêm vào giỏ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
