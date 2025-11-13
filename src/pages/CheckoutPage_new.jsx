import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { selectThemeMode } from "../slices/ThemeSlice";
import { getCartByUser } from "../slices/CartSlice";
import { API_BASE_URL } from "../config/api";
import { ArrowLeft, Check, Plus, X, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Confirm, 3: Success

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    district: "",
    city: "",
    postalCode: "",
  });

  // Discounts state
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    phoneNumber: user?.phone || "",
    selectedAddressId: null,
    selectedDiscount: null,
    notes: "",
    paymentMethod: "CASH", // Chỉ có CASH
  });

  const [discountAmount, setDiscountAmount] = useState(0);

  // Load addresses on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!cart || cart.cartItems?.length === 0) {
      dispatch(getCartByUser(user.id));
    }

    loadAddresses();
    loadAvailableDiscounts();
  }, [user, cart, dispatch, navigate]);

  // Load addresses from API
  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (data.code === 200 || Array.isArray(data.result)) {
        const addressList = Array.isArray(data.result)
          ? data.result
          : data.result?.content || [];
        setAddresses(addressList);

        // Auto-select first address
        if (addressList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            selectedAddressId: addressList[0].id,
          }));
        }
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Load available discounts
  const loadAvailableDiscounts = async () => {
    setLoadingDiscounts(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/discounts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (data.code === 200 || Array.isArray(data.result)) {
        const discountList = Array.isArray(data.result)
          ? data.result
          : data.result?.content || [];
        // Filter valid discounts
        setAvailableDiscounts(discountList.filter((d) => d.isActive));
      }
    } catch (err) {
      console.error("Error loading discounts:", err);
    } finally {
      setLoadingDiscounts(false);
    }
  };

  // Create new address
  const handleCreateAddress = async () => {
    if (!newAddress.street || !newAddress.district || !newAddress.city) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      const addressPayload = {
        street: newAddress.street,
        district: newAddress.district,
        city: newAddress.city,
        postalCode: newAddress.postalCode || "",
      };

      const response = await fetch(`${API_BASE_URL}/api/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressPayload),
      });

      const data = await response.json();

      if (data.code === 201 || response.ok) {
        toast.success("✓ Thêm địa chỉ thành công!");
        setShowAddressForm(false);
        setNewAddress({ street: "", district: "", city: "", postalCode: "" });

        // Reload addresses
        loadAddresses();
      } else {
        toast.error(data.message || "Lỗi tạo địa chỉ");
      }
    } catch (err) {
      toast.error("Lỗi: " + err.message);
    }
  };

  // Select discount
  const handleSelectDiscount = (discount) => {
    setSelectedDiscount(discount);

    // Calculate discount amount
    const subtotal = cart.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    let amount = 0;
    if (discount.type === "FIXED") {
      amount = Math.min(discount.discountAmount, subtotal);
    } else {
      amount = (subtotal * discount.discountPercent) / 100;
    }

    setDiscountAmount(amount);
    setFormData((prev) => ({ ...prev, selectedDiscount: discount.id }));
    toast.success(`✓ Áp dụng mã giảm giá: ${discount.name}`);
  };

  // Deselect discount
  const handleRemoveDiscount = () => {
    setSelectedDiscount(null);
    setDiscountAmount(0);
    setFormData((prev) => ({ ...prev, selectedDiscount: null }));
    toast.info("Bỏ chọn mã giảm giá");
  };

  // Get selected address
  const selectedAddress = addresses.find(
    (a) => a.id === formData.selectedAddressId
  );
  const addressDisplay = selectedAddress
    ? `${selectedAddress.street}, ${selectedAddress.district}, ${selectedAddress.city}`
    : "Chưa chọn địa chỉ";

  // Validate step 1
  const validateStep1 = () => {
    if (!formData.phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!formData.selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng");
      return false;
    }
    return true;
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!validateStep1()) return;

    setLoading(true);

    try {
      const checkoutRequest = {
        userId: user.id,
        cartId: cart.id,
        items: cart.cartItems.map((item) => ({
          cartItemId: item.id,
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        paymentMethod: "CASH",
        shippingAddress: addressDisplay,
        phoneNumber: formData.phoneNumber,
        notes: formData.notes,
        discountAmount: discountAmount,
        discountId: selectedDiscount?.id || 0,
      };

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
        toast.success("✓ Đơn hàng đã được tạo thành công!");
        setStep(3);

        setTimeout(() => {
          navigate(`/order-confirmation/${data.result.id}`);
        }, 1500);
      } else {
        toast.error(data.message || "Lỗi tạo đơn hàng");
      }
    } catch (err) {
      toast.error("Lỗi checkout: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !cart) {
    return (
      <>
        <Header />
        <div
          className={`min-h-screen transition-colors duration-300 ${
            themeMode === "dark"
              ? "bg-linear-to-b from-gray-900 to-gray-800"
              : "bg-linear-to-b from-white to-gray-50"
          }`}
        >
          <div className="container mx-auto px-4 py-16 text-center">
            <p
              className={`transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Đang tải...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const subtotal = cart.cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee =
    addressDisplay.includes("TP.HCM") || addressDisplay.includes("TPHCM")
      ? 25000
      : 40000;
  const total = subtotal - discountAmount + shippingFee;

  return (
    <>
      <Header />
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft size={20} />
              Quay lại giỏ hàng
            </button>
          </div>

          <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

          {/* Progress Steps */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-3 pb-4 border-b-2 transition-colors ${
                  s <= step
                    ? "border-indigo-600"
                    : themeMode === "dark"
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    s <= step
                      ? "bg-indigo-600 text-white"
                      : themeMode === "dark"
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s < step ? <Check size={18} /> : s}
                </div>
                <span className="text-sm font-medium hidden md:inline">
                  {
                    ["Thông tin giao hàng", "Xác nhận đơn hàng", "Hoàn tất"][
                      s - 1
                    ]
                  }
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div
                className={`rounded-2xl p-8 border transition-colors duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-6">
                      📍 Thông tin giao hàng
                    </h2>

                    {/* Phone Number */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                        placeholder="0912345678"
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                          themeMode === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
                            : "bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                        }`}
                      />
                    </div>

                    {/* Address Selection */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-3 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        📌 Chọn địa chỉ giao hàng
                      </label>

                      {loadingAddresses ? (
                        <p
                          className={
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }
                        >
                          Đang tải địa chỉ...
                        </p>
                      ) : addresses.length > 0 ? (
                        <div className="space-y-2 mb-4">
                          {addresses.map((addr) => (
                            <label
                              key={addr.id}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                formData.selectedAddressId === addr.id
                                  ? themeMode === "dark"
                                    ? "border-indigo-500 bg-indigo-900/20"
                                    : "border-indigo-500 bg-indigo-50"
                                  : themeMode === "dark"
                                  ? "border-gray-700 hover:border-gray-600"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="address"
                                value={addr.id}
                                checked={formData.selectedAddressId === addr.id}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    selectedAddressId: parseInt(e.target.value),
                                  }))
                                }
                                className="w-4 h-4"
                              />
                              <div>
                                <p className="font-semibold">
                                  <MapPin size={16} className="inline mr-2" />
                                  {addr.street}, {addr.district}
                                </p>
                                <p
                                  className={
                                    themeMode === "dark"
                                      ? "text-gray-400 text-sm"
                                      : "text-gray-600 text-sm"
                                  }
                                >
                                  {addr.city} {addr.postalCode}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      ) : null}

                      {/* Add New Address Button */}
                      <button
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          showAddressForm
                            ? themeMode === "dark"
                              ? "bg-red-600 text-white"
                              : "bg-red-600 text-white"
                            : themeMode === "dark"
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {showAddressForm ? (
                          <>
                            <X size={18} />
                            Đóng
                          </>
                        ) : (
                          <>
                            <Plus size={18} />
                            Thêm địa chỉ mới
                          </>
                        )}
                      </button>

                      {/* Add Address Form */}
                      {showAddressForm && (
                        <div
                          className={`mt-4 p-4 rounded-lg border ${
                            themeMode === "dark"
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Số nhà, tên đường"
                              value={newAddress.street}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  street: e.target.value,
                                }))
                              }
                              className={`w-full px-3 py-2 border rounded ${
                                themeMode === "dark"
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Quận/Huyện"
                              value={newAddress.district}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  district: e.target.value,
                                }))
                              }
                              className={`w-full px-3 py-2 border rounded ${
                                themeMode === "dark"
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Thành phố/Tỉnh"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                              className={`w-full px-3 py-2 border rounded ${
                                themeMode === "dark"
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                            <input
                              type="text"
                              placeholder="Mã bưu điện (tùy chọn)"
                              value={newAddress.postalCode}
                              onChange={(e) =>
                                setNewAddress((prev) => ({
                                  ...prev,
                                  postalCode: e.target.value,
                                }))
                              }
                              className={`w-full px-3 py-2 border rounded ${
                                themeMode === "dark"
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            />
                            <button
                              onClick={handleCreateAddress}
                              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                            >
                              ✓ Lưu địa chỉ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        Ghi chú (tùy chọn)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="VD: Giao hàng giờ hành chính, tránh giao ban đêm..."
                        rows="2"
                        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                          themeMode === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
                            : "bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500"
                        }`}
                      />
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
                    >
                      Tiếp tục →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-6">
                      ✓ Xác nhận đơn hàng
                    </h2>

                    {/* Discount Selection */}
                    <div>
                      <label
                        className={`block text-sm font-semibold mb-3 ${
                          themeMode === "dark"
                            ? "text-gray-300"
                            : "text-gray-700"
                        }`}
                      >
                        🎁 Mã giảm giá (tùy chọn)
                      </label>

                      {loadingDiscounts ? (
                        <p
                          className={
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }
                        >
                          Đang tải mã giảm giá...
                        </p>
                      ) : availableDiscounts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          {availableDiscounts.map((discount) => {
                            const isSelected =
                              selectedDiscount?.id === discount.id;
                            return (
                              <button
                                key={discount.id}
                                onClick={() => handleSelectDiscount(discount)}
                                className={`p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                                  isSelected
                                    ? themeMode === "dark"
                                      ? "border-green-500 bg-green-900/20"
                                      : "border-green-500 bg-green-50"
                                    : themeMode === "dark"
                                    ? "border-gray-700 hover:border-indigo-500"
                                    : "border-gray-200 hover:border-indigo-500"
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-semibold">
                                      {discount.name}
                                    </p>
                                    <p
                                      className={`text-sm ${
                                        themeMode === "dark"
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {discount.type === "FIXED"
                                        ? `Giảm ${discount.discountAmount.toLocaleString()}₫`
                                        : `Giảm ${discount.discountPercent}%`}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <Check
                                      size={20}
                                      className="text-green-500"
                                    />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p
                          className={
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-500"
                          }
                        >
                          Không có mã giảm giá khả dụng
                        </p>
                      )}

                      {selectedDiscount && (
                        <button
                          onClick={handleRemoveDiscount}
                          className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition mb-4"
                        >
                          Bỏ chọn mã giảm giá
                        </button>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div
                      className={`p-6 rounded-lg border transition-colors ${
                        themeMode === "dark"
                          ? "bg-blue-900/20 border-blue-700"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p
                        className={`transition-colors ${
                          themeMode === "dark"
                            ? "text-blue-300"
                            : "text-blue-700"
                        }`}
                      >
                        💳{" "}
                        <span className="font-semibold">
                          Phương thức thanh toán:
                        </span>{" "}
                        Thanh toán khi nhận hàng
                      </p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">📋 Danh sách sản phẩm:</h3>
                      {cart.cartItems.map((item) => (
                        <div
                          key={item.id}
                          className={`flex justify-between p-3 rounded-lg transition-colors ${
                            themeMode === "dark" ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <span>
                            {item.product.name} x {item.quantity}
                          </span>
                          <span className="font-semibold">
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                            ₫
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className={`flex-1 py-3 border-2 rounded-lg hover:transition font-semibold ${
                          themeMode === "dark"
                            ? "border-gray-700 text-gray-300 hover:bg-gray-700"
                            : "border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        ← Quay lại
                      </button>
                      <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "⏳ Đang xử lý..." : "✓ Xác nhận & Đặt hàng"}
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold mb-2">
                      Đặt hàng thành công!
                    </h2>
                    <p
                      className={`mb-6 transition-colors ${
                        themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm
                      nhất.
                    </p>
                    <p
                      className={`text-sm transition-colors ${
                        themeMode === "dark" ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Đang chuyển hướng tới trang xác nhận...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div
              className={`rounded-2xl p-8 border h-fit transition-colors sticky top-8 ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2 className="text-xl font-bold mb-6">💰 Tóm tắt đơn hàng</h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {(item.product.price * item.quantity).toLocaleString()}₫
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div
                className={`border-t my-4 ${
                  themeMode === "dark" ? "border-gray-700" : "border-gray-200"
                }`}
              ></div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString()}₫
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Giảm giá</span>
                    <span className="font-semibold">
                      -{discountAmount.toLocaleString()}₫
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold">
                    {shippingFee.toLocaleString()}₫
                  </span>
                </div>

                <div
                  className={`border-t pt-3 flex justify-between font-bold text-base ${
                    themeMode === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span>Tổng cộng</span>
                  <span className="text-indigo-600">
                    {total.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
