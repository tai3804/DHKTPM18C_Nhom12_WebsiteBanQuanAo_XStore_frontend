import React from "react";
import { ShoppingCart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CartIcon() {
  const { cart } = useSelector((state) => state.cart);

  // Tính tổng số lượng sản phẩm trong giỏ
  const totalItems =
    cart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <NavLink
      to="/cart"
      className={({ isActive }) =>
        `relative p-2 rounded-full transition-all duration-200 ${
          isActive
            ? "bg-gray-200 text-gray-900 border border-gray-300 shadow-sm"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-transparent"
        }`
      }
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </NavLink>
  );
}
