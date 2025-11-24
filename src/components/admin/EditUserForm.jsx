import React, { useRef } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export default function EditUserForm({
  user,
  formData,
  handleChange,
  handleAccountChange,
  handleUpdateUser,
  setShowForm,
}) {
  const modalRef = useRef(null);
  const themeMode = useSelector(selectThemeMode);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowForm(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.account.role.trim()) {
      toast.error("Vui lòng chọn vai trò!");
      return;
    }
    handleUpdateUser(e);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className={`w-[460px] max-w-full p-8 rounded-2xl shadow-xl border relative animate-fadeIn transition-colors duration-300 ${
          themeMode === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-100"
        }`}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className={`absolute top-4 right-4 transition cursor-pointer ${
            themeMode === "dark"
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <X size={22} />
        </button>

        <h2
          className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Chỉnh sửa người dùng
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-5">
                {/* User Info Display */}
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    themeMode === "dark"
                      ? "bg-gray-700"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-sm font-medium mb-2 ${
                      themeMode === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Thông tin người dùng
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span
                        className={`${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Họ tên:
                      </span>
                      <p
                        className={`font-medium ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        {user.lastName} {user.firstName}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Email:
                      </span>
                      <p
                        className={`font-medium ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        {user.email || "Chưa cập nhật"}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Tên đăng nhập:
                      </span>
                      <p
                        className={`font-medium ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        {user.account?.username}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`${
                          themeMode === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        SĐT:
                      </span>
                      <p
                        className={`font-medium ${
                          themeMode === "dark"
                            ? "text-gray-100"
                            : "text-gray-900"
                        }`}
                      >
                        {user.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                  <FormSelect
                    label="Vai trò"
                    name="role"
                    value={formData.account.role}
                    onChange={handleAccountChange}
                    required
                    className="cursor-pointer"
                    options={[
                      { value: "", label: "Chọn vai trò", disabled: true },
                      { value: "CUSTOMER", label: "Khách hàng" },
                      { value: "ADMIN", label: "Quản trị viên" },
                    ]}
                  />

                  <FormSelect
                    label="Loại người dùng"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="cursor-pointer"
                    options={[
                      {
                        value: "",
                        label: "Chọn loại người dùng",
                        disabled: true,
                      },
                      { value: "COPPER", label: "Đồng" },
                      { value: "SILVER", label: "Bạc" },
                      { value: "GOLD", label: "Vàng" },
                      { value: "PLATINUM", label: "Bạch kim" },
                    ]}
                  />

                  <FormInput
                    label="Điểm"
                    name="point"
                    type="number"
                    value={formData.point}
                    onChange={handleChange}
                    placeholder="Điểm"
                    className="cursor-text"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              className={`flex justify-end gap-3 pt-4 border-t mt-4 ${
                themeMode === "dark" ? "border-gray-600" : "border-gray-200"
              }`}
            >
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
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer font-medium"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
