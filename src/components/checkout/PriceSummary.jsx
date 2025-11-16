import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const PriceSummary = ({
  cartItems = [],
  selectedDiscounts = [],
  selectedShippingDiscount = null,
  shippingFee = 30000,
  onTotalChange,
}) => {
  const themeMode = useSelector(selectThemeMode);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    productDiscountAmount: 0,
    shippingDiscountAmount: 0,
    finalShippingFee: 0,
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
  }, [cartItems, selectedDiscounts, selectedShippingDiscount, shippingFee]);

  const calculateTotals = () => {
    // Calculate subtotal from cart items
    const subtotal = cartItems.reduce((total, item) => {
      const product = item.product || {};
      const itemPrice = Number(product.salePrice) || Number(product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + itemPrice * quantity;
    }, 0);

    // Calculate product discount amount (multiple discounts)
    let productDiscountAmount = 0;
    if (selectedDiscounts.length > 0 && subtotal > 0) {
      selectedDiscounts.forEach((discount) => {
        if (discount.type === "PERCENT") {
          const amount =
            (subtotal * (Number(discount.discountPercent) || 0)) / 100;
          const maxDiscount = Number(discount.discountAmount) || amount;
          productDiscountAmount += Math.min(amount, maxDiscount);
        } else {
          productDiscountAmount += Math.min(
            Number(discount.discountAmount) || 0,
            subtotal
          );
        }
      });
      // Đảm bảo không giảm quá subtotal
      productDiscountAmount = Math.min(productDiscountAmount, subtotal);
    }

    // Calculate shipping discount amount
    let shippingDiscountAmount = 0;
    let finalShippingFee = Number(shippingFee) || 0;
    if (selectedShippingDiscount && finalShippingFee > 0) {
      if (selectedShippingDiscount.type === "PERCENT") {
        const amount =
          (finalShippingFee *
            (Number(selectedShippingDiscount.discountPercent) || 0)) /
          100;
        const maxDiscount =
          Number(selectedShippingDiscount.discountAmount) || amount;
        shippingDiscountAmount = Math.min(
          amount,
          maxDiscount,
          finalShippingFee
        );
      } else {
        shippingDiscountAmount = Math.min(
          Number(selectedShippingDiscount.discountAmount) || 0,
          finalShippingFee
        );
      }
      finalShippingFee -= shippingDiscountAmount;
    }

    // Calculate final total
    const finalTotal = subtotal - productDiscountAmount + finalShippingFee;

    return {
      subtotal,
      productDiscountAmount,
      shippingDiscountAmount,
      finalShippingFee,
      finalTotal: Math.max(0, finalTotal),
    };
  };

  const formatCurrency = (amount) => {
    const safeAmount = Number(amount) || 0;
    return safeAmount.toLocaleString("vi-VN");
  };

  const {
    subtotal,
    productDiscountAmount,
    shippingDiscountAmount,
    finalShippingFee,
    finalTotal,
  } = calculations;
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

        {/* Product Discounts */}
        {selectedDiscounts.length > 0 && productDiscountAmount > 0 && (
          <div className="flex flex-col gap-1">
            {selectedDiscounts.map((discount, index) => (
              <div
                key={discount.id}
                className="flex items-center justify-between"
              >
                <span
                  className={`text-sm ${
                    themeMode === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  <span className="text-lg mr-2">🎟️</span>
                  {discount.name}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    themeMode === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {index === selectedDiscounts.length - 1 && "-"}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <span
                className={`font-semibold ${
                  themeMode === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                Tổng giảm giá sản phẩm
              </span>
              <span
                className={`font-semibold ${
                  themeMode === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                -{formatCurrency(productDiscountAmount)}đ
              </span>
            </div>
          </div>
        )}

        {/* Shipping Fee */}
        <div className="flex items-center justify-between">
          <span
            className={`${
              themeMode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <span className="text-lg mr-2">🚚</span>
            Phí vận chuyển{" "}
            {shippingDiscountAmount > 0 &&
              `(đã giảm ${formatCurrency(shippingDiscountAmount)}đ)`}
          </span>
          <span
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {formatCurrency(finalShippingFee)}đ
          </span>
        </div>

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
