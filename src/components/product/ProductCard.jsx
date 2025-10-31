import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { addToCart, createCart } from '../../slices/CartSlice';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const { cart } = useSelector(state => state.cart);
  const loading = useSelector(state => state.loading.isLoading);
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Xử lý thêm vào giỏ hàng - TẠO CART NẾU CHƯA CÓ
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // Kiểm tra đăng nhập
    if (!user) {
      if (window.confirm('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng. Chuyển đến trang đăng nhập?')) {
        navigate('/login');
      }
      return;
    }

    setIsAdding(true);

    try {
      let currentCart = cart;

      // ✅ Nếu chưa có cart, tạo mới
      if (!currentCart?.id) {
        const createResult = await dispatch(createCart(user.id));

        if (createResult.error) {
          toast.error('Không thể tạo giỏ hàng');
          return;
        }

        currentCart = createResult.payload;
      }

      // ✅ Thêm sản phẩm vào cart
      const cartId = currentCart.id;
      const productId = product.id;

      if (cartId && productId) {
        const result = await dispatch(addToCart({
          cartId,
          productId,
          quantity: 1,
        }));

        if (!result.error) {
          // Hiển thị animation thành công
          setTimeout(() => setIsAdding(false), 1500);
        }
      } else {
        toast.error('Lỗi xác định giỏ hàng hoặc sản phẩm');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Không thể thêm vào giỏ hàng');
    } finally {
      setTimeout(() => setIsAdding(false), 1500);
    }
  };

  // Xử lý yêu thích
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    console.log("Toggle favorite:", product.id);
  };

  // Xử lý click vào sản phẩm
  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center relative">
        <img
          src={product.image || "https://via.placeholder.com/150"}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply"
        />
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
        >
          <Heart className="h-4 w-4" />
        </button>

        {product.type?.name && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-md">
            {product.type.name}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        {product.brand} • {product.size} • {product.color}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <p className="text-lg font-bold text-gray-900">
          {product.price?.toLocaleString('vi-VN')}đ
        </p>
        {product.priceInStock && product.priceInStock < product.price && (
          <span className="text-xs text-gray-500 line-through">
            {product.priceInStock?.toLocaleString('vi-VN')}đ
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAddToCart}
          disabled={loading || isAdding}
          className={`flex-1 text-sm text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isAdding ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          <ShoppingCart className={`h-4 w-4 ${isAdding ? 'animate-bounce' : ''}`} />
          {isAdding ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}