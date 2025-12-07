import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { selectThemeMode } from "../slices/ThemeSlice";
import { API_BASE_URL } from "../config/api";
import { getImageUrl } from "../utils/imageUrl";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  DownloadCloud,
} from "lucide-react";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

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
        } else {
          toast.error("Không thể tải chi tiết đơn hàng");
          navigate("/orders");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Lỗi khi tải chi tiết đơn hàng");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, user, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "AWAITING_PAYMENT":
        return <Clock className="w-6 h-6 text-purple-500" />;
      case "CONFIRMED":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "PROCESSING":
        return <Package className="w-6 h-6 text-indigo-500" />;
      case "SHIPPING":
      case "IN_TRANSIT":
        return <Truck className="w-6 h-6 text-orange-500" />;
      case "PENDING_RECEIPT":
        return <Clock className="w-6 h-6 text-teal-500" />;
      case "DELIVERED":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "RETURN_REQUESTED":
        return <XCircle className="w-6 h-6 text-pink-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",
      AWAITING_PAYMENT: "Chờ thanh toán",
      CONFIRMED: "Đã xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao hàng",
      IN_TRANSIT: "Đang giao hàng",
      PENDING_RECEIPT: "Chờ nhận hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
      RETURN_REQUESTED: "Yêu cầu đổi/trả",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING:
        "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
      AWAITING_PAYMENT:
        "text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
      CONFIRMED:
        "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
      PROCESSING:
        "text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300",
      SHIPPING:
        "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300",
      IN_TRANSIT:
        "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300",
      PENDING_RECEIPT:
        "text-teal-600 bg-teal-100 dark:bg-teal-900 dark:text-teal-300",
      DELIVERED:
        "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300",
      CANCELLED: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300",
      RETURN_REQUESTED:
        "text-pink-600 bg-pink-100 dark:bg-pink-900 dark:text-pink-300",
    };
    return (
      colorMap[status] ||
      "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const handlePayment = async () => {
    if (order.paymentMethod !== "VNPAY") {
      toast.error("Chỉ hỗ trợ thanh toán VNPay cho đơn hàng này");
      return;
    }

    try {
      setLoading(true);
      toast.info("Đang tạo liên kết thanh toán...");

      const paymentRequest = {
        vnp_OrderInfo: `Thanh toán đơn hàng ${order.id}`,
        amount: order.total,
        ordertype: "billpayment",
        bankcode: "",
        language: "vn",
        txt_billing_fullname:
          order.recipientName ||
          user?.firstName + " " + user?.lastName ||
          "Customer",
        txt_billing_mobile: order.phoneNumber || "0123456789",
        txt_billing_email: user?.account?.username || "customer@example.com",
      };

      const response = await fetch(`${API_BASE_URL}/api/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentRequest),
      });

      const data = await response.json();

      if (data.code === "00") {
        toast.success("Đang mở trang thanh toán VNPay...");
        setTimeout(() => {
          window.open(data.data, "_blank");
        }, 1000);
      } else {
        toast.error(data.message || "Lỗi tạo thanh toán VNPay");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Lỗi thanh toán: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
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
      setPdfLoading(false);
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
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p
            className={`transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Đang tải chi tiết đơn hàng...
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
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Quay lại danh sách đơn hàng
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/orders")}
            className={`flex items-center gap-2 transition-colors ${
              themeMode === "dark"
                ? "text-emerald-400 hover:text-emerald-300"
                : "text-emerald-600 hover:text-emerald-700"
            }`}
          >
            <ArrowLeft size={20} />
            Quay lại đơn hàng
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-2xl p-8 border transition-colors ${
              themeMode === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Package size={32} />
                Chi tiết đơn hàng #{order.id}
              </h1>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                <span className="font-medium">
                  {getStatusText(order.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
              {/* Order Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin đơn hàng
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Mã đơn hàng:
                      </span>
                      <span className="font-medium">#{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Ngày đặt:
                      </span>
                      <span className="font-medium">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Phương thức thanh toán:
                      </span>
                      <span className="font-medium">
                        {order.paymentMethod || "COD"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin giao hàng
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Người nhận:
                      </span>
                      <span className="font-medium">
                        {order.recipientName || user?.fullName || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Số điện thoại:
                      </span>
                      <span className="font-medium">{order.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Địa chỉ:
                      </span>
                      <span className="font-medium">
                        {order.shippingAddress}
                      </span>
                    </div>
                    {order.notes && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Ghi chú:
                        </span>
                        <span className="font-medium">{order.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h3>
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-6 p-4 rounded-lg border ${
                      themeMode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    {/* Product Image */}
                    <div className="shrink-0">
                      <img
                        src={
                          getImageUrl(item.product?.image) ||
                          "https://via.placeholder.com/80x80?text=No+Image"
                        }
                        alt={item.product?.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {item.product?.name}
                      </h4>
                      {(item.color || item.size) && (
                        <p
                          className={`text-sm mt-1 ${
                            themeMode === "dark"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {item.color && `Màu: ${item.color}`}
                          {item.color && item.size && " • "}
                          {item.size && `Size: ${item.size}`}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">
                          Số lượng:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </span>
                        <span className="text-sm">
                          Đơn giá:{" "}
                          <span className="font-medium">
                            {item.unitPrice?.toLocaleString()}₫
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {item.subTotal?.toLocaleString()}₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{(order.subtotal || 0).toLocaleString()}₫</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{order.discountAmount.toLocaleString()}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{(order.shippingFee || 0).toLocaleString()}₫</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-xl">
                    <span>Tổng cộng:</span>
                    <span className="text-emerald-600">
                      {order.total?.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              {order.status === "AWAITING_PAYMENT" && (
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <span>💳</span>
                  )}
                  Thanh toán ngay
                </button>
              )}

              <button
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {pdfLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <DownloadCloud size={20} />
                )}
                Xuất PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
