import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectThemeMode } from "../slices/ThemeSlice";
import { getImageUrl } from "../utils/imageUrl";
import { API_BASE_URL } from "../config/api";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import CancelRequestModal from "./CancelRequestModal";
import ReturnRequestModal from "./ReturnRequestModal";

export default function OrderCard({ order, maxItems, actionType = "detail" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [hasCancelRequest, setHasCancelRequest] = useState(false);
  const [hasReturnRequest, setHasReturnRequest] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/requests?orderId=${order.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const requests = data.result || [];
          const cancelRequest = requests.find((req) => req.type === "CANCEL");
          const returnRequest = requests.find((req) => req.type === "RETURN");
          setHasCancelRequest(!!cancelRequest);
          setHasReturnRequest(!!returnRequest);
        }
      } catch (error) {
        console.error("Lỗi khi tải requests:", error);
      }
    };

    fetchRequests();
  }, [order.id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "SHIPPING":
      case "IN_TRANSIT":
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
      SHIPPING:
        "text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300",
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

  const displayedItems = maxItems
    ? order.orderItems?.slice(0, maxItems)
    : order.orderItems;
  const hasMore = maxItems && order.orderItems?.length > maxItems;

  const handleRequestCancel = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          order: { id: order.id },
          user: { id: order.user?.id },
          type: "CANCEL",
          reason: `${formData.reason}${
            formData.description ? `\n\nChi tiết: ${formData.description}` : ""
          }`,
        }),
      });

      if (response.ok) {
        toast.success("Yêu cầu hủy đơn đã được gửi!");
        setHasCancelRequest(true);
        // Refresh orders list
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error(
          "Lỗi khi gửi yêu cầu hủy đơn:",
          response.status,
          errorText
        );
        toast.error(
          `Có lỗi xảy ra: ${response.status} - ${
            errorText || "Vui lòng thử lại."
          }`
        );
      }
    } catch (error) {
      console.error("Lỗi network:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleRequestReturn = async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          order: { id: order.id },
          user: { id: order.user?.id },
          type: "RETURN",
          reason: `${
            formData.returnMethod === "exchange" ? "Đổi hàng" : "Hoàn tiền"
          }: ${formData.reason}${
            formData.description ? `\n\nChi tiết: ${formData.description}` : ""
          }`,
        }),
      });

      if (response.ok) {
        toast.success("Yêu cầu đổi/trả đã được gửi!");
        setHasReturnRequest(true);
        // Refresh orders list
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error(
          "Lỗi khi gửi yêu cầu đổi/trả:",
          response.status,
          errorText
        );
        toast.error(
          `Có lỗi xảy ra: ${response.status} - ${
            errorText || "Vui lòng thử lại."
          }`
        );
      }
    } catch (error) {
      console.error("Lỗi network:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div
      className={`rounded-lg border transition-all ${
        themeMode === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Dòng 1: #id, ngày đặt bên trái và trạng thái bên phải */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">#{order.id}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusIcon(order.status)}
          {getStatusText(order.status)}
        </div>
      </div>

      {/* Dòng 2: thông tin sản phẩm */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          {displayedItems?.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={
                  item.product?.image
                    ? getImageUrl(item.product.image)
                    : "https://via.placeholder.com/60"
                }
                alt={item.product?.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product?.name}</p>
                {(item.color || item.size) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.color && `Màu: ${item.color}`}
                    {item.size && `, Size: ${item.size}`}
                  </p>
                )}
                <p className="text-sm font-medium">
                  {item.unitPrice?.toLocaleString()}₫
                </p>
              </div>
              <div className="text-right flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  x{item.quantity}
                </span>
                <span className="text-sm font-semibold">
                  {item.subTotal?.toLocaleString()}₫
                </span>
              </div>
            </div>
          ))}
          {hasMore && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Và {order.orderItems.length - maxItems} sản phẩm khác...
            </p>
          )}
        </div>
      </div>

      {/* Dòng 3: tổng tiền bên phải */}
      <div className="px-4 py-3 flex justify-end">
        <div className="text-right">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
            Tổng tiền ({order.orderItems?.length} sản phẩm):
          </span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {order.total?.toLocaleString()}₫
          </span>
        </div>
      </div>

      {/* Dòng 4: nút action */}
      <div className="px-4 py-3 flex justify-end items-center">
        <div className="flex items-center gap-3">
          {(order.status === "PENDING" || order.status === "CONFIRMED") && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={hasCancelRequest}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                hasCancelRequest
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {hasCancelRequest ? "Đã gửi yêu cầu hủy" : "Yêu cầu hủy đơn"}
            </button>
          )}
          {order.status === "DELIVERED" && (
            <button
              onClick={() => setShowReturnModal(true)}
              disabled={hasReturnRequest}
              className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                hasReturnRequest
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {hasReturnRequest ? "Đã gửi yêu cầu đổi/trả" : "Yêu cầu đổi/trả"}
            </button>
          )}
          {actionType === "detail" && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/orders/${order.id}`);
              }}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Xem chi tiết
            </a>
          )}
          {actionType === "tracking" && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/orders/${order.id}/tracking`);
              }}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Xem chi tiết
            </a>
          )}
        </div>
      </div>

      {/* Modals */}
      <CancelRequestModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleRequestCancel}
        orderId={order.id}
      />
      <ReturnRequestModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSubmit={handleRequestReturn}
        orderId={order.id}
      />
    </div>
  );
}
