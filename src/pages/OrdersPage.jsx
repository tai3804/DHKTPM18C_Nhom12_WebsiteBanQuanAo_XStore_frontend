import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectThemeMode } from "../slices/ThemeSlice";
import { fetchOrders } from "../slices/OrderSlice";
import { API_BASE_URL } from "../config/api";
import OrderCard from "../components/OrderCard";
import { Package, Truck } from "lucide-react";

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

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package size={32} />
            Đơn hàng của tôi
          </h1>
          <button
            onClick={() => navigate("/orders/tracking")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Truck size={18} />
            Theo dõi đơn hàng
          </button>
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
        ) : orders && orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} actionType="detail" />
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
