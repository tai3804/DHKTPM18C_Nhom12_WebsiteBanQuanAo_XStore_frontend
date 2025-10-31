import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import {
  getCartByUser,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../slices/CartSlice';
import Header from '../components/header/Header';
import Footer from '../components/common/Footer';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const loading = useSelector((state) => state.loading.isLoading);

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
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      dispatch(removeFromCart(cartItemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm?')) {
      dispatch(clearCart(cart?.id));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center min-h-[60vh]">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h2>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng nhập để xem giỏ hàng
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (loading && !cart) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải giỏ hàng...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center min-h-[60vh]">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-4">
            Bạn chưa có sản phẩm nào trong giỏ hàng
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 min-h-[60vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
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
                className="border rounded-lg p-4 flex gap-4 bg-white shadow"
              >
                <img
                  src={item.product?.image || 'https://via.placeholder.com/150'}
                  alt={item.product?.name}
                  className="w-24 h-24 object-contain rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {item.product?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {item.product?.brand} • {item.product?.size} •{' '}
                    {item.product?.color}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {item.product?.price?.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity, -1)
                      }
                      disabled={loading}
                      className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity, 1)
                      }
                      disabled={loading}
                      className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-lg font-bold">
                    {item.subTotal?.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-white shadow sticky top-4">
              <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{cart.total?.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">
                    {cart.total?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thanh toán
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-2 border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}