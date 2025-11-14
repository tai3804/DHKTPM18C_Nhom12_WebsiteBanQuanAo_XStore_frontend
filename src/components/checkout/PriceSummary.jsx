import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const PriceSummary = ({
  cartItems = [],
  selectedDiscount = null,
  shippingFee = 30000, // Default shipping fee
  onTotalChange,
}) => {
  const themeMode = useSelector(selectThemeMode);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    discountAmount: 0,
    finalTotal: 0,
  });

  // Calculate totals whenever inputs change
  useEffect(() => {
    const newCalculations = calculateTotals();
    setCalculations(newCalculations);

    // Notify parent component of total change
    if (onTotalChange) {
      onTotalChange(newCalculations.finalTotal);
    }
  }, [cartItems, selectedDiscount, shippingFee]);

  const calculateTotals = () => {
    // Calculate subtotal from cart items with safety checks
    const subtotal = cartItems.reduce((total, item) => {
      const product = item.product || {};
      const itemPrice = Number(product.salePrice) || Number(product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + itemPrice * quantity;
    }, 0);

    // Calculate discount amount
    let discountAmount = 0;
    if (selectedDiscount && subtotal > 0) {
      if (selectedDiscount.type === "PERCENTAGE") {
        discountAmount =
          (subtotal * (Number(selectedDiscount.value) || 0)) / 100;
        // Apply max discount limit if exists
        if (
          selectedDiscount.maxDiscountAmount &&
          discountAmount > Number(selectedDiscount.maxDiscountAmount)
        ) {
          discountAmount = Number(selectedDiscount.maxDiscountAmount);
        }
      } else if (selectedDiscount.type === "FIXED") {
        discountAmount = Math.min(
          Number(selectedDiscount.value) || 0,
          subtotal
        );
      }
    }

    // Calculate final total with safety checks
    const safeShippingFee = Number(shippingFee) || 0;
    const finalTotal = subtotal - discountAmount + safeShippingFee;

    return {
      subtotal: subtotal,
      discountAmount: discountAmount,
      finalTotal: Math.max(0, finalTotal), // Ensure total is never negative
    };
  };

  const formatCurrency = (amount) => {
    const safeAmount = Number(amount) || 0;
    return safeAmount.toLocaleString("vi-VN");
  };

  const { subtotal, discountAmount, finalTotal } = calculations;
  const itemCount = cartItems.reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );

  return (
    <div
      className={`p-6 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          themeMode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        <span className="text-2xl">🧮</span>
        Tổng kết đơn hàng
      </h3>

      {/* Order Items Summary */}
      <div
        className={`p-3 rounded-lg mb-4 ${
          themeMode === "dark" ? "bg-gray-700/50" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-sm ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="text-lg mr-2">📦</span>
            Sản phẩm ({itemCount} món)
          </span>
          <span
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {formatCurrency(subtotal)}đ
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span
            className={`${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Tạm tính
          </span>
          <span
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {formatCurrency(subtotal)}đ
          </span>
        </div>

        {/* Shipping Fee */}
        <div className="flex items-center justify-between">
          <span
            className={`${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <span className="text-lg mr-2">🚚</span>
            Phí vận chuyển
          </span>
          <span
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {formatCurrency(shippingFee)}đ
          </span>
        </div>

        {/* Discount */}
        {selectedDiscount && discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span
              className={`${
                themeMode === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              <span className="text-lg mr-2">🎟️</span>
              Giảm giá ({selectedDiscount.code})
            </span>
            <span
              className={`font-semibold ${
                themeMode === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              -{formatCurrency(discountAmount)}đ
            </span>
          </div>
        )}

        {/* Divider */}
        <div
          className={`border-t-2 border-dashed ${
            themeMode === "dark" ? "border-gray-600" : "border-gray-300"
          }`}
        ></div>

        {/* Final Total */}
        <div className="flex items-center justify-between py-2">
          <span
            className={`text-lg font-bold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            💰 Tổng cộng
          </span>
          <span
            className={`text-xl font-bold ${
              themeMode === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            {formatCurrency(finalTotal)}đ
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;
