import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../slices/ThemeSlice";
import { API_BASE_URL } from "../config/api";
import { CheckCircle, Home, DownloadCloud } from "lucide-react";
import { getImageUrl } from "../utils/imageUrl";
import { toast } from "react-toastify";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();
        if (data.code === 200 || response.ok) {
          setOrder(data.result);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, user, navigate]);

  const handleDownloadOrder = async () => {
    if (!orderId) {
      toast.error("Không tìm thấy mã đơn hàng");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để tải PDF");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
          return;
        } else if (response.status === 404) {
          toast.error("Không tìm thấy đơn hàng");
          return;
        } else if (response.status === 403) {
          toast.error("Bạn không có quyền tải PDF đơn hàng này");
          return;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        toast.error("File PDF trống hoặc không hợp lệ");
        return;
      }

      // Tạo URL cho blob
      const url = window.URL.createObjectURL(blob);

      // Tạo element a để download
      const a = document.createElement("a");
      a.href = url;
      a.download = `don-hang-${orderId}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);

      // Trigger download
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Đã tải xuống PDF đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi tải PDF:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        toast.error("Có lỗi xảy ra khi tải PDF. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800"
            : "bg-linear-to-b from-white to-gray-50"
        }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p
            className={`mt-4 transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Đang tải thông tin đơn hàng...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
            : "bg-linear-to-b from-white to-gray-50 text-gray-900"
        }`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Quay lại trang chủ
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
      <div className="container mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <CheckCircle size={80} className="mx-auto mb-4 text-green-500" />
          <h1 className="text-4xl font-bold mb-2">Đặt hàng thành công!</h1>
          <p
            className={`text-lg transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Order Details */}
          <div
            className={`rounded-2xl p-8 border transition-colors duration-300 ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            {/* Order ID */}
            <div className="mb-8 pb-8 border-b border-gray-700">
              <p
                className={`text-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Mã đơn hàng
              </p>
              <p className="text-2xl font-bold">{order.id}</p>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <p
                  className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Người nhận
                </p>
                <p className="font-medium">
                  {order.recipientName || user.name}
                </p>
                <p
                  className={`text-sm transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user.email}
                </p>
              </div>
              <div>
                <p
                  className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Số điện thoại
                </p>
                <p className="font-medium">{order.phoneNumber || user.phone}</p>
              </div>
              <div>
                <p
                  className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                    themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Địa chỉ giao hàng
                </p>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-8">
              <h2
                className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Danh sách sản phẩm
              </h2>
              <div className="space-y-3">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex gap-4 p-3 rounded-lg transition-colors duration-300 ${
                        themeMode === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <img
                        src={
                          item.product?.image
                            ? getImageUrl(item.product.image)
                            : "https://via.placeholder.com/80"
                        }
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        {(item.color || item.size) && (
                          <p
                            className={`text-xs transition-colors duration-300 ${
                              themeMode === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {item.color && `Màu: ${item.color}`}{" "}
                            {item.size && `Size: ${item.size}`}
                          </p>
                        )}
                        <p
                          className={`text-sm transition-colors duration-300 ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          Số lượng: {item.quantity} ×{" "}
                          {item.unitPrice?.toLocaleString()}₫
                        </p>
                      </div>
                      <p className="font-bold">
                        {item.subTotal?.toLocaleString()}₫
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>
                    {(
                      (order.total - (order.discountAmount || 0)) /
                      1.1
                    )?.toLocaleString()}
                    ₫
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{order.discountAmount?.toLocaleString()}₫</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{(order.shippingFee || 0).toLocaleString()}₫</span>
                </div>

                <div
                  className={`border-t pt-3 flex justify-between font-bold text-lg ${
                    themeMode === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span>Tổng cộng</span>
                  <span className="text-indigo-600">
                    {order.total?.toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div
              className={`p-4 rounded-lg transition-colors duration-300 ${
                themeMode === "dark" ? "bg-blue-900/30" : "bg-blue-50"
              }`}
            >
              <p
                className={`text-sm transition-colors duration-300 ${
                  themeMode === "dark" ? "text-blue-300" : "text-blue-600"
                }`}
              >
                Trạng thái: <span className="font-bold">{order.status}</span>
              </p>
              <p
                className={`text-xs mt-2 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Đơn hàng đã được tạo ngày {order.createdAt}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleDownloadOrder}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang tải...
                </>
              ) : (
                <>
                  <DownloadCloud size={18} />
                  Tải PDF
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className={`w-full py-3 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${
                themeMode === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              <Home size={18} />
              Quay lại trang chủ
            </button>
          </div>

          {/* Support */}
          <div
            className={`mt-6 p-4 rounded-lg transition-colors duration-300 ${
              themeMode === "dark" ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <p className="text-sm font-semibold mb-2">Cần giúp đỡ?</p>
            <p
              className={`text-xs transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Liên hệ chúng tôi qua email{" "}
              <a href="mailto:support@xstore.com" className="text-indigo-600">
                support@xstore.com
              </a>{" "}
              hoặc gọi{" "}
              <a href="tel:0123456789" className="text-indigo-600">
                0123 456 789
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
