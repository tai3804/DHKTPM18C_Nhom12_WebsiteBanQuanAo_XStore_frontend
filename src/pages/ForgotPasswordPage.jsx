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

  const isLoggedIn = !!user?.email;

  // step = 1 (Nhập Contact / Gửi OTP) | step = 2 (Xác thực OTP / Đặt MK)
  // Nếu đã đăng nhập, mặc định bắt đầu ở bước 2 vì OTP sẽ được gửi tự động ngay lập tức.
  const [step, setStep] = useState(isLoggedIn ? 2 : 1);

  // contactToReset: Email/Username/Phone sẽ được dùng để tìm tài khoản và reset MK.
  const [contactToReset, setContactToReset] = useState(user?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- GỬI OTP TỰ ĐỘNG KHI ĐÃ ĐĂNG NHẬP ---
  useEffect(() => {
    if (isLoggedIn && step === 2 && user?.email) {
      const sendInitialOtp = async () => {
        // Sử dụng email của người dùng đã đăng nhập để gửi OTP
        const result = await dispatch(sendResetPasswordOtp(user.email));
        if (result.type.endsWith("rejected")) {
          setStep(1);
          toast.error("Không thể gửi OTP tự động. Vui lòng thử lại.");
        }
      };
      sendInitialOtp();
    }
  }, [dispatch, isLoggedIn, step, user?.email]);

  // --- HÀM GỬI OTP THỦ CÔNG (Bước 1: Nhận Email hoặc Username) ---
  const handleSendOtp = async (e) => {
    e.preventDefault();

    const contact = contactToReset.trim();
    if (!contact) {
      toast.error("Vui lòng nhập Email hoặc Tên tài khoản!");
      return;
    }

    // Gửi contact (có thể là Email hoặc Username) cho backend.
    // Backend sẽ tìm tài khoản và gửi OTP về EMAIL đã đăng ký.
    const result = await dispatch(sendResetPasswordOtp(contact));

    if (result.type.endsWith("fulfilled")) {
      // Backend (OtpController) trả về contact đã gửi (hoặc email đã gửi)
      const sentContact = result.payload;
      toast.success(`Mã OTP đã được gửi tới email liên kết với: ${contact}`);
      setStep(2); // Chuyển sang bước 2
    } else {
      toast.error(
        "Không tìm thấy tài khoản hoặc không thể gửi OTP. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  // --- XÁC THỰC OTP VÀ ĐỔI MẬT KHẨU (Bước 2) ---
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không trùng khớp!");
      return;
    }

    // 1. Xác thực OTP
    const contact = contactToReset; // Contact dùng để verify (Email/Username)

    const verifyAction = await dispatch(verifyOtp({ contact: contact, otp }));

    if (verifyOtp.fulfilled.match(verifyAction)) {
      // 2. Đặt lại mật khẩu (Backend sẽ dùng contact này để tìm account và reset)
      const resetAction = await dispatch(
        resetPassword({ username: contact, newPassword })
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
    if (!contactToReset) {
      toast.error("Không tìm thấy thông tin để gửi lại OTP!");
      return;
    }

    const result = await dispatch(sendResetPasswordOtp(contactToReset));
    if (result.type.endsWith("fulfilled")) {
      toast.success(
        `Mã OTP mới đã được gửi tới email liên kết với ${contactToReset}`
      );
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
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-3xl font-bold text-center mb-6 ${
              isDark ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Quên Mật Khẩu
          </h2>

          {/* HIỂN THỊ DỰA TRÊN STEP */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Email hoặc Tên tài khoản
                </label>
                <input
                  type="text" // Dùng type="text" để nhập cả email hoặc username
                  value={contactToReset}
                  onChange={(e) => setContactToReset(e.target.value)}
                  placeholder="Nhập Email hoặc Tên tài khoản"
                  required
                  className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 mt-2 shadow-sm ${
                  isDark
                    ? "bg-cyan-600 text-white hover:bg-cyan-500"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                Gửi Mã OTP
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-800"
                  }`}
                >
                  Thông tin liên hệ
                </label>
                <input
                  type="text"
                  value={contactToReset}
                  disabled // Luôn disable ở bước 2
                  className={`w-full mt-1 p-3 border rounded-lg transition-all duration-200 cursor-not-allowed ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-400"
                      : "bg-gray-100 border-gray-300 text-gray-700"
                  }`}
                />
              </div>
              <p
                className={`text-center text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Mã OTP đã được gửi tới **email liên kết** với tài khoản **
                {contactToReset}**.
              </p>

              {/* --- Input OTP --- */}
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

              {/* --- Mật khẩu mới --- */}
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

              {/* --- Xác nhận mật khẩu mới --- */}
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
