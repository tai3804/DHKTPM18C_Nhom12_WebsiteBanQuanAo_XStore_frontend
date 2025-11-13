// ProductTypeForm.jsx
import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

export default function ProductTypeForm({
  showForm,
  setShowForm,
  selectedType,
  formData,
  setFormData,
  handleSubmit,
}) {
  const modalRef = useRef(null);
  const themeMode = useSelector(selectThemeMode);

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
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div
        ref={modalRef}
        className={`rounded-2xl p-8 w-full max-w-md shadow-xl border animate-fadeIn transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        <h2
          className={`text-2xl font-bold pb-4 mb-6 border-b transition-colors duration-300 ${
            themeMode === "dark"
              ? "text-gray-100 border-gray-700"
              : "text-gray-800 border-gray-200"
          }`}
        >
          {selectedType ? "Chỉnh sửa loại sản phẩm" : "Thêm loại sản phẩm mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thông tin cơ bản */}
          <div>
            <h3
              className={`text-sm font-semibold mb-4 transition-colors duration-300 ${
                themeMode === "dark" ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Thông tin loại sản phẩm
            </h3>

            {/* Tên loại sản phẩm */}
            <div className="mb-4">
              <label
                className={`text-sm font-medium block mb-2 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Tên loại sản phẩm
              </label>
              <input
                type="text"
                placeholder="Nhập tên loại sản phẩm..."
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 outline-none transition-all duration-300 ${
                  themeMode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    : "bg-white border-gray-200 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                }`}
                required
              />
            </div>

            {/* Mô tả */}
            <div>
              <label
                className={`text-sm font-medium block mb-2 transition-colors duration-300 ${
                  themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Mô tả
              </label>
              <textarea
                placeholder="Nhập mô tả loại sản phẩm..."
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`w-full border rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 outline-none transition-all duration-300 resize-none ${
                  themeMode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    : "bg-white border-gray-200 focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                }`}
                rows="4"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className={`px-5 py-2 rounded-lg border transition cursor-pointer ${
                themeMode === "dark"
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer font-medium"
            >
              {selectedType ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
