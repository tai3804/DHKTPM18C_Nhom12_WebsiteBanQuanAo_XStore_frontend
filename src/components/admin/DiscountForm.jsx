import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDiscount, updateDiscount } from "../../slices/DiscountSlice";
import { toast } from "react-toastify";
import { selectThemeMode } from "../../slices/ThemeSlice";

const DiscountForm = ({ discount = null, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const modalRef = useRef(null);
  const isEditMode = !!discount;

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    discountAmount: 0,
    discountPercent: 0,
    type: "FIXED", // FIXED hoặc PERCENT
    usageCount: 0,
    maxUsage: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    validUserType: "", // COPPER, SILVER, GOLD, PLATINUM hoặc "" (tất cả)
    category: "PRODUCT", // PRODUCT hoặc SHIPPING
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: discount.name || "",
        title: discount.title || "",
        description: discount.description || "",
        discountAmount: discount.discountAmount || 0,
        discountPercent: discount.discountPercent || 0,
        type: discount.type || "FIXED",
        usageCount: discount.usageCount || 0,
        maxUsage: discount.maxUsage || 0,
        startDate: discount.startDate ? discount.startDate.slice(0, 10) : "",
        endDate: discount.endDate ? discount.endDate.slice(0, 10) : "",
        isActive: discount.isActive ?? true,
        validUserType: discount.validUserType || "",
        category: discount.category || "PRODUCT",
      });
    } else {
      setFormData((prev) => ({ ...prev, isActive: true, validUserType: "" }));
    }
  }, [discount, isEditMode]);

  // Click outside modal để đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onCancel();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên giảm giá không được để trống!");
      return;
    }

    // Chuẩn bị dữ liệu: nếu validUserType là "", gửi null
    const submitData = {
      ...formData,
      validUserType: formData.validUserType || null,
    };

    console.log("📤 Submitting discount data:", submitData);
    console.log(
      "✅ isActive value:",
      submitData.isActive,
      typeof submitData.isActive
    );

    const action = isEditMode
      ? updateDiscount({ id: discount.id, discountData: submitData })
      : createDiscount(submitData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(
          `Giảm giá đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`
        );
        onSuccess();
      })
      .catch((err) => {
        toast.error(
          `Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} giảm giá: ${err.message}`
        );
      });
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
    themeMode === "dark"
      ? "bg-gray-700 text-gray-100 border-gray-600"
      : "bg-white text-gray-900 border-gray-300"
  }`;
  const labelClass = `text-sm mb-1 block transition-colors ${
    themeMode === "dark" ? "text-gray-300" : "text-gray-600"
  }`;
  const modalBg = `rounded-2xl p-8 w-full max-w-2xl shadow-xl border animate-fadeIn transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
    themeMode === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-100"
  }`;
  const btnCancelClass = `px-5 py-2 rounded-lg border transition cursor-pointer ${
    themeMode === "dark"
      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
      : "border-gray-200 text-gray-600 hover:bg-gray-100"
  }`;
  const btnSubmitClass = `px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer font-medium`;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className={modalBg}>
        <h2
          className={`text-2xl font-bold text-center pb-4 mb-6 border-b transition-colors duration-300 ${
            themeMode === "dark"
              ? "text-gray-100 border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          {isEditMode ? "Chỉnh sửa giảm giá" : "Thêm giảm giá mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên giảm giá..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Số tiền giảm</label>
              <input
                type="number"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phần trăm (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={formData.discountPercent}
                onChange={handleChange}
                min="0"
                max="100"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Loại</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="FIXED">Cố định</option>
                <option value="PERCENT">Phần trăm</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Bậc user hợp lệ</label>
              <select
                name="validUserType"
                value={formData.validUserType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Tất cả</option>
                <option value="COPPER">Đồng</option>
                <option value="SILVER">Bạc</option>
                <option value="GOLD">Vàng</option>
                <option value="PLATINUM">Bạch kim</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Loại giảm</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="PRODUCT">Giảm tiền sản phẩm</option>
                <option value="SHIPPING">Giảm phí vận chuyển</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Trạng thái</label>
              <label
                className={`flex items-center gap-2 mt-2 transition-colors ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="accent-indigo-500"
                />
                Kích hoạt
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bắt đầu</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Kết thúc</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Số lần dùng</label>
              <input
                type="number"
                name="usageCount"
                value={formData.usageCount}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Số lần tối đa</label>
              <input
                type="number"
                name="maxUsage"
                value={formData.maxUsage}
                onChange={handleChange}
                min="0"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onCancel} className={btnCancelClass}>
              Hủy
            </button>
            <button type="submit" className={btnSubmitClass}>
              {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountForm;
