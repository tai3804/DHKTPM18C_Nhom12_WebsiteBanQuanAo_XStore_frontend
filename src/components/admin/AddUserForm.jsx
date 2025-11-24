import React, { useRef } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

export default function AddUserForm({
  formData,
  handleChange,
  handleAccountChange,
  handleCreateUser,
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
    if (
      !formData.account.username.trim() ||
      !formData.account.password.trim() ||
      !formData.account.role.trim() ||
      !formData.firstName.trim() ||
      !formData.lastName.trim()
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }
    handleCreateUser(e);
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
          Tạo người dùng mới
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-5">
                {/* Account Info */}
                <div className="grid grid-cols-1 gap-3">
                  <FormInput
                    label="Tên đăng nhập"
                    name="username"
                    value={formData.account.username}
                    onChange={handleAccountChange}
                    placeholder="Tên đăng nhập"
                    required
                    className="cursor-text"
                  />

                  <FormInput
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    value={formData.account.password}
                    onChange={handleAccountChange}
                    placeholder="Mật khẩu"
                    required
                    className="cursor-text"
                  />

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
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Họ"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Họ"
                    required
                    className="cursor-text"
                  />
                  <FormInput
                    label="Tên"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Tên"
                    required
                    className="cursor-text"
                  />
                </div>

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="cursor-text"
                />

                <FormInput
                  label="Ngày sinh"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
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
                Thêm mới
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
