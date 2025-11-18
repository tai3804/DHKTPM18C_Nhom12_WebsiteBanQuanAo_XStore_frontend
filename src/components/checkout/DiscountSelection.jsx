import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDiscounts } from "../../slices/DiscountSlice";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { Tag, X, Truck, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

export default function DiscountSelection({
  selectedDiscounts = [], // Mảng các mã giảm giá đã chọn
  selectedShippingDiscount = null, // Mã giảm phí vận chuyển đã chọn
  onSelectDiscount, // (discount) => void - Chọn/bỏ chọn mã giảm tiền
  onSelectShippingDiscount, // (discount) => void - Chọn mã giảm ship
  cartTotal = 0,
}) {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);
  const { discounts } = useSelector((state) => state.discount);

  const [priceDiscounts, setPriceDiscounts] = useState([]);
  const [shippingDiscounts, setShippingDiscounts] = useState([]);

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  useEffect(() => {
    if (discounts && user) {
      // Lọc discount hợp lệ cho user hiện tại
      const validDiscounts = discounts.filter((discount) => {
        if (!discount.isActive) return false;

        const now = new Date();
        if (discount.startDate && new Date(discount.startDate) > now)
          return false;
        if (discount.endDate && new Date(discount.endDate) < now) return false;

        if (discount.maxUsage > 0 && discount.usageCount >= discount.maxUsage) {
          return false;
        }

        if (discount.validUserType) {
          if (user.userType !== discount.validUserType) {
            return false;
          }
        }

        return true;
      });

      // Phân loại discount theo category
      const priceDiscs = validDiscounts.filter(
        (d) => d.category !== "SHIPPING"
      );
      const shippingDiscs = validDiscounts.filter(
        (d) => d.category === "SHIPPING"
      );

      setPriceDiscounts(priceDiscs);
      setShippingDiscounts(shippingDiscs);
    }
  }, [discounts, user]);

  const handleTogglePriceDiscount = (discount) => {
    const isSelected = selectedDiscounts.some((d) => d.id === discount.id);
    if (isSelected) {
      toast.info(`Đã bỏ chọn: ${discount.name}`);
    } else {
      toast.success(`Đã áp dụng: ${discount.name}`);
    }
    onSelectDiscount(discount);
  };

  const handleSelectShippingDiscount = (discount) => {
    if (selectedShippingDiscount?.id === discount.id) {
      toast.info(`Đã bỏ chọn mã giảm ship: ${discount.name}`);
      onSelectShippingDiscount(null);
    } else {
      toast.success(`Đã áp dụng mã giảm ship: ${discount.name}`);
      onSelectShippingDiscount(discount);
    }
  };

  const getUserTypeName = (userType) => {
    const types = {
      COPPER: "Đồng",
      SILVER: "Bạc",
      GOLD: "Vàng",
      PLATINUM: "Bạch kim",
    };
    return types[userType] || userType;
  };

  const getUserTypeBadge = (userType) => {
    const badges = {
      COPPER:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      SILVER: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      GOLD: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      PLATINUM:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    };
    return badges[userType] || "bg-blue-100 text-blue-700";
  };

  const renderDiscountCard = (
    discount,
    isSelected,
    onClick,
    showCheck = true
  ) => {
    // Separate selected discounts by type, excluding current discount
    const otherSelected = selectedDiscounts.filter((d) => d.id !== discount.id);
    const otherPercent = otherSelected.filter((d) => d.type === "PERCENT");
    const otherFixed = otherSelected.filter((d) => d.type === "FIXED");

    // Calculate remaining after applying other discounts in priority order
    let remaining = cartTotal;
    // First apply other percent discounts
    otherPercent.forEach((d) => {
      let amt = (remaining * (Number(d.discountPercent) || 0)) / 100;
      const maxDiscount = Number(d.discountAmount) || amt;
      amt = Math.min(amt, maxDiscount);
      amt = Math.min(amt, remaining);
      remaining -= amt;
    });
    // Then apply other fixed discounts
    otherFixed.forEach((d) => {
      let amt = Number(d.discountAmount) || 0;
      amt = Math.min(amt, remaining);
      remaining -= amt;
    });

    // Now calculate discount amount for current discount
    let discountAmount = 0;
    if (discount.type === "PERCENT") {
      discountAmount =
        (remaining * (Number(discount.discountPercent) || 0)) / 100;
      const maxDiscount = Number(discount.discountAmount) || discountAmount;
      discountAmount = Math.min(discountAmount, maxDiscount);
    } else {
      discountAmount = Number(discount.discountAmount) || 0;
    }
    discountAmount = Math.min(discountAmount, remaining);

    return (
      <div
        key={discount.id}
        onClick={onClick}
        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
          isSelected
            ? themeMode === "dark"
              ? "border-green-600 bg-green-900/20"
              : "border-green-500 bg-green-50"
            : themeMode === "dark"
            ? "border-gray-700 hover:border-gray-600 bg-gray-700/50 hover:bg-gray-700"
            : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`font-bold text-sm truncate ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {discount.name}
              </span>
              {discount.validUserType && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${getUserTypeBadge(
                    discount.validUserType
                  )}`}
                >
                  {getUserTypeName(discount.validUserType)}
                </span>
              )}
            </div>
            <p
              className={`text-xs mb-1.5 line-clamp-2 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {discount.title || discount.description}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold ${
                  themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                -{discountAmount.toLocaleString("vi-VN")}đ
              </span>
              {discount.type === "PERCENT" && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    themeMode === "dark"
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  -{discount.discountPercent}%
                </span>
              )}
            </div>
          </div>
          {showCheck && isSelected && (
            <div className="flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  themeMode === "dark" ? "bg-green-600" : "bg-green-500"
                }`}
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`p-6 rounded-lg border transition-colors ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-bold flex items-center gap-2 ${
            themeMode === "dark" ? "text-gray-200" : "text-gray-800"
          }`}
        >
          <Tag size={20} />
          Mã giảm giá
        </h3>
        {user && (
          <span
            className={`text-xs px-3 py-1 rounded-full ${getUserTypeBadge(
              user.userType
            )}`}
          >
            Bậc: {getUserTypeName(user.userType)}
          </span>
        )}
      </div>

      {/* 1. Mã giảm giá sản phẩm - Chọn nhiều */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign
            size={18}
            className={
              themeMode === "dark" ? "text-green-400" : "text-green-600"
            }
          />
          <h4
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Mã giảm giá sản phẩm
          </h4>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              themeMode === "dark"
                ? "bg-blue-900/30 text-blue-300"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            Chọn nhiều
          </span>
        </div>

        {selectedDiscounts.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedDiscounts.map((discount) => (
              <div
                key={discount.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                  themeMode === "dark"
                    ? "bg-green-900/30 text-green-300 border border-green-700"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                <span className="font-medium">{discount.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePriceDiscount(discount);
                  }}
                  className="hover:opacity-70"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {priceDiscounts.length > 0 ? (
            priceDiscounts.map((discount) =>
              renderDiscountCard(
                discount,
                selectedDiscounts.some((d) => d.id === discount.id),
                () => handleTogglePriceDiscount(discount)
              )
            )
          ) : (
            <div
              className={`col-span-2 text-center py-6 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Tag size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không có mã giảm giá sản phẩm</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. Mã giảm phí vận chuyển - Chọn 1 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Truck
            size={18}
            className={
              themeMode === "dark" ? "text-orange-400" : "text-orange-600"
            }
          />
          <h4
            className={`font-semibold ${
              themeMode === "dark" ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Mã giảm phí vận chuyển
          </h4>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              themeMode === "dark"
                ? "bg-orange-900/30 text-orange-300"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            Chọn 1
          </span>
        </div>

        {selectedShippingDiscount && (
          <div className="mb-3">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
                themeMode === "dark"
                  ? "bg-orange-900/30 text-orange-300 border border-orange-700"
                  : "bg-orange-50 text-orange-700 border border-orange-200"
              }`}
            >
              <Truck size={14} />
              <span className="font-medium">
                {selectedShippingDiscount.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectShippingDiscount(selectedShippingDiscount);
                }}
                className="hover:opacity-70"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {shippingDiscounts.length > 0 ? (
            shippingDiscounts.map((discount) =>
              renderDiscountCard(
                discount,
                selectedShippingDiscount?.id === discount.id,
                () => handleSelectShippingDiscount(discount)
              )
            )
          ) : (
            <div
              className={`col-span-2 text-center py-6 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Truck size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không có mã giảm phí vận chuyển</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
