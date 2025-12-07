import { X, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";
import { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";

const OrderDetailModal = ({ order, onClose }) => {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const [isExporting, setIsExporting] = useState(false);

  const statusMap = {
    DELIVERED: "Đã giao",
    CANCELLED: "Đã hủy",
    SHIPPING: "Đang giao",
    PENDING: "Chờ xử lý",
  };

  if (!order) {
    console.log("Modal không nhận order:", order);
    return null;
  }

  const {
    id,
    user,
    orderItems = [],
    discounts = [],
    subtotal = 0,
    discountAmount = 0,
    shippingFee = 0,
    total = 0,
    paymentMethod,
    shippingAddress,
    phoneNumber,
    notes,
    status,
    createdAt,
  } = order;

  // Xuất PDF từ backend
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để xuất PDF");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          toast.error("Bạn không có quyền xuất PDF đơn hàng này");
        } else if (response.status === 404) {
          toast.error("Không tìm thấy đơn hàng");
        } else {
          toast.error("Không thể xuất PDF. Vui lòng thử lại!");
        }
        return;
      }

      // Lấy blob từ response
      const blob = await response.blob();

      // Tạo URL từ blob
      const url = window.URL.createObjectURL(blob);

      // Tạo link download tạm thời
      const link = document.createElement("a");
      link.href = url;
      link.download = `don-hang-${id}.pdf`;
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Đã tải xuống PDF thành công!");
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
      toast.error("Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded-xl w-[90%] max-w-4xl p-6 relative overflow-y-auto max-h-[90vh] shadow-xl transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header with actions */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Chi tiết đơn hàng #{id}
          </h2>

          <div className="flex items-center gap-2">
            {/* Export PDF button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isExporting ? "opacity-50 cursor-not-allowed" : ""
              } ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              title="Xuất PDF"
            >
              <Download
                size={18}
                className={isExporting ? "animate-bounce" : ""}
              />
              {isExporting ? "Đang xuất..." : "Xuất PDF"}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Customer info */}
          <div
            className={`mb-6 p-4 rounded-lg space-y-2 ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-800"
            }`}
          >
            <h3
              className={`font-semibold text-lg mb-3 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Thông tin khách hàng
            </h3>
            <p>
              <strong>Khách hàng:</strong> {user?.account?.username || "—"}
            </p>
            <p>
              <strong>SĐT:</strong> {phoneNumber || "—"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {shippingAddress || "—"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  status === "DELIVERED"
                    ? "bg-green-100 text-green-800"
                    : status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : status === "SHIPPING"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {statusMap[status] || status || "—"}
              </span>
            </p>
            <p>
              <strong>Ngày tạo:</strong> {createdAt || "—"}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {paymentMethod == "CASH" ? "Tiền mặt" : paymentMethod || "—"}
            </p>
            {notes && (
              <p>
                <strong>Ghi chú:</strong> {notes}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3
              className={`font-semibold text-lg mb-3 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Sản phẩm đặt hàng
            </h3>
            <div className="overflow-x-auto rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-200'}">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr
                    className={`${
                      isDark
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {[
                      "Ảnh",
                      "Sản phẩm",
                      "Màu",
                      "Size",
                      "SL",
                      "Giá đơn vị",
                      "Subtotal",
                    ].map((title, idx) => (
                      <th key={idx} className="px-4 py-3 text-sm font-semibold">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b ${
                        isDark
                          ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      } transition-colors duration-200`}
                    >
                      <td className="px-4 py-3">
                        {item.product?.image ? (
                          <img
                            src={getImageUrl(item.product.image)}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">{item.product?.name || "—"}</td>
                      <td className="px-4 py-3">{item.color || "—"}</td>
                      <td className="px-4 py-3">{item.size || "—"}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3">
                        {item.unitPrice?.toLocaleString("vi-VN") || 0} ₫
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {item.subTotal?.toLocaleString("vi-VN") || 0} ₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discounts */}
          {discounts.length > 0 && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isDark
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <h3
                className={`font-semibold text-lg mb-3 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Giảm giá áp dụng
              </h3>
              <ul className="space-y-2">
                {discounts.map((d) => (
                  <li
                    key={d.id || d._id}
                    className={`flex items-center gap-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-mono text-sm">
                      {d.code}
                    </span>
                    <span>-</span>
                    <span className="font-semibold">
                      {d.type === "PERCENT"
                        ? `${d.discountPercent}%`
                        : `${d.discountAmount.toLocaleString("vi-VN")} ₫`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Summary */}
          <div
            className={`p-4 rounded-lg border-2 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-blue-50 border-blue-200 text-gray-800"
            }`}
          >
            <h3
              className={`font-semibold text-lg mb-3 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Tổng kết đơn hàng
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-semibold">
                  {subtotal.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Giảm giá:</span>
                <span className="font-semibold">
                  -{discountAmount.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold">
                  {shippingFee.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div
                className={`flex justify-between text-xl pt-3 border-t ${
                  isDark ? "border-gray-600" : "border-blue-300"
                }`}
              >
                <strong>Tổng cộng:</strong>
                <strong
                  className={`${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  {total.toLocaleString("vi-VN")} ₫
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
