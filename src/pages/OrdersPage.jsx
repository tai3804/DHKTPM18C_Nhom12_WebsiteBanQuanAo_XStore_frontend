import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectThemeMode } from "../slices/ThemeSlice";
import { fetchOrders } from "../slices/OrderSlice";
import { API_BASE_URL } from "../config/api";
import { getImageUrl } from "../utils/imageUrl";
import {
  Package,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(fetchOrders());
  }, [user, dispatch, navigate]);

  const handleTrackOrder = (orderId) => {
    navigate(`/orders/${orderId}/tracking`);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "SHIPPING":
        return <Truck className="w-5 h-5 text-orange-500" />;
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao hàng",
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
      SHIPPING:
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

  if (!user) {
    return null;
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
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 transition-colors ${
              themeMode === "dark"
                ? "text-emerald-400 hover:text-emerald-300"
                : "text-emerald-600 hover:text-emerald-700"
            }`}
          >
            <ArrowLeft size={20} />
            Quay lại trang chủ
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package size={32} />
          Đơn hàng của tôi
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p
              className={`${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Đang tải đơn hàng...
            </p>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => handleViewOrder(order.id)}
                className={`p-6 rounded-lg border cursor-pointer transition-all ${
                  themeMode === "dark"
                    ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">#{order.id}</span>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ngày đặt
                    </span>
                    <p className="mt-1">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Tổng tiền
                    </span>
                    <p className="mt-1 font-semibold text-lg">
                      {order.total?.toLocaleString()}₫
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Sản phẩm
                    </span>
                    <p className="mt-1">
                      {order.orderItems?.length || 0} sản phẩm
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-4 justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewOrder(order.id);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                  >
                    Xem chi tiết
                  </button>
                  {order.status !== "DELIVERED" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackOrder(order.id);
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      <Truck size={16} />
                      Theo dõi
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package
              size={48}
              className={`mx-auto mb-4 ${
                themeMode === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <h2 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h2>
            <p
              className={`mb-4 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Hãy mua sắm để tạo đơn hàng đầu tiên!
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
