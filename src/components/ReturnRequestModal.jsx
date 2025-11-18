import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../slices/ThemeSlice";
import { X } from "lucide-react";

export default function ReturnRequestModal({
  isOpen,
  onClose,
  onSubmit,
  orderId,
}) {
  const themeMode = useSelector(selectThemeMode);
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    returnMethod: "exchange", // exchange or refund
  });
  const [loading, setLoading] = useState(false);

  const reasons = [
    "Sản phẩm bị hỏng/hư",
    "Sản phẩm không đúng như mô tả",
    "Giao sai sản phẩm",
    "Thay đổi ý định",
    "Lý do cá nhân khác",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason.trim()) {
      alert("Vui lòng chọn lý do đổi/trả");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ reason: "", description: "", returnMethod: "exchange" });
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ reason: "", description: "", returnMethod: "exchange" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60    bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`relative w-full max-w-md mx-4 rounded-lg shadow-xl ${
          themeMode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Yêu cầu đổi/trả hàng</h2>
          <button
            onClick={handleClose}
            className={`p-2 rounded-full transition-colors ${
              themeMode === "dark"
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Loại yêu cầu <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="exchange"
                  checked={formData.returnMethod === "exchange"}
                  onChange={(e) =>
                    setFormData({ ...formData, returnMethod: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Đổi hàng</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="refund"
                  checked={formData.returnMethod === "refund"}
                  onChange={(e) =>
                    setFormData({ ...formData, returnMethod: e.target.value })
                  }
                  className="mr-2"
                />
                <span className="text-sm">Hoàn tiền</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Lý do đổi/trả <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                themeMode === "dark"
                  ? "border-gray-600 bg-gray-700 text-gray-100"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
              required
            >
              <option value="">Chọn lý do...</option>
              {reasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mô tả chi tiết (tùy chọn)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Vui lòng mô tả chi tiết vấn đề với sản phẩm..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none ${
                themeMode === "dark"
                  ? "border-gray-600 bg-gray-700 text-gray-100"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />
          </div>

          {/* Order Info */}
          <div
            className={`p-3 rounded-lg ${
              themeMode === "dark" ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mã đơn hàng: #{orderId}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Yêu cầu sẽ được admin xem xét trong vòng 24-48 giờ
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                themeMode === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
