import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { createStock, updateStock, getStocks } from "../../slices/StockSlice";
import { toast } from "react-toastify";

const StockForm = ({ showForm, setShowForm, stock, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const modalRef = useRef(null);

  const isEditMode = stock !== null;

  useEffect(() => {
    if (showForm && isEditMode) {
      setFormData({
        name: stock.name || "",
        email: stock.email || "",
        phone: stock.phone || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [showForm, stock, isEditMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowForm]);

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
        toast.success(
          `Kho đã được ${isEditMode ? "cập nhật" : "tạo"} thành công!`
        );
        onSuccess(); // Callback để đóng form và refresh list
      })
      .catch((err) => {
        toast.error(
          `Lỗi khi ${isEditMode ? "cập nhật" : "tạo"} kho: ${err.message}`
        );
      });
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg animate-fadeIn"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {isEditMode ? "Sửa thông tin kho" : "Thêm kho mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Tên kho</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên kho..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email kho..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition hover:cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition hover:cursor-pointer"
            >
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockForm;
