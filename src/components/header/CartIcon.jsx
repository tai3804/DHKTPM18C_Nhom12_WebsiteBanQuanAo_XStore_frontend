import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CartIcon() {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);

  // Tính tổng số lượng sản phẩm trong giỏ
  const totalItems = cart?.cartItems?.reduce(
    (total, item) => total + item.quantity,
    0
  ) || 0;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}