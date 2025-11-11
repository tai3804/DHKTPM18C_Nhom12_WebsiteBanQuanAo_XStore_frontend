import React, { useRef } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

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
        className="bg-white w-[460px] max-w-full p-8 rounded-2xl shadow-xl border border-gray-100 relative animate-fadeIn"
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Tạo người dùng mới
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                { value: "", label: "-- Chọn vai trò --" },
                { value: "CUSTOMER", label: "Khách hàng" },
                { value: "ADMIN", label: "Quản trị viên" },
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition cursor-pointer"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
