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
      });
    } else {
      setFormData((prev) => ({ ...prev, isActive: true }));
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
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên giảm giá không được để trống!");
      return;
    }

    const action = isEditMode
      ? updateDiscount({ id: discount.id, data: formData })
      : createDiscount(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Giảm giá đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`);
        onSuccess();
      })
      .catch((err) => {
        toast.error(`Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} giảm giá: ${err.message}`);
      });
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-colors`;
  const labelClass = `text-sm mb-1 block transition-colors ${themeMode === "dark" ? "text-gray-300" : "text-gray-600"}`;
  const modalBg = `bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-lg transition-colors`;
  const btnCancelClass = `px-4 py-2 border rounded-lg transition-colors ${
    themeMode === "dark" ? "border-gray-600 text-gray-200 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"
  }`;
  const btnSubmitClass = `px-4 py-2 rounded-lg text-white ${
    themeMode === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-600 hover:bg-indigo-700"
  }`;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-start z-50 pt-12 px-4">
      <div ref={modalRef} className={modalBg}>
        <h2 className={`text-lg font-semibold mb-4 transition-colors ${themeMode === "dark" ? "text-gray-100" : "text-gray-800"}`}>
          {isEditMode ? "Sửa giảm giá" : "Thêm giảm giá mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Tên</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nhập tên giảm giá..." className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Tiêu đề</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Nhập tiêu đề..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mô tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Nhập mô tả..." className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Số tiền giảm</label>
              <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleChange} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phần trăm (%)</label>
              <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} min="0" max="100" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Loại</label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                <option value="FIXED">Cố định</option>
                <option value="PERCENT">Phần trăm</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Trạng thái</label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="accent-indigo-500" />
                Kích hoạt
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Bắt đầu</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Kết thúc</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Số lần dùng</label>
              <input type="number" name="usageCount" value={formData.usageCount} onChange={handleChange} min="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Số lần tối đa</label>
              <input type="number" name="maxUsage" value={formData.maxUsage} onChange={handleChange} min="0" className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onCancel} className={btnCancelClass}>
              Hủy
            </button>
            <button type="submit" className={btnSubmitClass}>
              {isEditMode ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountForm;
