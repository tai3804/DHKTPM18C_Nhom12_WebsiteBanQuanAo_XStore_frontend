// ProductTypeForm.jsx
import React, { useRef, useEffect } from "react";

export default function ProductTypeForm({
  showForm,
  setShowForm,
  selectedType,
  formData,
  setFormData,
  handleSubmit,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowForm]);

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg animate-fadeIn"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {selectedType ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên loại sản phẩm */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Tên loại sản phẩm
            </label>
            <input
              type="text"
              placeholder="Nhập tên loại sản phẩm..."
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Mô tả</label>
            <textarea
              placeholder="Nhập mô tả loại sản phẩm..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
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
              {selectedType ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
