import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeliveryInfo from "../components/checkout/DeliveryInfo";
import ProductSummary from "../components/checkout/ProductSummary";
import DiscountSelection from "../components/checkout/DiscountSelection";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderNotes from "../components/checkout/OrderNotes";
import PriceSummary from "../components/checkout/PriceSummary";
import { selectThemeMode } from "../slices/ThemeSlice";
import { getCartByUser } from "../slices/CartSlice";
import { API_BASE_URL } from "../config/api";
import { ArrowLeft } from "lucide-react";
import { createPaymentUrl } from "../api/payment";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { productSales } = useSelector((state) => state.productSales);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingShipInfos, setLoadingShipInfos] = useState(false);

  // Ship Infos state
  const [shipInfos, setShipInfos] = useState([]);
  const [selectedShipInfoId, setSelectedShipInfoId] = useState(null);

  // Order state
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedShippingDiscount, setSelectedShippingDiscount] =
    useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("CASH");
  const [orderNotes, setOrderNotes] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);

  // Load data on component mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!cart || cart.cartItems?.length === 0) {
      dispatch(getCartByUser(user.id));
    }

    loadShipInfos();
  }, [user?.id]);

  // Load ship infos from API
  const loadShipInfos = async () => {
    if (!user?.id) return;
    setLoadingShipInfos(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ship-infos/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (data.code === 200 && data.result) {
        const shipInfoList = Array.isArray(data.result) ? data.result : [];
        setShipInfos(shipInfoList);

        // Auto-select first ship info or default
        if (shipInfoList.length > 0) {
          const defaultShipInfo = shipInfoList.find((s) => s.isDefault);
          setSelectedShipInfoId(defaultShipInfo?.id || shipInfoList[0].id);
        }
      }
    } catch (err) {
      console.error("Error loading ship infos:", err);
      toast.error("Lỗi khi tải thông tin giao hàng");
    } finally {
      setLoadingShipInfos(false);
    }
  };

  // Handle price discount selection/toggle
  const handleSelectDiscount = (discount) => {
    setSelectedDiscounts((prev) => {
      const isSelected = prev.some((d) => d.id === discount.id);
      if (isSelected) {
        return prev.filter((d) => d.id !== discount.id);
      } else {
        return [...prev, discount];
      }
    });
  };

  // Handle shipping discount selection
  const handleSelectShippingDiscount = (discount) => {
    setSelectedShippingDiscount(discount);
  };

  // Handle payment method change
  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Handle notes change
  const handleNotesChange = (notes) => {
    setOrderNotes(notes);
  };

  // Handle total change from PriceSummary
  const handleTotalChange = (total) => {
    setFinalTotal(total);
  };

  // Validate checkout data
  const validateCheckout = () => {
    if (!selectedShipInfoId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return false;
    }
    const selectedShipInfo = shipInfos.find((s) => s.id === selectedShipInfoId);
    if (!selectedShipInfo?.recipientName) {
      toast.error("Địa chỉ giao hàng phải có tên người nhận");
      return false;
    }
    if (!selectedShipInfo?.recipientPhone) {
      toast.error("Địa chỉ giao hàng phải có số điện thoại người nhận");
      return false;
    }
    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return false;
    }
    if (!cart || cart.cartItems?.length === 0) {
      toast.error("Giỏ hàng trống");
      return false;
    }
    return true;
  };

  // Handle checkout submission
  const handleCheckout = async () => {
    if (!validateCheckout()) return;

    setLoading(true);

    try {
      const selectedShipInfo = shipInfos.find(
        (s) => s.id === selectedShipInfoId
      );

      // Tạo object request cho đơn hàng
      const checkoutRequest = {
        userId: user.id,
        cartId: cart.id,
        items: cart.cartItems.map((item) => ({
          cartItemId: item.id,
          productId: item.product?.id || item.productId,
          quantity: item.quantity,
          price: (() => {
            const productSale = productSales?.find(
              (ps) => ps.product?.id === item.product?.id
            );
            return productSale
              ? productSale.discountedPrice
              : item.product?.price || 0;
          })(),
        })),
        paymentMethod: selectedPaymentMethod,
        shipInfoId: selectedShipInfoId,
        recipientName: selectedShipInfo?.recipientName || "",
        recipientPhone: selectedShipInfo?.recipientPhone || "",
        shippingAddress: selectedShipInfo
          ? `${selectedShipInfo.streetNumber
            ? selectedShipInfo.streetNumber + ", "
            : ""
          }${selectedShipInfo.streetName}, ${selectedShipInfo.ward ? selectedShipInfo.ward + ", " : ""
          }${selectedShipInfo.district}, ${selectedShipInfo.city}`
          : "",
        phoneNumber: selectedShipInfo?.recipientPhone || "",
        notes: orderNotes,
        discountIds: selectedDiscounts.map((d) => d.id),
        shippingDiscountId: selectedShippingDiscount?.id || null,
      };

      // 1. GỌI API TẠO ĐƠN HÀNG (ORDER SERVICE)
      const response = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(checkoutRequest),
      });

      const data = await response.json();

      if (data.code === 200 || response.ok) {
        // Lấy ID đơn hàng vừa tạo thành công
        const orderId = data.result?.id;

        // 2. XỬ LÝ THANH TOÁN DỰA TRÊN PHƯƠNG THỨC
        if (selectedPaymentMethod === "VNPAY") {
          toast.info("Đang chuyển hướng đến cổng thanh toán VNPay...");

          try {
            // Gọi API Backend để lấy URL thanh toán
            const paymentRes = await createPaymentUrl({
              amount: finalTotal, // Tổng tiền cuối cùng
              orderId: orderId,
              bankCode: "" // Để trống để user tự chọn ngân hàng tại VNPay
            });

            // Kiểm tra kết quả trả về từ API Payment
            // (Tuỳ thuộc vào cấu trúc ApiResponse của bạn, thường check code hoặc result)
            if (paymentRes.result) {
              // Cập nhật giỏ hàng (xoá item đã mua)
              dispatch(getCartByUser(user.id));

              // Chuyển hướng trình duyệt sang VNPay
              window.location.href = paymentRes.result;

              return; // Dừng hàm để chờ redirect
            } else {
              toast.error("Không lấy được đường dẫn thanh toán");
              navigate(`/order-confirmation/${orderId}`);
            }
          } catch (paymentErr) {
            console.error("Payment creation error:", paymentErr);
            toast.error("Lỗi kết nối cổng thanh toán. Vui lòng thử lại sau.");
            navigate(`/order-confirmation/${orderId}`);
          }
        } else {
          // 3. XỬ LÝ THANH TOÁN KHI NHẬN HÀNG (CASH/COD)
          toast.success("✓ Đặt hàng thành công!");

          // Clear cart after successful order
          dispatch(getCartByUser(user.id));

          // Navigate to confirmation page
          setTimeout(() => {
            if (orderId) {
              navigate(`/order-confirmation/${orderId}`);
            } else {
              navigate(`/orders`);
            }
          }, 1000);
        }
      } else {
        // Xử lý lỗi từ API tạo đơn hàng
        toast.error(data.message || "Lỗi tạo đơn hàng");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Lỗi checkout: " + err.message);
    } finally {
      // Chỉ tắt loading nếu KHÔNG phải chuyển hướng đi VNPAY (để tránh UI bị nháy)
      if (selectedPaymentMethod !== "VNPAY") {
        setLoading(false);
      }
    }
  };

  // Loading state
  if (!user || !cart) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${themeMode === "dark"
          ? "bg-linear-to-b from-gray-900 to-gray-800"
          : "bg-linear-to-b from-white to-gray-50"
          }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p
            className={`transition-colors duration-300 ${themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
          >
            Đang tải thông tin checkout...
          </p>
        </div>
      </div>
    );
  }

  // Empty cart check
  if (cart.cartItems?.length === 0) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${themeMode === "dark"
          ? "bg-linear-to-b from-gray-900 to-gray-800"
          : "bg-linear-to-b from-white to-gray-50"
          }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <p
            className={`mb-6 transition-colors duration-300 ${themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán
          </p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Mua sắm ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeMode === "dark"
        ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
        : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className={`flex items-center gap-2 transition-colors ${themeMode === "dark"
              ? "text-emerald-400 hover:text-emerald-300"
              : "text-emerald-600 hover:text-emerald-700"
              }`}
          >
            <ArrowLeft size={20} />
            Quay lại giỏ hàng
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">💳</span>
          Thanh toán đơn hàng
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Checkout Form */}
          <div className="space-y-6">
            {/* 1. Delivery Information */}
            <DeliveryInfo
              shipInfos={shipInfos}
              selectedShipInfoId={selectedShipInfoId}
              onSelectShipInfo={setSelectedShipInfoId}
              onShipInfosUpdate={loadShipInfos}
              loading={loadingShipInfos}
            />

            {/* 2. Product Summary */}
            <ProductSummary cartItems={cart.cartItems} />

            {/* 3. Discount Selection */}
            <DiscountSelection
              selectedDiscounts={selectedDiscounts}
              selectedShippingDiscount={selectedShippingDiscount}
              onSelectDiscount={handleSelectDiscount}
              onSelectShippingDiscount={handleSelectShippingDiscount}
              cartTotal={cart.cartItems.reduce((sum, item) => {
                const productSale = productSales?.find(
                  (ps) => ps.product?.id === item.product?.id
                );
                const itemPrice = productSale
                  ? productSale.discountedPrice
                  : item.product?.price || 0;
                return sum + itemPrice * item.quantity;
              }, 0)}
            />

            {/* 4. Payment Method */}
            <PaymentMethod
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={handleSelectPaymentMethod}
            />

            {/* 5. Order Notes */}
            <OrderNotes notes={orderNotes} onNotesChange={handleNotesChange} />

            {/* 6. Price Summary - Moved above checkout button */}
            <PriceSummary
              cartItems={cart.cartItems}
              selectedDiscounts={selectedDiscounts}
              selectedShippingDiscount={selectedShippingDiscount}
              shippingFee={30000}
              onTotalChange={handleTotalChange}
            />

            {/* Checkout Button */}
            <div
              className={`p-6 rounded-lg border transition-colors ${themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
                }`}
            >
              <button
                onClick={handleCheckout}
                disabled={loading || !selectedShipInfoId}
                className="w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span className="text-2xl">✅</span>
                    Hoàn tất đặt hàng (
                    {(finalTotal || 0).toLocaleString("vi-VN")}đ)
                  </>
                )}
              </button>

              {!selectedShipInfoId && (
                <p className="text-center text-red-500 text-sm mt-2">
                  ⚠️ Vui lòng chọn địa chỉ giao hàng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
