// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { changePassword } from "../slices/UserSlice";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Vui lòng điền đầy đủ thông tin.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp.");
    }

    try {
      const resultAction = await dispatch(
        changePassword({
          id: user.id,
          oldPassword,
          newPassword,
          token,
        })
      );

      if (changePassword.fulfilled.match(resultAction)) {
        toast.success("Đổi mật khẩu thành công!");
        navigate("/user");
      } else {
        const error = resultAction.payload || resultAction.error.message;
        toast.error(`Đổi mật khẩu thất bại: ${error}`);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  if (!user)
    return (
      <div
        className={`min-h-screen flex flex-col ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <Header />
        <p className="text-center mt-10">Đang tải thông tin...</p>
        <Footer />
      </div>
    );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gradient-to-b from-white to-gray-50 text-gray-900"
      }`}
    >
      <Header />
      <div className="flex-grow container mx-auto p-4 py-12 max-w-md">
        <div
          className={`p-6 rounded-lg shadow-lg border transition-colors duration-300 ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Đổi mật khẩu
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mật khẩu cũ
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu cũ"
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <button
              onClick={handleChangePassword}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                isDark
                  ? "bg-green-600 hover:bg-green-500 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              Xác nhận đổi mật khẩu
            </button>

            <button
              onClick={() => navigate("/user")}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
