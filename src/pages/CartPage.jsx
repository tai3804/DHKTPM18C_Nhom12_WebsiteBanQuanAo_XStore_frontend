import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import {
  getCartByUser,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../slices/CartSlice";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const loading = useSelector((state) => state.loading.isLoading);
  const themeMode = useSelector(selectThemeMode);
  const { productSales } = useSelector((state) => state.productSales);

  // Helper function to get product price (sale price or regular price)
  const getProductPrice = (product) => {
    if (!product) return 0;
    const productSale = productSales?.find(
      (ps) => ps.product?.id === product.id
    );
    return productSale ? productSale.discountedPrice : product.price || 0;
  };

  // Helper function to get original price (for showing strikethrough)
  const getOriginalPrice = (product) => {
    if (!product) return 0;
    const productSale = productSales?.find(
      (ps) => ps.product?.id === product.id
    );
    return productSale ? productSale.originalPrice : product.price || 0;
  };

  useEffect(() => {
    if (user?.id) {
      dispatch(getCartByUser(user.id));
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ cartItemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (cartItemId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm?")) {
      dispatch(clearCart(cart?.id));
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart
            className={`mx-auto h-16 w-16 mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Vui lòng đăng nhập
          </h2>
          <p
            className={`mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Bạn cần đăng nhập để xem giỏ hàng
          </p>
          <button
            onClick={() => navigate("/login")}
            className={`text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (loading && !cart) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p
            className={`mt-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Đang tải giỏ hàng...
          </p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart
            className={`mx-auto h-16 w-16 mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <h2
            className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Giỏ hàng trống
          </h2>
          <p
            className={`mb-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <button
            onClick={() => navigate("/products")}
            className={`text-white px-6 py-2 rounded-lg transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-blue-700 hover:bg-blue-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Tiếp tục mua sắm
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-3xl font-bold transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Giỏ hàng của bạn
          </h1>
          <button
            onClick={handleClearCart}
            className={`flex items-center gap-2 transition-colors duration-300 ${
              themeMode === "dark"
                ? "text-red-400 hover:text-red-300"
                : "text-red-600 hover:text-red-700"
            }`}
          >
            <Trash2 className="h-5 w-5" />
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.cartItems.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 flex gap-4 shadow-sm hover:shadow-md transition-all ${
                  themeMode === "dark"
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <img
                  src={item.product?.image || "https://via.placeholder.com/150"}
                  alt={item.product?.name}
                  className="w-24 h-24 object-contain rounded"
                />
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {item.product?.name}
                  </h3>
                  <p
                    className={`text-sm mb-2 transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {item.product?.brand} • {item.productInfo?.sizeName} •{" "}
                    {item.productInfo?.colorName}
                  </p>
                  <div className="mb-2">
                    {getProductPrice(item.product) !==
                    getOriginalPrice(item.product) ? (
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-lg font-bold transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-blue-400"
                              : "text-blue-600"
                          }`}
                        >
                          {getProductPrice(item.product)?.toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </span>
                        <span
                          className={`text-sm line-through transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {getOriginalPrice(item.product)?.toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </span>
                      </div>
                    ) : (
                      <p
                        className={`text-lg font-bold transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-blue-400"
                            : "text-blue-600"
                        }`}
                      >
                        {getProductPrice(item.product)?.toLocaleString("vi-VN")}
                        đ
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className={`transition-colors duration-300 ${
                      themeMode === "dark"
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-600 hover:text-red-700"
                    }`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity, -1)
                      }
                      disabled={loading}
                      className={`p-1 border rounded transition-colors duration-300 disabled:opacity-50 ${
                        themeMode === "dark"
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <Minus
                        className={`h-4 w-4 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      />
                    </button>

                    <span
                      className={`w-12 text-center font-semibold transition-colors duration-300 ${
                        themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity, 1)
                      }
                      disabled={loading}
                      className={`p-1 border rounded transition-colors duration-300 disabled:opacity-50 ${
                        themeMode === "dark"
                          ? "border-gray-600 hover:bg-gray-700"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-colors duration-300 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      />
                    </button>
                  </div>

                  <p
                    className={`text-lg font-bold transition-colors duration-300 ${
                      themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {(
                      getProductPrice(item.product) * item.quantity
                    )?.toLocaleString("vi-VN")}
                    đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`border rounded-lg p-6 shadow-sm sticky top-4 transition-colors duration-300 ${
                themeMode === "dark"
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Tóm tắt đơn hàng
              </h2>

              <div
                className={`space-y-2 mb-4 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>
                    {cart.cartItems
                      ?.reduce(
                        (total, item) =>
                          total + getProductPrice(item.product) * item.quantity,
                        0
                      )
                      ?.toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span
                    className={`font-medium transition-colors duration-300 ${
                      themeMode === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    Miễn phí
                  </span>
                </div>
                <hr
                  className={`transition-colors duration-300 ${
                    themeMode === "dark" ? "border-gray-700" : ""
                  }`}
                />
                <div
                  className={`flex justify-between text-lg font-bold transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <span>Tổng cộng:</span>
                  <span
                    className={`transition-colors duration-300 ${
                      themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {cart.cartItems
                      ?.reduce(
                        (total, item) =>
                          total + getProductPrice(item.product) * item.quantity,
                        0
                      )
                      ?.toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  themeMode === "dark"
                    ? "bg-blue-700 text-white hover:bg-blue-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Thanh toán
              </button>

              <button
                onClick={() => navigate("/products")}
                className={`w-full mt-2 py-3 rounded-lg transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "border border-blue-600 text-blue-400 hover:bg-gray-700"
                    : "border border-blue-600 text-blue-600 hover:bg-blue-50"
                }`}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
