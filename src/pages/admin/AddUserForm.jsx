import React, { useRef } from "react";
import { X } from "lucide-react";

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

  return (
    <div
      className="fixed inset-0 bg-black/70  flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-2xl shadow-2xl w-[420px] border border-gray-100 relative animate-fadeIn"
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          Tạo người dùng mới
        </h2>

        <form onSubmit={handleCreateUser} className="space-y-3">
          {/* Username */}
          <input
            name="username"
            placeholder="Username"
            value={formData.account.username}
            onChange={handleAccountChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
            required
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.account.password}
            onChange={handleAccountChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
            required
          />

          {/* Role */}
          <select
            name="role"
            value={formData.account.role}
            onChange={handleAccountChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
            required
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>

          {/* Email */}
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
          />

          {/* First name */}
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
            required
          />

          {/* Last name */}
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
            required
          />

          {/* Date of Birth */}
          <input
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-gray-300 focus:border-gray-300 outline-none transition"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
