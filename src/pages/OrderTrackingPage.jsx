import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectThemeMode } from "../slices/ThemeSlice";
import { fetchOrders } from "../slices/OrderSlice";
import { API_BASE_URL } from "../config/api";
import OrderCard from "../components/OrderCard";
import { Package } from "lucide-react";

export default function OrderTrackingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const themeMode = useSelector(selectThemeMode);
  const { user } = useSelector((state) => state.auth);
  const { orders, loading } = useSelector((state) => state.order);

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(fetchOrders());
  }, [user, dispatch, navigate]);

  const filterOrders = () => {
    if (activeTab === "all") return orders || [];
    if (activeTab === "pending")
      return (orders || []).filter((order) => order.status === "PENDING");
    if (activeTab === "awaiting_payment")
      return (orders || []).filter(
        (order) => order.status === "AWAITING_PAYMENT"
      );
    if (activeTab === "confirmed")
      return (orders || []).filter((order) => order.status === "CONFIRMED");
    if (activeTab === "shipping")
      return (orders || []).filter(
        (order) => order.status === "SHIPPING" || order.status === "IN_TRANSIT"
      );
    if (activeTab === "delivered")
      return (orders || []).filter((order) => order.status === "DELIVERED");
    if (activeTab === "cancelled")
      return (orders || []).filter((order) => order.status === "CANCELLED");
    if (activeTab === "return")
      return (orders || []).filter(
        (order) => order.status === "RETURN_REQUEST"
      ); // assuming this status exists
    return orders || [];
  };

  const tabs = [
    { id: "all", label: "Tất cả", count: orders?.length || 0 },
    {
      id: "pending",
      label: "Chờ xác nhận",
      count: (orders || []).filter((o) => o.status === "PENDING").length,
    },
    {
      id: "awaiting_payment",
      label: "Chờ thanh toán",
      count: (orders || []).filter((o) => o.status === "AWAITING_PAYMENT")
        .length,
    },
    {
      id: "confirmed",
      label: "Đã xác nhận",
      count: (orders || []).filter((o) => o.status === "CONFIRMED").length,
    },
    {
      id: "shipping",
      label: "Đang giao hàng",
      count: (orders || []).filter(
        (o) => o.status === "SHIPPING" || o.status === "IN_TRANSIT"
      ).length,
    },
    {
      id: "delivered",
      label: "Đã giao",
      count: (orders || []).filter((o) => o.status === "DELIVERED").length,
    },
    {
      id: "cancelled",
      label: "Đã hủy",
      count: (orders || []).filter((o) => o.status === "CANCELLED").length,
    },
    {
      id: "return",
      label: "Yêu cầu đổi/trả",
      count: (orders || []).filter((o) => o.status === "RETURN_REQUEST").length,
    },
  ];

  if (!user) {
    return null;
  }

  const filteredOrders = filterOrders();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        themeMode === "dark"
          ? "bg-linear-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-linear-to-b from-white to-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Package size={32} />
          Theo dõi đơn hàng
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : themeMode === "dark"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

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
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                maxItems={2}
                actionType="tracking"
              />
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
            <h2 className="text-xl font-semibold mb-2">
              Không có đơn hàng nào
            </h2>
            <p
              className={`mb-4 ${
                themeMode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Không có đơn hàng trong danh mục này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
