// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  sendResetPasswordOtp,
  verifyOtp,
  resetPassword,
} from "../slices/AuthSlice";
import Header from "../components/header/Header";
import Footer from "../components/common/Footer";
import { selectThemeMode } from "../slices/ThemeSlice";

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const [contactInfo, setContactInfo] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- GỬI OTP TỰ ĐỘNG KHI VÀO TRANG ---
  useEffect(() => {
    const sendInitialOtp = async () => {
      if (!contactInfo) {
        toast.error("Vui lòng nhập email để tiếp tục!");
        return;
      }

      const result = await dispatch(sendResetPasswordOtp(contactInfo));
      if (result.type.endsWith("fulfilled")) {
        toast.success(`Mã OTP đã được gửi đến: ${contactInfo}`);
      } else {
        toast.error("Không thể gửi OTP. Vui lòng thử lại sau.");
      }
    };

    sendInitialOtp();
  }, [dispatch, contactInfo]);

  // --- XÁC THỰC OTP VÀ ĐỔI MẬT KHẨU ---
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Vui lòng nhập mã OTP!");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ mật khẩu!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không trùng khớp!");
      return;
    }

    const verifyAction = await dispatch(
      verifyOtp({ contact: contactInfo, otp })
    );

    if (verifyOtp.fulfilled.match(verifyAction)) {
      const resetAction = await dispatch(
        resetPassword({ username: contactInfo, newPassword })
      );

      if (resetPassword.fulfilled.match(resetAction)) {
        toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } else {
      toast.error("OTP không hợp lệ hoặc đã hết hạn!");
    }
  };

  // --- GỬI LẠI OTP ---
  const handleResendOtp = async () => {
    if (!contactInfo) {
      toast.error("Vui lòng nhập email trước khi gửi lại OTP!");
      return;
    }

    const result = await dispatch(sendResetPasswordOtp(contactInfo));
    if (result.type.endsWith("fulfilled")) {
      toast.success(`Mã OTP mới đã được gửi đến: ${contactInfo}`);
    } else {
      toast.error("Không thể gửi lại OTP. Vui lòng thử lại.");
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header />
      <div className="flex-grow flex items-center justify-center py-12 px-4">
        <div
          className={`w-full max-w-md p-8 rounded-lg shadow-lg border transition-all duration-300 ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-3xl font-bold text-center mb-6 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Quên Mật Khẩu
          </h2>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                disabled
                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <p
              className={`text-center text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Mã OTP sẽ được gửi đến email đã nhập
            </p>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Mã OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Nút xác nhận */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 mt-2 shadow-sm ${
                isDark
                  ? "bg-cyan-600 text-white hover:bg-cyan-500"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              Xác nhận và Đặt lại mật khẩu
            </button>

            {/* Nút gửi lại OTP */}
            <button
              type="button"
              onClick={handleResendOtp}
              className={`w-full text-center text-sm mt-2 transition-colors duration-200 ${
                isDark
                  ? "text-gray-400 hover:text-cyan-400"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              Gửi lại mã OTP?
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
