import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { selectThemeMode } from "../slices/ThemeSlice";
import { API_BASE_URL } from "../config/api";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
  User,
} from "lucide-react";

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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
          toast.error("Không thể tải thông tin đơn hàng");
          navigate("/orders");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("Lỗi khi tải thông tin đơn hàng");
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
      case "CONFIRMED":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "IN_TRANSIT":
        return <Truck className="w-6 h-6 text-orange-500" />;
      case "DELIVERED":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      IN_TRANSIT: "Đang giao hàng",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      PENDING:
        "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
      CONFIRMED:
        "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
      IN_TRANSIT:
        "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300",
      DELIVERED:
        "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300",
      CANCELLED: "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300",
    };
    return (
      colorMap[status] ||
      "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const getTrackingSteps = () => {
    return [
      {
        status: "PENDING",
        label: "Đơn hàng đã đặt",
        desc: "Đơn hàng của bạn đã được tạo thành công",
        time: order?.createdAt
          ? new Date(order.createdAt).toLocaleString("vi-VN")
          : null,
      },
      {
        status: "CONFIRMED",
        label: "Đã xác nhận",
        desc: "Đơn hàng đã được xác nhận và đang chuẩn bị",
        time: null,
      },
      {
        status: "IN_TRANSIT",
        label: "Đang giao hàng",
        desc: "Đơn hàng đang được vận chuyển đến địa chỉ của bạn",
        time: null,
      },
      {
        status: "DELIVERED",
        label: "Đã giao thành công",
        desc: "Đơn hàng đã được giao thành công",
        time: null,
      },
    ];
  };

  const getCurrentStepIndex = () => {
    const statusOrder = ["PENDING", "CONFIRMED", "IN_TRANSIT", "DELIVERED"];
    return statusOrder.indexOf(order?.status);
  };

  if (!user) {
    return null;
  }

  if (loading) {
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
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p
              className={`transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Đang tải thông tin theo dõi...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
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
        <Footer />
      </>
    );
  }

  const trackingSteps = getTrackingSteps();
  const currentStepIndex = getCurrentStepIndex();

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
              onClick={() => navigate(`/orders/${orderId}`)}
              className={`flex items-center gap-2 transition-colors ${
                themeMode === "dark"
                  ? "text-emerald-400 hover:text-emerald-300"
                  : "text-emerald-600 hover:text-emerald-700"
              }`}
            >
              <ArrowLeft size={20} />
              Quay lại chi tiết đơn hàng
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Order Status Header */}
            <div
              className={`rounded-2xl p-6 mb-8 border transition-colors ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Package size={32} />
                  Theo dõi đơn hàng #{order.id}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <User
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <div>
                    <p
                      className={`font-bold ${
                        themeMode === "dark" ? "text-gray-200" : "text-black"
                      }`}
                    >
                      Người nhận
                    </p>
                    <p
                      className={`${
                        themeMode === "dark" ? "text-gray-300" : "text-black"
                      }`}
                    >
                      {order.recipientName ||
                        order.shipInfo?.recipientName ||
                        order.shippingInfo?.recipientName ||
                        order.user?.account?.username ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <div>
                    <p
                      className={`font-bold ${
                        themeMode === "dark" ? "text-gray-200" : "text-black"
                      }`}
                    >
                      Số điện thoại
                    </p>
                    <p
                      className={`${
                        themeMode === "dark" ? "text-gray-300" : "text-black"
                      }`}
                    >
                      {order.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin
                    size={20}
                    className="text-gray-600 dark:text-gray-400"
                  />
                  <div>
                    <p
                      className={`${
                        themeMode === "dark" ? "text-gray-200" : "text-black"
                      } font-bold`}
                    >
                      Địa chỉ giao hàng
                    </p>
                    <p
                      className={`text-sm ${
                        themeMode === "dark" ? "text-gray-300" : "text-black"
                      }`}
                    >
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div
              className={`rounded-2xl p-8 border transition-colors ${
                themeMode === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-8 text-center ${
                  themeMode === "dark" ? "text-gray-100" : "text-black"
                }`}
              >
                Tiến trình giao hàng
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

                <div className="space-y-8">
                  {trackingSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div
                        key={step.status}
                        className="relative flex items-start gap-6"
                      >
                        {/* Timeline dot */}
                        <div
                          className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                            isCompleted
                              ? "bg-green-500 border-green-500 text-white"
                              : isCurrent
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-500"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={24} />
                          ) : isCurrent ? (
                            getStatusIcon(order.status)
                          ) : (
                            <div className="w-3 h-3 bg-current rounded-full"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`text-lg font-bold ${
                                themeMode === "dark"
                                  ? "text-gray-100"
                                  : "text-black"
                              }`}
                            >
                              {step.label}
                            </h3>
                            {step.time && (
                              <span
                                className={`text-sm ${
                                  themeMode === "dark"
                                    ? "text-gray-300"
                                    : "text-black"
                                }`}
                              >
                                {step.time}
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              themeMode === "dark"
                                ? "text-gray-300"
                                : "text-black"
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
              {order.status === "IN_TRANSIT" && (
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                    Thông tin vận chuyển
                  </h4>
                  <p className="text-sm font-medium text-blue-800">
                    Đơn hàng của bạn đang được giao. Thời gian giao hàng dự
                    kiến: 2-3 ngày làm việc.
                  </p>
                </div>
              )}

              {order.status === "DELIVERED" && (
                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-bold text-green-900 dark:text-green-200 mb-2">
                    Đơn hàng đã hoàn thành
                  </h4>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Cảm ơn bạn đã mua hàng! Nếu có vấn đề gì với sản phẩm, vui
                    lòng liên hệ với chúng tôi.
                  </p>
                </div>
              )}

              {order.status === "CANCELLED" && (
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-bold text-red-900 dark:text-red-200 mb-2">
                    Đơn hàng đã hủy
                  </h4>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Đơn hàng này đã được hủy. Nếu bạn có thắc mắc, vui lòng liên
                    hệ bộ phận chăm sóc khách hàng.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  themeMode === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                Xem chi tiết đơn hàng
              </button>
              <button
                onClick={() => navigate("/orders")}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
