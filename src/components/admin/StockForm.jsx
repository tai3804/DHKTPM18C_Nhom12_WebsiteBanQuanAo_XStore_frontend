import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStock, updateStock } from "../../slices/StockSlice";
import { toast } from "react-toastify";
import { selectThemeMode } from "../../slices/ThemeSlice";

const StockForm = ({ stock, onCancel, onSuccess }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const modalRef = useRef(null);
  const isEditMode = !!stock;

  // Set data khi mở form
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: stock.name || "",
        email: stock.email || "",
        phone: stock.phone || "",
      });
    } else {
      setFormData({ name: "", email: "", phone: "" });
    }
  }, [stock, isEditMode]);

  // Click ngoài modal đóng
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Tên kho không được để trống!");
      return;
    }

    const action = isEditMode
      ? updateStock({ id: stock.id, stockData: formData })
      : createStock(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Kho đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`);
        onSuccess();
      })
      .catch((err) => {
        toast.error(`Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} kho: ${err.message}`);
      });
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:border-transparent transition-colors duration-300 ${
    themeMode === "dark"
      ? "border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-gray-400"
      : "border-gray-300 bg-white text-gray-900 focus:ring-gray-800"
  }`;

  const buttonCancelClass = `px-4 py-2 border rounded-lg transition-colors duration-300 hover:cursor-pointer ${
    themeMode === "dark"
      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
      : "border-gray-300 text-gray-700 hover:bg-gray-100"
  }`;

  const buttonSubmitClass = `px-4 py-2 rounded-lg text-white transition-colors duration-300 hover:cursor-pointer ${
    themeMode === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-900 hover:bg-gray-800"
  }`;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 animate-fadeIn" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div
        ref={modalRef}
        className={`rounded-2xl p-6 w-full max-w-md shadow-lg transform transition-all scale-95 animate-fadeIn ${
          themeMode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-100" : "text-gray-800"
        }`}>
          {isEditMode ? "Sửa thông tin kho" : "Thêm kho mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`text-sm mb-1 block transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Tên kho
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên kho..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={`text-sm mb-1 block transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email kho..."
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={`text-sm mb-1 block transition-colors duration-300 ${
              themeMode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className={inputClass}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onCancel} className={buttonCancelClass}>
              Hủy
            </button>
            <button type="submit" className={buttonSubmitClass}>
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
