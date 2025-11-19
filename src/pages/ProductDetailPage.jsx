import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";
import { getProductById } from "../slices/ProductSlice";
import { addToCart, createCart } from "../slices/CartSlice";
import {
  toggleFavouriteInstant as toggleFavourite,
  getFavouritesByUser,
} from "../slices/FavouriteSlice";
import { selectThemeMode } from "../slices/ThemeSlice";
import ProductImageSection from "../components/product/ProductImageSection";
import ProductPriceInfo from "../components/product/ProductPriceInfo";
import ProductColorSelector from "../components/product/ProductColorSelector";
import ProductSizeSelector from "../components/product/ProductSizeSelector";
import ProductQuantitySelector from "../components/product/ProductQuantitySelector";
import ProductActionButtons from "../components/product/ProductActionButtons";
import ProductDetails from "../components/product/ProductDetails";
import ProductComments from "../components/product/ProductComments";
import ProductCard from "../components/product/ProductCard";
import RelatedProducts from "../components/product/RelatedProducts";
import { getCommentsByProductId } from "../slices/CommentSlice";
import { API_BASE_URL } from "../config/api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { favourites } = useSelector((state) => state.favourite);
  const { commentsByProduct } = useSelector((state) => state.comment);
  const loading = useSelector((state) => state.loading.isLoading);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const { selectedStock } = useSelector((state) => state.stock);

  const infos = product?.productInfos || [];
  const colors = useMemo(
    () => [...new Set(infos.map((i) => i.colorName).filter(Boolean))],
    [infos]
  );
  const sizes = useMemo(
    () => [...new Set(infos.map((i) => i.sizeName).filter(Boolean))],
    [infos]
  );
  const comments = useMemo(
    () => commentsByProduct[id] || [],
    [commentsByProduct, id]
  );

  const calculateRating = (comments) => {
    if (!comments || comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rate,
      0
    );
    return totalRating / comments.length;
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [stockQuantities, setStockQuantities] = useState({});
  const [selectedStockQuantities, setSelectedStockQuantities] = useState({});
  const [isFavourite, setIsFavourite] = useState(false);

  // selected variant info
  const selectedInfo = useMemo(() => {
    return infos.find((inf) => {
      if (selectedColor && selectedSize)
        return inf.colorName === selectedColor && inf.sizeName === selectedSize;
      if (selectedColor) return inf.colorName === selectedColor;
      if (selectedSize) return inf.sizeName === selectedSize;
      return false;
    });
  }, [infos, selectedColor, selectedSize]);

  // Available quantity: hiển thị số lượng tổng từ tất cả kho
  const availableQuantity = useMemo(() => {
    if (selectedInfo) {
      return stockQuantities[selectedInfo.id] || 0;
    }
    return 0;
  }, [selectedInfo, stockQuantities]);

  // Available in selected stock
  const availableInSelectedStock = useMemo(() => {
    if (selectedInfo && selectedStock) {
      return selectedStockQuantities[selectedInfo.id] || 0;
    }
    return 0;
  }, [selectedInfo, selectedStock, selectedStockQuantities]);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(getCommentsByProductId(id));
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
      setSelectedColor(null);
      setSelectedSize(null);
    }
  }, [product]);

  useEffect(() => {
    // Auto-select first color when colors are loaded
    if (colors?.length > 0) {
      setSelectedColor(colors[0]);
    }
  }, [colors]);

  useEffect(() => {
    if (product?.id) {
      fetchTotalQuantities();
    }
    if (selectedStock?.id && product?.id) {
      fetchSelectedStockQuantities();
    }
  }, [product, selectedStock]);

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
        setStockQuantities(data.result || {});
      }
    } catch (error) {
      console.error("Error fetching stock quantities:", error);
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
      }
    } catch (error) {
      console.error("Error fetching selected stock quantities:", error);
    }
  };

  // Update main image when color changes
  useEffect(() => {
    if (selectedColor?.image) {
      setSelectedImage(0); // Reset to main image for new color
    }
  }, [selectedColor]);

  // Ensure quantity không vượt quá available
  useEffect(() => {
    setQuantity((q) =>
      Math.max(
        1,
        Math.min(
          q,
          (selectedStock ? availableInSelectedStock : availableQuantity) || 1
        )
      )
    );
  }, [selectedStock, availableInSelectedStock, availableQuantity]);

  const handleAddToCart = async () => {
    // Prevent multiple calls
    if (isAddingToCart) return;

    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if stock is selected
    if (!selectedStock) {
      return;
    }

    // Check if color is selected (only if product has colors)
    if (colors?.length > 0 && !selectedColor) {
      return;
    }

    // Check if size is selected (only if product has sizes)
    if (sizes?.length > 0 && !selectedSize) {
      return;
    }

    // Check if variant is selected if product has variants
    if ((colors.length > 0 || sizes.length > 0) && !selectedInfo) {
      return;
    }

    // Check quantity validation
    if (quantity <= 0) {
      return;
    }

    if (
      quantity > (selectedStock ? availableInSelectedStock : availableQuantity)
    ) {
      return;
    }

    try {
      setIsAddingToCart(true);

      let currentCart = cart;

      // Nếu chưa có cart, tạo mới
      if (!currentCart?.id) {
        const createResult = await dispatch(createCart(user.id));

        if (createResult.error) {
          setIsAddingToCart(false);
          return;
        }

        currentCart = createResult.payload;
      }

      // Thêm sản phẩm vào cart
      const result = await dispatch(
        addToCart({
          cartId: currentCart?.id,
          productId: product.id,
          quantity: quantity,
          stockId: selectedStock?.id,
          productInfoId: selectedInfo?.id,
        })
      ).unwrap();
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    // Prevent multiple calls
    if (isBuying) return;

    // Same validations as add to cart
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if stock is selected
    if (!selectedStock) {
      return;
    }

    if (quantity <= 0) {
      return;
    }

    if (
      quantity > (selectedStock ? availableInSelectedStock : availableQuantity)
    ) {
      return;
    }

    // Check if variant is selected if product has variants
    if ((colors.length > 0 || sizes.length > 0) && !selectedInfo) {
      return;
    }

    try {
      setIsBuying(true);

      let currentCart = cart;

      // Nếu chưa có cart, tạo mới
      if (!currentCart?.id) {
        const createResult = await dispatch(createCart(user.id));

        if (createResult.error) {
          setIsBuying(false);
          return;
        }

        currentCart = createResult.payload;
      }

      // Add to cart first
      await dispatch(
        addToCart({
          cartId: currentCart?.id,
          productId: product.id,
          quantity: quantity,
          stockId: selectedStock?.id,
          productInfoId: selectedInfo?.id,
        })
      ).unwrap();

      // Redirect to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Buy now error:", error);
    } finally {
      setIsBuying(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(
      1,
      Math.min(
        newQuantity,
        (selectedStock ? availableInSelectedStock : availableQuantity) || 1
      )
    );
    setQuantity(validQuantity);
  };

  const handleToggleFavourite = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
      // Update state immediately for instant UI feedback
      setIsFavourite(!isFavourite);

      // Dispatch to backend
      await dispatch(
        toggleFavourite({
          userId: user.id,
          productId: product.id,
        })
      );
    } catch (error) {
      console.error("Toggle favourite error:", error);
      // Revert state if there's an error
      setIsFavourite(!isFavourite);
    }
  };

  if (!product) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Không tìm thấy sản phẩm
            </h1>
            <button
              onClick={() => navigate("/products")}
              className={`px-6 py-2 rounded-lg text-white transition-colors ${
                isDark
                  ? "bg-blue-700 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } relative`}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Product Detail Container */}
        <div
          className={`rounded-lg p-6 shadow-sm mb-8 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Breadcrumb */}
          <nav className="flex mb-6 text-sm px-4 py-3">
            <button
              onClick={() => navigate("/")}
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-blue-400"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Trang chủ
            </button>
            <span
              className={`mx-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              /
            </span>
            <button
              onClick={() => navigate("/products")}
              className={`transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-blue-400"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Sản phẩm
            </button>
            <span
              className={`mx-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              /
            </span>
            <span
              className={`font-medium ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {product.name}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hình ảnh sản phẩm */}
            <ProductImageSection
              product={product}
              selectedColor={selectedColor}
              selectedInfo={selectedInfo}
              infos={infos}
              isFavourite={isFavourite}
              onToggleFavourite={handleToggleFavourite}
              onColorSelect={setSelectedColor}
            />

            {/* Thông tin sản phẩm */}
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h1
                    className={`text-3xl font-bold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {product.name}
                  </h1>
                  {comments.length > 0 && (
                    <span className="text-yellow-500 flex items-center gap-1">
                      ({calculateRating(comments).toFixed(1)}
                      <Star className="w-4 h-4 fill-current" />)
                    </span>
                  )}
                </div>

                {/* Mô tả sản phẩm */}
                {product.description && (
                  <div
                    className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div
                      className={`leading-relaxed text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {product.description}
                      <div />
                    </div>
                  </div>
                )}
              </div>

              {/* Giá */}
              <ProductPriceInfo product={product} formatPrice={formatPrice} />

              {/* Chọn màu sắc */}
              <ProductColorSelector
                productColors={colors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              {/* Chọn kích thước */}
              <ProductSizeSelector
                productSizes={sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />

              {/* Hiển thị số lượng còn lại */}
              <div className="mb-6 p-4">
                <p className={`${isDark ? "text-white" : "text-gray-800"}`}>
                  Số lượng còn lại:{" "}
                  <strong>
                    {(selectedStock
                      ? availableInSelectedStock
                      : availableQuantity) ?? 0}
                  </strong>
                </p>
              </div>

              {/* Chọn số lượng */}
              <ProductQuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                maxQuantity={
                  (selectedStock
                    ? availableInSelectedStock
                    : availableQuantity) || 1
                }
              />

              {/* Nút thêm vào giỏ hàng và mua ngay */}
              <ProductActionButtons
                isAddingToCart={isAddingToCart}
                isBuying={isBuying}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <ProductDetails product={product} comments={comments} />

        {/* Bình luận sản phẩm */}
        <ProductComments
          productId={id}
          comments={comments}
          showAllByDefault={false}
        />

        {/* Sản phẩm liên quan */}
        <RelatedProducts />
      </div>
    </div>
  );
}
